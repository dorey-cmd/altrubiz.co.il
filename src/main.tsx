import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { getRouteConfig } from './lib/routes'

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
