import { useState, useEffect } from 'react'


import { Landing, VP, RealTime } from './pages'

const App = () => {
  useEffect(() => {
    return () => {}
  }, [])

  return (
    <div className='app'>
      <RealTime />
    </div>
  )
}

export default App
