import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Client-side redirect logic
const currentPath = window.location.pathname;
if (currentPath === '/zoom') {
    window.location.replace('https://us06web.zoom.us/j/9725443500#success');
} else if (currentPath === '/caldorey') {
    window.location.replace('https://link.altrubiz.co.il/widget/bookings/caldorey');
} else if (currentPath !== '/' && currentPath !== '/index.html' && currentPath !== '/offer') {
    window.location.replace('/');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
