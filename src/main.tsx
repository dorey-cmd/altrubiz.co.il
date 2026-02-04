import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Client-side redirect logic
if (window.location.pathname === '/zoom') {
    window.location.replace('https://us06web.zoom.us/j/9725443500#success');
} else if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    window.location.replace('/');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
