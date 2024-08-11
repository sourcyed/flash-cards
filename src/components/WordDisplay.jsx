function WordDisplay( { word, showMeaning, toggleMeaning } ) {
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
              <small><em>{showMeaning ? word.meaning : ''}</em></small>
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