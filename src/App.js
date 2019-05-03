import React, { useEffect, useState } from 'react';
import Peer from 'peerjs';
import './App.css';

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
  const [sessionState, setSessionState] = useState({loading: true})
  const [dropState, setDropState] = useState()
  const [file, setFile] = useState()
  useEffect(
    () => {
      const session = new Peer()
      console.log({session})
      session.on('open', id => {
        console.log({id})
        setSessionState({loading: false, id, session})

        const peerId = getPeerId()
        if (peerId) {
          console.log('need to connect to ' + peerId)

          const connectToHost = peerId => {
            // make a file and data connection
            const file = session.connect(peerId, {label: 'FILE'})
            const data = session.connect(peerId, {label: 'DATA'})
            setSessionState(s => ({...s, loading: false, waiting: true}))

            file.on('open', (o) => {
              console.log('file connection open', o);
              file.on('data', (d) => {
                console.log('fdata', {d})
                const file = d.file
                if (file && file.constructor === ArrayBuffer) {
                  const dataView = new Uint8Array(file)
                  const dataBlob = new Blob([dataView], {type: d.type})
                  const url = window.URL.createObjectURL(dataBlob)
                  setSessionState(s => ({...s, completed: true, url, type: d.type, size: d.size, name: d.name, dataBlob}))
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
    sessionState.session.on('connection', connection => {
      if (connection.label === 'FILE') {
        console.log('incomming file connection');
        setSessionState(s => ({...s, loading: false, transferring: true}))
        connection.on('open', (x) => {
          console.log('incomming file connection open', connection)
          connection.send({file, name: file.name, size: file.size, type: file.type})
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
      {/* TODO only enable drop area after connection */}
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
          const theFile = e.dataTransfer.files[0]
          setDropState('WAITING')
          setFile(theFile)
          listenForPeer(theFile)
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
              ? dropState === 'HOVER'
                ? 'hover'
                : sessionState.waiting ? '...waiting' : 'ready'
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
        <div id="message" className={(dropState === 'WAITING' || sessionState.completed) ? 'open' : ''}>
          <span id="message-text">
            {(dropState === 'WAITING' || sessionState.completed) &&
              <>
                <span className="icon">✔</span>
                {'File is ready '}
                {sessionState.completed && (
                  <span>
                    {sessionState.type} {sessionState.size} -
                    <a target="_blank" className="link" href={sessionState.url} download={sessionState.name}>
                      Click here to download
                    </a>
                  </span>
                )}
                {dropState === 'WAITING' && (
                  <span id='share' className='link'>
                    {`${document.URL}#${sessionState.id}`}
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
