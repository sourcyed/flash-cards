import { useState } from 'react'
import Word from './Word'

function Words( {words, filter, highlightHandler, delHandler, maxWords} ) {
    const [showMeanings, setShowMeanings] = useState(false)
    const reversed = words.toReversed()

    let filteredWords = (filter == '') ? reversed
      : reversed.filter(w => w.word.includes(filter) || w.meaning.includes(filter))

    if (maxWords !== null)
      filteredWords = filteredWords.slice(0, maxWords)

    let wordNumber = 1
    
    return (
      <>
        <button onClick={() => setShowMeanings(!showMeanings)}>{!showMeanings ? 'Show Meanings' : 'Hide Meanings'}</button>
        <div style={{ margin: 'auto', height: '50vh', width: '50vh', overflow: 'scroll', border: '1px solid' }}>
          <table>
            <tbody>
              {filteredWords.map(w => <Word key={w.id} word={w} wordNumber={wordNumber++} onHighlight={() => highlightHandler(w)} showMeanings={showMeanings} delHandler={() => delHandler(w)}/>)}
            </tbody>
          </table>
        </div>
      </>
    )
  }

  export default Words