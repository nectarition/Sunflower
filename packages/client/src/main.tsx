import React from 'react'
import ReactDOM from 'react-dom/client'
import { getFirebaseApp } from './libs/FirebaseApp'
import App from './pages/App/App'
import './index.css'

getFirebaseApp()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
