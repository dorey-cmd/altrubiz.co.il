import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { getRouteConfig } from './lib/routes'
import { initClarity } from './lib/clarity'
import { initAnalytics } from './lib/analytics'

// Site-wide Microsoft Clarity + Google Analytics — initialized once at the
// app's single entry point, so every current and future route (static pages,
// articles, knowledge hubs) automatically inherits both without per-page wiring.
initClarity()
initAnalytics()

// Client-side redirect logic for external shortlinks
const currentPath = window.location.pathname;
if (currentPath === '/zoom') {
    window.location.replace('https://us06web.zoom.us/j/9725443500#success');
} else if (currentPath === '/caldorey') {
    window.location.replace('https://link.altrubiz.co.il/widget/bookings/caldorey');
} else {
    // Validate whether current path is a recognized static route, article, topic hub, or hash anchor
    const isKnownRoute = 
        currentPath === '/' || 
        currentPath === '/index.html' || 
        currentPath.startsWith('/#') ||
        !!getRouteConfig(currentPath);

    if (!isKnownRoute) {
        window.location.replace('/');
    }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
