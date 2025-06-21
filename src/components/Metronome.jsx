import { useState, useRef, useEffect } from 'react'
import metronomeSound from '/Synth_Block_D_hi.wav'

function Metronome() {
  const [bpm, setBpm] = useState(60)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio(metronomeSound)
  }, [])

  const playClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  const startMetronome = () => {
    setIsPlaying(true)
    const intervalTime = (60 / bpm) * 1000 // in milliseconds

    intervalRef.current = setInterval(() => {
      playClick()
    }, intervalTime)
  }

  const stopMetronome = () => {
    setIsPlaying(false)
    clearInterval(intervalRef.current)
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      stopMetronome()
    }
  }

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(intervalRef.current) // clear interval on unmount
    }
  }, [])

  return (
    <>
      <button onClick={isPlaying ? stopMetronome : startMetronome}>
        {isPlaying ? 'Stop Metronome' : 'Start Metronome'}
      </button>
    </>
  )
}

export default Metronome