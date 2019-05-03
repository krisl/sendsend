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
  const [file, setFile] = useState()
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
          console.log('files', e.dataTransfer.files.length)
          for (const file of e.dataTransfer.files) {
            console.log(file)
          }
          setDropState('WAITING')
          setFile(e.dataTransfer.files[0])
          stopEvent(e)
          e.persist()
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
                : (
                  dropState === 'HOVER' ? 'Drop it!'
                  : dropState === 'WAITING' ? (
                    <>
                      <p>{file.name}</p>
                      <p>{file.size}</p>
                      <p>{file.type}</p>
                    </>
                  )
                  : `id: ${sessionState.id}`
                )
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
        <div id="message" className={dropState === 'WAITING' ? 'open' : ''}>
          <span id="message-text">
            {dropState === 'WAITING' &&
              <>
                <span className="icon">✔</span>
                {'File is ready '}
                <span id='share' className='link'>
                  {`${document.URL}#${sessionState.id}`}
                </span>
              </>
            }
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
