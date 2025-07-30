import React from 'react';
import './App.css';

/**
 * 主应用组件
 * 这是应用的根组件
 */
const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to PROJECT_NAME</h1>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App; 