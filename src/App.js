import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
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
      <div id="droparea" />
      <div id="container">
        <div id="header">
          <h1>
            Sendsend
          </h1>
          <h2>
            Simple peer to peer file transfer.
          </h2>
	</div>
	<div id="status">
	  <div id="status-inner">
	    <span id="status-text" />
          </div>
        </div>
        <div id="progress">
          <div id="progress-first">
          </div>
          <div id="progress-second">
          </div>
        </div>
        <div id="message">
          <span id="message-text"></span>
        </div>
      </div>
    </div>
  );
}

export default App;
