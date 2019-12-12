import React from 'react';
import logo from './lc.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>
        welcome to lazycorn.io
      </h1>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          just testing things out
        </p>
        <a
          className="App-link"
          href="https://lazycorn-16aa7.firebaseapp.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          lazycorn website URL
        </a>
      </header>
    </div>
  );
}

export default App;
