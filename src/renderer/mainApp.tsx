import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import App from './App';

console.log(React);

const params = new URLSearchParams(window.location.search);
const initialRoute = params.get('route') || '/gamepads';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App initialRoute={initialRoute} />
  </React.StrictMode>,
);
