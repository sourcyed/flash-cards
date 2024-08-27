import { useState, useEffect } from 'react'
import './App.css'
import Words from './components/Words'
import WordDisplay from './components/WordDisplay'
import wordService from './services/words'
import tts from './services/tts'
import photoService from './services/photos'
import authService from './services/auth'

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
  const [highlightedPicture, setHighlightedPicture] = useState(null)
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [swapMeanings, setSwapMeanings] = useState(false)
  
  useEffect(() => {
    wordService.getAll().then(ws => {
      setWords(ws)
    })}, [])
    
  useEffect(() => {
    if (highlightedWord) 
      tts.speak(!swapMeanings ? highlightedWord.word : highlightedWord.meaning)
    }, [highlightedWord, showMeaning])
      
  useEffect(() => {
    if (highlightedWord) {
      if (highlightedWord.picture)
        setHighlightedPicture(highlightedWord.picture)
      else {
        photoService.getPhoto(highlightedWord.id)
        .then(r => {
          highlightedWord.picture = r
          setHighlightedPicture(r)
        })
        .catch(e => setHighlightedPicture(null) && console.log("can't load image"))
      }
    }
  }, [highlightedWord])

  if (!words || typeof words === 'string')
    return null

  const updateFilter = newFilter => {
    setFilter(newFilter.trim().toLowerCase())
  }

  const updateMaxWords = m => {
    setMaxWords(m === '' ? null : parseInt(m))
  }

  const updateWordsOffset = o => {
    setWordsOffset(o === '' ? null : parseInt(o))
  }

  const handleInput = setFunc => event => setFunc(event.target.value)

  const addWord = e => {
    e.preventDefault()

    if (!authed) return

    if (newWord.trim() === '' || newMeaning.trim() === '') return

    const word = { word: newWord, meaning: newMeaning, sentence: newSentence, sentenceMeaning: newSentenceMeaning, picture: newPicture, i: words.length}
   
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
    if (word !== highlightedWord)
      setHighlightedPicture(null)
    setHighlight(word)
  }

  const delHandler = word => {
    if (!authed) return

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
    let availableWords = words.toReversed().map((w, i) => {
      return {...w, i: i+1}
    })
    if (searchFilter.length > 0)
      availableWords = availableWords.filter(w => w.word.includes(searchFilter) || w.meaning.includes(searchFilter))
    if (maxWords)
      availableWords = wordsOffset >= 0
        ? availableWords.slice(Math.max(wordsOffset, 0), Math.min(maxWords + wordsOffset, availableWords.length))
        : availableWords.slice(Math.max(availableWords.length - maxWords + wordsOffset, 0), Math.min(availableWords.length + wordsOffset + 1, availableWords.length))
    return availableWords
  }

  const handleMeaningClick = () => {
    setCorrectGuesses(correctGuesses + 1)
    const newSet = (new Set(correctlyGuessedWords)).add(highlightedWord.id)
    setCorrectlyGuessedWords(newSet)
    highlightRandomWord(newSet)
  }

  const handleAuth = e => {
    e.preventDefault()
    authService.auth(password).then(r => setAuthed(r))
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
        <WordDisplay word={highlightedWord} showMeaning={showMeaning} toggleMeaning={toggleMeaning} onMeaningClick={handleMeaningClick} picture={highlightedPicture} swapMeanings={swapMeanings}/>
        max words: <input type='number' style={{width: 50}} value={maxWords !== null ? maxWords : ''} onChange={e => updateMaxWords(e.target.value)}/>
        &nbsp;
        offset: <input type='number' style={{width: 50}} value={wordsOffset !== null ? wordsOffset : ''} onChange={e => updateWordsOffset(e.target.value)}/>
        <br />
        Search: <input onChange={e => updateFilter(e.target.value)} value={searchFilter}/>
        &nbsp;
        <button onClick={() => setSwapMeanings(!swapMeanings)}>swap</button>
        &nbsp;
        <Words words={visibleWords()} highlightHandler={highlightHandler} delHandler={delHandler} maxWords={maxWords} swapMeanings={swapMeanings} />
        <form onSubmit={handleAuth}>
          <input type="text" value={password} onChange={e => setPassword(e.currentTarget.value)}/>
          <button type='submit'>auth</button>
        </form>
      </div>
    </div>
  )
}

export default App
