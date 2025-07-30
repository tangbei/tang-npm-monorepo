import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

/**
 * React应用入口文件
 * 使用React 18的createRoot API
 */

const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 