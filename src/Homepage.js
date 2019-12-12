import React from 'react';
import './App.css';
import logo from './lc.png';


function Homepage() {
  return (
    <div>
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>just testing things out</p>
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

export default Homepage;
