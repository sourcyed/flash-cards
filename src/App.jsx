import { useState, useEffect, useRef } from 'react'
import './App.css'
import correctSound from '/correct.mp3'
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
  const [showMeaning, toggleMeaning] = useState(false)
  const [correctGuesses, setCorrectGuesses] = useState(0)
  const [correctlyGuessedWords, setCorrectlyGuessedWords] = useState(new Set())
  const [highlightedPicture, setHighlightedPicture] = useState(null)
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [swapMeanings, setSwapMeanings] = useState(false)
  const [pictureChecked, setPictureChecked] = useState(true)

  const audioRef = useRef(null)
  
  useEffect(() => {
    wordService.getAll().then(ws => {
      setWords(ws)
    }).catch(err => {
      console.error("Can't load words from the database.")
    })
  }, [])
    
  useEffect(() => {
    if (highlightedWord) 
      tts.speak(!swapMeanings ? highlightedWord.word : highlightedWord.meaning)
    }, [highlightedWord, showMeaning])
      
  useEffect(() => {
    if (highlightedWord) {
      if (highlightedWord.picture)
        setHighlightedPicture(highlightedWord.picture)
      else {
        replaceImage()
      }
    }
  }, [highlightedWord])

  
  const handleKeyUp = e => {
    const repeat = e.repeat
    if (repeat)
      return
    const key = e.key
    if (!showMeaning) {
      if (key === 'Enter' || key === 'ArrowLeft' || key === 'ArrowRight')
        toggleMeaning(true)
    } 
    else {
      if (key === 'ArrowLeft')
        highlightRandomWord()
      if (key === 'ArrowRight')
        handleRightClick()
    }
  }

  if (!words || typeof words === 'string')
    return null

  

  const updateFilter = newFilter => {
    setFilter(newFilter.toLowerCase())
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

    const word = { word: newWord, meaning: newMeaning, sentence: newSentence, sentenceMeaning: newSentenceMeaning, picture: pictureChecked ? '' : '/', i: words.length}
    console.log(word.picture)
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

  const highlightRandomWord = (wordsToExclude = correctlyGuessedWords) => {
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
    
    const _maxWords = maxWords ? maxWords : availableWords.length
    availableWords = wordsOffset >= 0
      ? availableWords.slice(Math.max(wordsOffset, 0), Math.min(_maxWords + wordsOffset, availableWords.length))
      : availableWords.slice(Math.max(availableWords.length - _maxWords + wordsOffset + 1, 0), Math.min(availableWords.length + wordsOffset + 1, availableWords.length))
    return availableWords
  }

  const handleRightClick = () => {
    if (audioRef.current)
      {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
      else
        console.log("couldn't find audio file")

    setCorrectGuesses(correctGuesses + 1)
    const newSet = (new Set(correctlyGuessedWords)).add(highlightedWord.id)
    setCorrectlyGuessedWords(newSet)
    highlightRandomWord(newSet)
  }

  const replaceImage = () => {
    console.log('request new photo');
    
    photoService.getPhoto(highlightedWord.id)
    .then(r => {
      highlightedWord.picture = r
      setWords(words.map(x => x.id === highlightedWord.id ? highlightedWord : x))
      setHighlightedPicture(r)
    })
    .catch(e => setHighlightedPicture(null) && console.log("can't load image"))
  }

  const handleAuth = e => {
    e.preventDefault()
    authService.auth(password).then(r => setAuthed(r))
  }

  if (!highlightedWord)
    highlightRandomWord()

  return (
    <div>
        <audio ref={audioRef}>
          <source src={correctSound} type='audio/mpeg'/>
          Your browser does not support the audio element.
        </audio>

      <div id="flashcard" onKeyUp={handleKeyUp} tabIndex="0" style={{outline: "none"}}>
        {/* <p>
          <button onClick={() => highlightRandomWord()}>random</button>
        </p> */}
        <h4>correct guesses: {correctGuesses}</h4>

        <WordDisplay word={highlightedWord} showMeaning={showMeaning} toggleMeaning={toggleMeaning} onRightClick={handleRightClick} onWrongClick={() => highlightRandomWord()} picture={highlightedPicture} swapMeanings={swapMeanings} replaceImage={replaceImage}/>
      </div>

      <div>
        <h3>Words</h3>
        max words: <input type='number' style={{width: 50}} value={maxWords !== null ? maxWords : ''} onChange={e => updateMaxWords(e.target.value)}/>
        &nbsp;
        offset: <input type='number' style={{width: 50}} value={wordsOffset !== null ? wordsOffset : ''} onChange={e => updateWordsOffset(e.target.value)}/>
        <br />
        Search: <input onChange={e => updateFilter(e.target.value)} value={searchFilter}/>
        &nbsp;
        <button onClick={() => setSwapMeanings(!swapMeanings)}>swap</button>
        &nbsp;
        <Words words={visibleWords()} highlightHandler={highlightHandler} delHandler={delHandler} maxWords={maxWords} swapMeanings={swapMeanings} />
      </div>

      <div>
        <form onSubmit={addWord} style={{ border: '1px solid' }}>
          <h3>Add new word</h3>
          <p>
            <input onChange={handleInput(setNewWord)} value={newWord} placeholder='word'/> 
            &nbsp; : &nbsp;
            <input onChange={handleInput(setNewMeaning)} value={newMeaning} placeholder='meaning'/>
          </p>
          <p>
            <input onChange={handleInput(setSentence)} value={newSentence} placeholder='example sentence' style={{width:330}}/>
          </p>
          <p>
            <input id="picture-checkbox" type="checkbox" style={{width: 25}} checked={pictureChecked} onChange={(e => setPictureChecked(!pictureChecked))} />
            <label htmlFor="picture-checkbox">Picture</label>
          </p>
          <p>
            <button type="submit">add</button>
          </p>
        </form>
        <form onSubmit={handleAuth}>
            <input type="password" value={password} onChange={e => setPassword(e.currentTarget.value)}/>
            <button type='submit'>auth</button>
        </form>
      </div>
    </div>
  )
}

export default App
