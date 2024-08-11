import { useState, useEffect } from 'react'
import './App.css'
import wordService from './services/words'

function Word( { word }) {
  return (
    <li>{word[0]}</li>
  )
}

function Words( {words, filter} ) {
  const filteredWords = (filter == '') ? words
    : words.filter(w => w[0].includes(filter))
  return (
    <ol>
        {filteredWords.map(w => <Word key={w[0]} word={w} />)}
    </ol>
  )
}

function App() {
  const [words, setWords] = useState([])
  const [searchFilter, setFilter] = useState('')

  useEffect(() => {
    wordService.getAll().then(ws => setWords(ws))
  }, [])

  const updateFilter = newFilter => {
    setFilter(newFilter.trim().toLowerCase())
  }

  return (
    <div>
      <form>
        <h3>Add new word</h3>
        <p><input /> : <input /></p>
        <button type="submit">add</button>
      </form>

      <div>
        <h3>Words</h3>
        Search: <input onChange={e => updateFilter(e.target.value)} value={searchFilter}/>
        <Words words={words} filter={searchFilter}/>
      </div>
    </div>
  )
}

export default App
