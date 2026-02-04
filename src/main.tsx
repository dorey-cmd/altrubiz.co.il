import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Client-side redirect for any path that isn't root
if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    window.location.replace('/');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
