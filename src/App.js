import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div id="droparea" />
      <div id="container">
        <div id="header">
          <h1>
            SendSend
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
