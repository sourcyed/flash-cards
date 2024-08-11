import { useState, useEffect } from 'react'
import './App.css'
import wordService from './services/words'

function Word( { word }) {
  return (
    <li>{word.word}</li>
  )
}

function Words( {words, filter} ) {
  const filteredWords = (filter == '') ? words
    : words.filter(w => w.word.includes(filter))
  return (
    <ol>
        {filteredWords.map(w => <Word key={w.id} word={w} />)}
    </ol>
  )
}

function App() {
  const [words, setWords] = useState([])
  const [searchFilter, setFilter] = useState('')
  const [newWord, setNewWord] = useState('')
  const [newMeaning, setNewMeaning] = useState('')

  useEffect(() => {
    wordService.getAll().then(ws => setWords(ws))
  }, [])

  const updateFilter = newFilter => {
    setFilter(newFilter.trim().toLowerCase())
  }

  const handleInput = setFunc => event => setFunc(event.target.value)

  const addWord = e => {
    e.preventDefault()
    
    const word = { word: newWord, meaning: newMeaning }
    wordService.create(word).then(r => setWords(words.concat(r)))
    setNewWord('')
    setNewMeaning('')
  }

  return (
    <div>
      <form onSubmit={addWord}>
        <h3>Add new word</h3>
        <p><input onChange={handleInput(setNewWord)} value={newWord}/> : <input onChange={handleInput(setNewMeaning)} value={newMeaning}/></p>
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
