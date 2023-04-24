import { useState, useEffect } from 'react'
import {
  ThreekitProvider,
  PortalToElement,
  FlatForm,
} from '@threekit-tools/treble'
import Player from '../../components/Player'
import { io } from 'socket.io-client'
const queryParameters = new URLSearchParams(window.location.search)
const room = queryParameters.get('room') || 'lobby'
const mode = queryParameters.get('mode') || 'viewer'
const socket = io('http://localhost:8080/?room=' + room)

const RealTime = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  useEffect(() => {
    function onConnect () {
      setIsConnected(true)
    }
    function onDisconnect () {
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    // listen to events
    socket.on('configChange', arg => console.log('========================='))

    socket.on('configChange', arg => {
      let config = arg
      delete config['room']
      window.threekit.configurator.setConfiguration(config)
    })

    // connect to 'room'
    var myHeaders = new Headers()
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch('http://localhost:8080?room=' + room, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error))

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [])
  return (
    <ThreekitProvider>
      <div>
        <div className='status-board'>
          <p>
            Connected: <b>{JSON.stringify(isConnected)}</b>
          </p>
          <p>
            You are in room: <b>{room}</b>
          </p>
          <p>
            You are in <b>{mode}</b> mode
          </p>
        </div>
        <div
          className='threekit-items'
          style={
            mode === 'config'
              ? {
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap-reverse',
                }
              : { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }
          }
        >
          <div
            className='tk-treble-player player-container'
            style={mode === 'config' ? {visibility: 'hidden'} : {visibility: 'visible'} }
          >
            <Player socket={socket} room={room} />
          </div>
          <div
            className='form-container'
            style={
              mode === 'config'
                ? { width: '100%' }
                : {} || mode == 'viewer'
                ? { display: 'none' }
                : {}
            }
          >
            <FlatForm />
          </div>
        </div>
      </div>
    </ThreekitProvider>
  )
}

export default RealTime
