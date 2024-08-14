function WordDisplay( { word, showMeaning, toggleMeaning, onMeaningClick } ) {
    if (word === null)
      return (<br/>)
  
    return (
      <table>
        <tbody>
          <tr>
            <td><button className='clickable-text' onClick={() => toggleMeaning(!showMeaning)}><strong>{word.word}</strong></button></td>
          </tr>
          <tr>
            <td>
              {!showMeaning ? '' : 
                <button className='clickable-text' onClick={() => onMeaningClick() || toggleMeaning(false)}><small><em>{word.meaning}</em></small></button>
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
    )
  }

  export default WordDisplay