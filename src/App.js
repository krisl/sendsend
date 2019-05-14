import React, { useEffect, useState } from 'react';
import Peer from 'peerjs';
import './App.css';

// TODO tidy state machine
// TODO error handling / timeouts
// TODO progress indicator
// TODO multiple file support
// TODO "room" support
// TODO support recipient connecting before files dropped

function stopEvent (e) {
  e.preventDefault()
  e.stopPropagation()
}

const getPeerId = () => {
  const hash = window.location.hash
  if (hash && typeof hash === 'string')
    return hash.replace(/\W/g, '')
}

function App() {
  const [appState, setAppState] = useState({state: 'registering'})
  const [dropState, setDropState] = useState()
  useEffect(
    () => {
      const session = new Peer(undefined, {debug: 3})
      console.log({session})
      session.on('open', id => {
        console.log({id})
        const peerId = getPeerId()
        setAppState({
          state: peerId ? 'connectingToHost' : 'waitingForFileSelection',
          id, session
        })

        if (peerId) {
          console.log('need to connect to ' + peerId)

          const connectToHost = peerId => {
            // make a file and data connection
            const file = session.connect(peerId, {label: 'FILE', reliable: true})
            const data = session.connect(peerId, {label: 'DATA'})
            setAppState(s => ({...s, state: 'waitingToReceive'}))

            file.on('open', (o) => {
              console.log('file connection open', o);
              file.on('data', (d) => {
                console.log('fdata', {d})
                const file = d.file
                if (file && file.constructor === ArrayBuffer) {
                  const dataView = new Uint8Array(file)
                  const dataBlob = new Blob([dataView], {type: d.type})
                  const url = window.URL.createObjectURL(dataBlob)
                  setAppState(s => ({...s, state: 'completed', url, type: d.type, size: d.size, name: d.name, dataBlob}))
                } else {
                  console.log('oops')
                }
              })
            })

            data.on('open', (o) => {
              console.log('data connection open', o);
              data.on('data', (d) => console.log('ddata', {d}))
            })

            file.on('error', e => console.log('file error', e))
            data.on('error', e => console.log('data error', e))
          }

          connectToHost(peerId)
        }
      })
    },
    []
  )

  const listenForPeer = file => {
    appState.session.on('connection', connection => {
      if (connection.label === 'FILE') {
        console.log('incomming file connection');
        setAppState(s => ({...s, state: 'transferring'}))
        connection.on('open', (x) => {
          console.log('incomming file connection open', connection)
          connection.send({file, name: file.name, size: file.size, type: file.type})
          setAppState(s => ({...s, state: 'waitingForClientConnections'}))
        })
      }

      if (connection.label === 'DATA') {
        console.log('incomming data connection');
        connection.on('open', () => {
          console.log('incomming data connection open', connection)
          connection.send({name: 'bobx'})
        })
      }
    })
  }

  return (
    <div className="App">
      <div id="droparea"
        style={
          appState.state === 'waitingForFileSelection'
            ? {}
            : {display: 'none'}
        }
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
          const file = e.dataTransfer.files[0]
          setDropState()
          setAppState(s => ({...s, state: 'waitingForClientConnections', file}))
          listenForPeer(file)
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
            appState.id
              ? dropState === 'HOVER'
                ? 'hover'
                : appState.state === 'waitingToReceive' ? 'waiting' : 'ready'
              : ''
          }
        >
          <div id="status-inner">
            <span id="status-text">
              {appState.state === 'loading'
                ? <p className="loading">Loading...</p>
                : (
                  appState.state === 'waitingForClientConnections' ? (
                    <>
                      <p>{appState.file.name}</p>
                      <p>{appState.file.size}</p>
                      <p>{appState.file.type}</p>
                    </>
                  )
                  : appState.state === 'transferring' ? 'transferring...'
                  : dropState === 'HOVER' ? 'Drop it!'
                  : `id: ${appState.id}`
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
        <div id="message" className={(appState.state === 'waitingForClientConnections' || appState.state === 'completed') ? 'open' : ''}>
          <span id="message-text">
            {(appState.state === 'waitingForClientConnections' || appState.state === 'completed') &&
              <>
                <span className="icon">✔</span>
                {'File is ready '}
                {appState.state === 'completed' && (
                  <span>
                    {appState.type} {appState.size} -
                    <a target="_blank" className="link" href={appState.url} download={appState.name}>
                      Click here to download
                    </a>
                  </span>
                )}
                {appState.state === 'waitingForClientConnections' && (
                  <span id='share' className='link'>
                    {`${document.URL}#${appState.id}`}
                  </span>
                )}
              </>
            }
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
