import { useRef, useEffect, useState } from 'react'
import correctSound from '/correct.mp3'


function WordDisplay( { word, showMeaning, toggleMeaning, onMeaningClick, picture, swapMeanings } ) {
  if (word === null)
    return (<br/>)

    const audioRef = useRef(null)

    const handleWordClick = () => {
      toggleMeaning(!showMeaning)
    }

    const handleMeaningClick = () => {
      onMeaningClick()
      if (audioRef.current)
      {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
      else
        console.log("couldn't find audio file")
    }

    return (
      <div>
        <audio ref={audioRef}>
          <source src={correctSound} type='audio/mpeg'/>
          Your browser does not support the audio element.
        </audio>
        <table>
          <tbody>
            <tr>
              <td><button className='clickable-text' onClick={handleWordClick}><strong>{!swapMeanings ? word.word : word.meaning}</strong></button></td>
            </tr>
            <tr>
              <td>
                {!showMeaning ? '' : 
                  <button className='clickable-text' onClick={handleMeaningClick}><small><em>{!swapMeanings ? word.meaning : word.word}</em></small></button>
                }
              </td>
            </tr>
            <tr>
              <td>
                {!showMeaning || !picture ? '' :
                  <img src={picture} alt="" />
                }
              </td>
            </tr>
            {/* <tr>
              <td>{word.sentence}</td>
            </tr>
            <tr>
              <td>{word.sentenceMeaning}</td>
            </tr> */}
            {/* <tr>
              <td>{word.picture}</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    )
  }

  export default WordDisplay