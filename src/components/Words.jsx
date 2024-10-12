import { useState } from 'react'
import Word from './Word'

function Words( {words, highlightHandler, delHandler, swapMeanings} ) {
    const [showMeanings, setShowMeanings] = useState(false)

    const max = Math.ceil(words.length / 1000) * 1000;
    const value = words.length
    
    
    
    return (
      <div style={{border: '1px solid'}}>
        <button onClick={() => setShowMeanings(!showMeanings)}>{!showMeanings ? 'show meanings' : 'hide meanings'}</button>
        <div style={{ margin: 'auto', height: '50vh', width: '50vh', overflow: 'scroll' }}>
          <table>
            <tbody>
              {words.map(w => <Word key={w.id} word={w} wordNumber={w.i} onHighlight={() => highlightHandler(w)} showMeanings={showMeanings} swapMeanings={swapMeanings} delHandler={() => delHandler(w)}/>)}
            </tbody>
          </table>
        </div>
        <p>
          {value} / <strong>{max}</strong>
          <br />
          <progress max={max} value={value} style={{ width: '40vh'}}></progress>
        </p>
      </div>
    )
  }

  export default Words