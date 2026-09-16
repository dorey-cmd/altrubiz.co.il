import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-54QJXTYSK4';

export function initAnalytics() {
    if (!import.meta.env.PROD) return;
    // Disable gtag's own automatic page_view on init — SPA route changes are
    // tracked explicitly via trackPageview() so every client-side navigation
    // (not just full page loads) is captured, with no duplicate initial hit.
    ReactGA.initialize(GA_MEASUREMENT_ID, {
        gtagOptions: { send_page_view: false },
    });
}

export function trackPageview(path: string, title?: string) {
    if (!import.meta.env.PROD || !ReactGA.isInitialized) return;
    ReactGA.send({ hitType: 'pageview', page: path, title });
}
