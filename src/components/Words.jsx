import { useState } from 'react'
import Word from './Word'

function Words( {words, highlightHandler, delHandler, swapMeanings} ) {
    const [showMeanings, setShowMeanings] = useState(false)
    const reversed = words.toReversed()

    let wordNumber = 1
    
    return (
      <>
        <button onClick={() => setShowMeanings(!showMeanings)}>{!showMeanings ? 'show meanings' : 'hide meanings'}</button>
        <div style={{ margin: 'auto', height: '50vh', width: '50vh', overflow: 'scroll', border: '1px solid' }}>
          <table>
            <tbody>
              {reversed.map(w => <Word key={w.id} word={w} wordNumber={wordNumber++} onHighlight={() => highlightHandler(w)} showMeanings={showMeanings} swapMeanings={swapMeanings} delHandler={() => delHandler(w)}/>)}
            </tbody>
          </table>
        </div>
      </>
    )
  }

  export default Words