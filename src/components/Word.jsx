function Word( { word, wordNumber, onHighlight, showMeanings, delHandler, swapMeanings }) {
  
    return (
      <tr>
        <td className='wordNumber'>
          {wordNumber}. &nbsp;
          <button className='delete' onClick={delHandler}>X</button>
        </td>
        <td>
          <button className='clickable-text' onClick={() => onHighlight(word)}>
            {!swapMeanings ? word.word : word.meaning}
          </button> 
        </td>
        <td className='wordMeaning'>
          <small>{showMeanings ? (!swapMeanings ? word.meaning : word.word) : ''}</small>
        </td>
      </tr>
    )
  }

export default Word