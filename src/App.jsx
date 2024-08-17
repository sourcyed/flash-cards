import { useState, useEffect, useRef } from 'react'
import './App.css'
import Words from './components/Words'
import WordDisplay from './components/WordDisplay'
import wordService from './services/words'

function App() {
  const [words, setWords] = useState(null)
  const [searchFilter, setFilter] = useState('')
  const [newWord, setNewWord] = useState('')
  const [newMeaning, setNewMeaning] = useState('')
  const [highlightedWord, setHighlight] = useState(null)
  const [maxWords, setMaxWords] = useState(null)
  const [wordsOffset, setWordsOffset] = useState(0)
  const [newSentence, setSentence] = useState('')
  const [newSentenceMeaning, setSentenceMeaning] = useState('')
  const [newPicture, setPicture] = useState('')
  const [showMeaning, toggleMeaning] = useState(false)
  const [correctGuesses, setCorrectGuesses] = useState(0)
  const [correctlyGuessedWords, setCorrectlyGuessedWords] = useState(new Set())

  useEffect(() => {
    wordService.getAll().then(ws => {
      setWords(ws)
  })}, [])

  if (!words || typeof words === 'string')
    return null

  const updateFilter = newFilter => {
    setFilter(newFilter.trim().toLowerCase())
  }

  const updateMaxWords = m => {
    setMaxWords(m === '' ? null : parseInt(m))
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

  const highlightRandomWord = (wordsToExclude) => {
    const visible = visibleWords()
    const availableWords = visible.filter(w => !wordsToExclude.has(w.id))
    if (wordsToExclude.size >= visible.length) {
      if (window.confirm('You guessed all the words correctly! Do you want to start over?')) {
        setCorrectGuesses(0)
        setCorrectlyGuessedWords(new Set())
      }
    }

    if (availableWords.length == 0) return highlightHandler(null)
    if (availableWords.length == 1) return highlightHandler(availableWords[0])
    while (true) {
      const rnd = Math.floor(Math.random() * (availableWords.length))
      const rndWord = availableWords[rnd]
      if (rndWord !== highlightedWord)
        {
          highlightHandler(rndWord)
          break
        }
    }
    return
  }

  const visibleWords = () => {
    let availableWords = words
    if (searchFilter.length > 0)
      availableWords = availableWords.filter(w => w.word.includes(searchFilter) || w.meaning.includes(searchFilter))
    if (maxWords)
      availableWords = availableWords.slice(Math.max(availableWords.length - maxWords - wordsOffset, 0), Math.max(availableWords.length - wordsOffset, 0))
    return availableWords
  }

  const handleMeaningClick = () => {
    setCorrectGuesses(correctGuesses + 1)
    const newSet = (new Set(correctlyGuessedWords)).add(highlightedWord.id)
    setCorrectlyGuessedWords(newSet)
    highlightRandomWord(newSet)
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
        <h4>correct guesses: {correctGuesses}</h4>
        <button onClick={() => highlightRandomWord(correctlyGuessedWords)}>random</button>
        <WordDisplay word={highlightedWord} showMeaning={showMeaning} toggleMeaning={toggleMeaning} onMeaningClick={handleMeaningClick} />
        max words: <input type='number' style={{width: 50}} value={maxWords !== null ? maxWords : ''} onChange={e => updateMaxWords(e.target.value)}/>
        <br />
        offset: <input type='number' style={{width: 50}} value={wordsOffset} onChange={e => setWordsOffset(e.target.value)}/>
        <br />
        Search: <input onChange={e => updateFilter(e.target.value)} value={searchFilter}/>
        <Words words={visibleWords()} highlightHandler={highlightHandler} delHandler={delHandler} maxWords={maxWords}/>
      </div>
    </div>
  )
}

export default App
