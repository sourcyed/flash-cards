import { useState, useEffect } from 'react'
import './App.css'
import wordService from './services/words'

function Word( { word }) {
  return (
    <li>{word[0]}</li>
  )
}

function Words( {words} ) {
  return (
    <ol>
        {words.map(w => <Word key={w[0]} word={w} />)}
    </ol>
  )
}

function App() {
  const [words, setWords] = useState([])

  useEffect(() => {
    wordService.getAll().then(ws => setWords(ws))
  }, [])

  return (
    <div>
      <form>
        <h3>Add new word</h3>
        <p><input /> : <input /></p>
        <button type="submit">add</button>
      </form>

      <div>
        <h3>Words</h3>
        Search: <input />
        <Words words={words}/>
      </div>
    </div>
  )
}

export default App
