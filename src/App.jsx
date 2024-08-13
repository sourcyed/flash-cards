import { useState, useEffect } from 'react'
import './App.css'
import Words from './components/Words'
import WordDisplay from './components/WordDisplay'
import wordService from './services/words'

function App() {
  const [words, setWords] = useState([])
  const [searchFilter, setFilter] = useState('')
  const [newWord, setNewWord] = useState('')
  const [newMeaning, setNewMeaning] = useState('')
  const [highlightedWord, setHighlight] = useState(null)
  const [newSentence, setSentence] = useState('')
  const [newSentenceMeaning, setSentenceMeaning] = useState('')
  const [newPicture, setPicture] = useState('')
  const [showMeaning, toggleMeaning] = useState(false)

  useEffect(() => {
    wordService.getAll().then(ws => setWords(ws))
  }, [])

  const updateFilter = newFilter => {
    setFilter(newFilter.trim().toLowerCase())
  }

  const handleInput = setFunc => event => setFunc(event.target.value)

  const addWord = e => {
    e.preventDefault()
    if (newWord.trim() === '') return

    const word = { word: newWord, meaning: newMeaning, sentence: newSentence, sentenceMeaning: newSentenceMeaning, picture: newPicture}
   
    const duplicate = words.find(w => w.word === newWord)
    
    if (duplicate) {
      if (window.confirm(`${newWord} already exists in the dictionary, update the meaning?`)) {
        word.id = duplicate.id
        wordService.update(word).then(nW => {
          setWords(words.map(w => w.id !== nW.id ? w : nW))
          if (highlightedWord && highlightedWord.id === nW.id)
            highlightHandler(nW)
        })
      } else {
        return
      }
    } else {
      wordService.create(word).then(r => setWords(words.concat(r)))
    }
    setNewWord('')
    setNewMeaning('')
    setSentence('')
    setSentenceMeaning('')
    setPicture('')
  }

  const highlightHandler = word => {
    toggleMeaning(false);
    setHighlight(word)
  }

  const delHandler = word => {
    if (window.confirm(`Are you sure you want to delete ${word.word} ?`)) {
      wordService.del(word).then(() => {
        setWords(words.filter(w => w.id !== word.id))
        if (highlightedWord && word.id === highlightedWord.id) highlightHandler(null)
      })
    }
  }

  const highlightRandomWord = () => {
    if (words.length == 0) return
    if (words.length == 1) return highlightHandler(words[0])
    while (true) {
      const rnd = Math.floor(Math.random() * (words.length))
      const rndWord = words[rnd]
      if (rndWord !== highlightedWord)
        {
          highlightHandler(rndWord)
          break
        }
    }
    return
  }

  return (
    <div>
      <form onSubmit={addWord}>
        <h3>Add new word</h3>
        <p>
          <input onChange={handleInput(setNewWord)} value={newWord}/> 
          &nbsp; : &nbsp;
          <input onChange={handleInput(setNewMeaning)} value={newMeaning}/>
          {/* &nbsp; : &nbsp;
          <input onChange={handleInput(setSentence)} value={newSentence} />
          &nbsp; : &nbsp;
          <input onChange={handleInput(setSentenceMeaning)} value={newSentenceMeaning} />
          &nbsp; : &nbsp;
          <input type="file" /> */}
        </p>
        <button type="submit">add</button>
      </form>

      <div>
        <h3>Words</h3>
        <button onClick={highlightRandomWord}>random</button>
        <WordDisplay word={highlightedWord} showMeaning={showMeaning} toggleMeaning={toggleMeaning}/>
        Search: <input onChange={e => updateFilter(e.target.value)} value={searchFilter}/>
        <Words words={words} filter={searchFilter} highlightHandler={highlightHandler} delHandler={delHandler}/>
      </div>
    </div>
  )
}

export default App
