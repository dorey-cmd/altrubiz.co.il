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
    getAllArticles: () => (loadRoutes().getAllArticles ? loadRoutes().getAllArticles() : loadRoutes().ARTICLES),
    getPublishedArticles: () => (loadRoutes().getPublishedArticles ? loadRoutes().getPublishedArticles() : loadRoutes().ARTICLES.filter(a => a.publicationStatus === 'published')),
    getIndexableArticles: () => (loadRoutes().getIndexableArticles ? loadRoutes().getIndexableArticles() : loadRoutes().ARTICLES.filter(a => a.publicationStatus === 'published' && a.indexable === true)),
    getReviewArticles: () => (loadRoutes().getReviewArticles ? loadRoutes().getReviewArticles() : loadRoutes().ARTICLES.filter(a => a.publicationStatus === 'review')),
    getDraftArticles: () => (loadRoutes().getDraftArticles ? loadRoutes().getDraftArticles() : loadRoutes().ARTICLES.filter(a => a.publicationStatus === 'draft')),
    getMachineEligibleArticles: () => (loadRoutes().getMachineEligibleArticles ? loadRoutes().getMachineEligibleArticles() : loadRoutes().ARTICLES.filter(a => a.publicationStatus === 'published' && a.indexable === true)),
    getArticleBySlug: (slug) => (loadRoutes().getArticleBySlug ? loadRoutes().getArticleBySlug(slug) : loadRoutes().ARTICLES.find(a => a.slug === slug)),
    getArticleByPublicPath: (path) => (loadRoutes().getArticleByPublicPath ? loadRoutes().getArticleByPublicPath(path) : undefined),
    getAllHubs: () => (loadRoutes().getAllHubs ? loadRoutes().getAllHubs() : []),
    getParentHubForArticle: (slug) => (loadRoutes().getParentHubForArticle ? loadRoutes().getParentHubForArticle(slug) : undefined),
    get CANONICAL_CONCEPTS() { return loadRoutes().CANONICAL_CONCEPTS || {}; },
    resolveCanonicalConcept: (id) => (loadRoutes().resolveCanonicalConcept ? loadRoutes().resolveCanonicalConcept(id) : undefined),
    BASE_CANONICAL_DOMAIN: 'https://altrubiz.co.il'
};
