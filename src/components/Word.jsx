function Word( { word, wordNumber, onHighlight, showMeanings, delHandler }) {
  
    return (
      <tr>
        <td className='wordNumber'>
          {wordNumber}. &nbsp;
          <button className='delete' onClick={delHandler}>X</button>
        </td>
        <td>
          <button className='clickable-text' onClick={() => onHighlight(word)}>
            {word.word}
          </button> 
        </td>
        <td className='wordMeaning'>
          <small>{showMeanings ? word.meaning : ''}</small>
        </td>
      </tr>
    )
  }

export default Word