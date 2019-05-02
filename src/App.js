import React, { useEffect, useState } from 'react';
import Peer from 'peerjs';
import './App.css';

function stopEvent (e) {
  e.preventDefault()
  e.stopPropagation()
}

function App() {
  const [sessionState, setSessionState] = useState({loading: true})
  const [dropState, setDropState] = useState()
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
        onDragOver={e => {console.log('dragover'); stopEvent(e)}}
        onDragEnter={e => {
          console.log('dragenter', e);
          setDropState('HOVER')
          stopEvent(e)
        }}
        onDragLeave={e => {
          console.log('dragleave', e);
          setDropState()
          stopEvent(e)
        }}
        onDrop={e => {
          console.log('drop', e);
          setDropState()
          stopEvent(e)
        }}
      />
      <div id="container">
        <div id="header">
          <h1>
            SendSend
          </h1>
          <h2>
            Peer to peer single file transfer
          </h2>
        </div>
        <div
          id="status"
          className={
            sessionState.id
              ? dropState === 'HOVER' ? 'hover' : 'ready'
              : ''
          }
        >
          <div id="status-inner">
            <span id="status-text">
              {sessionState.loading
                ? <p className="loading">Loading...</p>
                : dropState === 'HOVER' ? 'Drop it!' : `id: ${sessionState.id}`
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
