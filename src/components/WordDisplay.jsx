import { useRef } from 'react'
import './WordDisplay.css'


function WordDisplay( { word, showMeaning, toggleMeaning, onRightClick, onWrongClick, picture, swapMeanings } ) {
  if (word === null)
    return (<br/>)



    const handleWordClick = () => {
      toggleMeaning(true)
    }

    const handleRightClick = () => {
      onRightClick()
    }

    return (
      <div className='flash-card'>
        

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
                        <small>{word.sentence}</small>
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
                    <td><table><tbody><tr>
                      <td>
                        <button onClick={onWrongClick} id='wrong-button'>wrong</button>
                      </td>
                      <td>
                        <button onClick={handleRightClick} id='right-button'>right</button>
                      </td>
                      </tr></tbody></table></td> 
                  </tr>
                </tbody>
              </table>
          }
      </div>
    )
  }

  export default WordDisplay