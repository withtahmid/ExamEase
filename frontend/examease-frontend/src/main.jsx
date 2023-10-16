import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import SignIn from './routes/SignIn.jsx';
import Settings from './routes/Settings.jsx';
import NotFound from './routes/NotFound.jsx';
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <App />

  </React.StrictMode>,
)
