import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { LayoutProvider } from './params/LayoutContext.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <LayoutProvider>
        <App />
      </LayoutProvider>
    </Provider>
  </React.StrictMode>
);
