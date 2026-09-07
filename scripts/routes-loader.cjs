const path = require('path');
const esbuild = require('esbuild');

let cachedExports = null;

/**
 * Dynamically loads and compiles `src/lib/routes.ts` using esbuild in-memory.
 * Returns the evaluated module exports.
 */
function loadRoutes(forceReload = false) {
    if (cachedExports && !forceReload) {
        return cachedExports;
    }

    const routesTsPath = path.resolve(__dirname, '../src/lib/routes.ts');

    const buildResult = esbuild.buildSync({
        entryPoints: [routesTsPath],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        write: false,
        sourcemap: false,
        target: 'node18'
    });

    if (!buildResult.outputFiles || buildResult.outputFiles.length === 0) {
        throw new Error(`Failed to compile ${routesTsPath} with esbuild.`);
    }

    const code = buildResult.outputFiles[0].text;
    const moduleScope = { exports: {} };

    const wrapper = new Function(
        'module',
        'exports',
        'require',
        '__dirname',
        '__filename',
        code
    );

    wrapper(
        moduleScope,
        moduleScope.exports,
        require,
        path.dirname(routesTsPath),
        routesTsPath
    );

    cachedExports = moduleScope.exports;
    return cachedExports;
}

module.exports = {
    loadRoutes,
    getRoutesRegistry: () => loadRoutes().getRoutesRegistry(),
    getAllPublicRoutes: () => loadRoutes().getAllPublicRoutes(),
    getArticles: () => loadRoutes().ARTICLES,
    BASE_CANONICAL_DOMAIN: 'https://altrubiz.co.il'
};
