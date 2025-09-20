import React from 'react';
import ReactDOM from 'react-dom/client';
import APP from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <APP />
  </React.StrictMode>
);
serviceWorkerRegistration.register();