// Override console logs to prevent excessive printing in the console, as requested
if (import.meta.env.MODE === 'development' || true) {
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
 <React.StrictMode>
 <App />
 </React.StrictMode>,
)
