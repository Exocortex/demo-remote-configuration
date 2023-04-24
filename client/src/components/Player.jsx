import { useEffect, useRef } from 'react'
import { usePlayerPortal, useThreekitInitStatus } from '@threekit-tools/treble'
const PLAYER_DIV_ID = 'tk-player-component'

export default function Player (props) {
  const { socket, room } = props
  const hasLoaded = useThreekitInitStatus()

  const [portalPlayerTo, portalBack] = usePlayerPortal()
  const hasMoved = useRef(false)





  useEffect(() => {
    if (portalPlayerTo && !hasMoved.current) {
      portalPlayerTo(PLAYER_DIV_ID)
      hasMoved.current = true
    }
    if (hasLoaded) {
      window.threekit.player.on('setConfiguration', e => {
        let config = e.configuration
        config.room = room
        if(socket){
          socket.emit('configChange', JSON.stringify(config))
        }
      })
    }

    return () => {
      if (portalBack) {
        portalBack()
        hasMoved.current = false
      }
    }
  }, [portalPlayerTo])

  return (
    <div className='h-full max-w-screen-sm'>
      <div id={PLAYER_DIV_ID} className='h-full' style={{ height: '500px' }} />
      {props.children}
    </div>
  )
}
