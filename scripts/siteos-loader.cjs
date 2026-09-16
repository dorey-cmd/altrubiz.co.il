const path = require('path');
const esbuild = require('esbuild');

let cachedExports = null;

/**
 * Dynamically loads and compiles `src/siteos/index.ts` using esbuild
 * in-memory, mirroring the existing routes-loader.cjs pattern. Every
 * import inside src/siteos/ from src/data/*.ts is `import type` only
 * (erased at compile time), so this bundle stays small and never
 * duplicates the real article/knowledge-graph data — callers pass real
 * data objects (from routes-loader.cjs) into the returned functions.
 */
function loadSiteOS(forceReload = false) {
    if (cachedExports && !forceReload) {
        return cachedExports;
    }

    const entryPath = path.resolve(__dirname, '../src/siteos/index.ts');

    const buildResult = esbuild.buildSync({
        entryPoints: [entryPath],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        write: false,
        sourcemap: false,
        target: 'node18'
    });

    if (!buildResult.outputFiles || buildResult.outputFiles.length === 0) {
        throw new Error(`Failed to compile ${entryPath} with esbuild.`);
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
        path.dirname(entryPath),
        entryPath
    );

    cachedExports = moduleScope.exports;
    return cachedExports;
}

module.exports = { loadSiteOS };
