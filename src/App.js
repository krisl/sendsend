import React, { useEffect, useState } from 'react';
import Peer from 'peerjs';
import './App.css';

function App() {
  const [sessionState, setSessionState] = useState({loading: true})
  useEffect(
    () => {
      const session = new Peer()
      console.log({session})
      session.on('open', id => {
        console.log({id})
        setSessionState({loading: false, id})
      })
    },
    []
  )
  return (
    <div className="App">
      <div id="droparea"
        onDragOver={e => {console.log('dragover'); e.preventDefault()}}
        onDragEnter={e => {console.log('dragenter', e); e.preventDefault()}}
        onDragLeave={e => {console.log('dragleave', e); e.preventDefault()}}
        onDrop={e => {console.log('drop', e); e.preventDefault()}}
      />
      <div id="container">
        <div id="header">
          <h1>
            SendSend
          </h1>
          <h2>
            Peer to peer file transfer.
          </h2>
        </div>
        <div id="status" className={sessionState.id ? 'ready' : ''}>
          <div id="status-inner">
            <span id="status-text">
              {sessionState.loading
                ? <p className="loading">Loading...</p>
                : `id: ${sessionState.id}`
              }
            </span>
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
