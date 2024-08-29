import { useRef, useEffect, useState } from 'react'
import correctSound from '/correct.mp3'
import './WordDisplay.css'


function WordDisplay( { word, showMeaning, toggleMeaning, onRightClick, onWrongClick, picture, swapMeanings } ) {
  if (word === null)
    return (<br/>)

    const audioRef = useRef(null)

    const handleWordClick = () => {
      toggleMeaning(!showMeaning)
    }

    const handRightClick = () => {
      onRightClick()
      if (audioRef.current)
      {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
      else
        console.log("couldn't find audio file")
    }

    return (
      <div className='flash-card'>
        <audio ref={audioRef}>
          <source src={correctSound} type='audio/mpeg'/>
          Your browser does not support the audio element.
        </audio>

        {
          !showMeaning
            ? <button className='pulse' onClick={handleWordClick} style={ {width: '100%', height: '100%'}}><h3>{!swapMeanings ? word.word : word.meaning}</h3></button>
            : 
              <table style={ {width: '100%'}}>
                <tbody>
                  <tr>
                    <td>
                      <strong>{!swapMeanings ? word.word : word.meaning}</strong>
                    </td>
                  </tr>
                  
                  {!showMeaning ? '' : 
                  <tr>
                    <td>
                        <small><em>{!swapMeanings ? word.meaning : word.word}</em></small>
                    </td>
                  </tr>
                  }
                  
                  {!showMeaning ? '' :
                  <tr>
                    <td>
                        <p className='long-text'>{word.sentence}</p>
                    </td>
                  </tr>
                  }
                  
                  {!showMeaning || !picture ? '' :
                  <tr>
                    <td>
                        <img src={picture} alt="" />
                    </td>
                  </tr>
                  }
                  
                  <tr>
                    <td><table><tr>
                      <td>
                        <button onClick={onWrongClick} style={{backgroundColor: 'darkred'}}>wrong</button>
                      </td>
                      <td>
                        <button onClick={handRightClick} style={{backgroundColor: 'darkgreen'}}>right</button>
                      </td>
                      </tr></table></td> 
                  </tr>
                </tbody>
              </table>
          }
      </div>
    )
  }

  export default WordDisplay