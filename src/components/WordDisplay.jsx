import './WordDisplay.css'

function WordDisplay( { word, showMeaning, toggleMeaning, onRightClick, onWrongClick, swapMeanings, replacePicture } ) {
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
            ? <button className='pulse word-button' onClick={handleWordClick}><h3>{!swapMeanings ? word.word : word.meaning}</h3></button>
            : 
              <table className='flash-card-table 'style={ {width: '100%', height: '100%'}}>
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
                  
                  {!showMeaning || !word.picture ? '' :
                  <tr style={{height: '210px'}}>
                    <td>
                        <img src={word.picture} alt="" onClick={replacePicture}/>
                    </td>
                  </tr>
                  }
                  
                  <tr>
                    <td><table><tbody><tr>
                      <td>
                        <button onClick={onWrongClick} className='card-button' id='wrong-button'>wrong</button>
                      </td>
                      <td>
                        <button onClick={handleRightClick} className='card-button' id='right-button'>right</button>
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