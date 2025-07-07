import { useState, useEffect, useRef } from 'react'
import './App.css'
import correctSound from '/correct.mp3'
import Words from './components/Words'
import WordDisplay from './components/WordDisplay'
import Footer from './components/Footer'
import Metronome from './components/Metronome'
import wordService from './services/words'
import tts from './services/tts'
import photoService from './services/photos'
import authService from './services/auth'
import confetti from "https://esm.run/canvas-confetti@1";

function App() {
  const PROGRESS_BAR_MAX = 10

  const [words, setWords] = useState([])
  const [searchFilter, setFilter] = useState('')
  const [newWord, setNewWord] = useState('')
  const [newMeaning, setNewMeaning] = useState('')
  const [highlightedWord, setHighlight] = useState(null)
  const [maxWords, setMaxWords] = useState(null)
  const [wordsOffset, setWordsOffset] = useState(0)
  const [newSentence, setSentence] = useState('')
  const [showMeaning, toggleMeaning] = useState(false)
  const [correctGuesses, setCorrectGuesses] = useState(0)
  const [correctlyGuessedWords, setCorrectlyGuessedWords] = useState(new Set())
  const [swapMeanings, setSwapMeanings] = useState(false)
  const [pictureChecked, setPictureChecked] = useState(true)
  const [useTTS, setUseTTS] = useState(false)
  const [useSFX, setUseSFX] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const audioRef = useRef(null)
  const flashcardRef = useRef(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      authService.verify(user.token).then(verified => {
        console.log(verified)
        if (verified) {
          setUser(user)
          wordService.setToken(user.token)
        } else {
          window.localStorage.removeItem('loggedUser')
          setUser(null)
        }
      })
    }
  }, [])

  useEffect(() => {
    if (user) {
      wordService.getAll().then(ws => {
        setWords(ws)
      }).catch(e => {
        console.error("Can't load words from the database.")
      })
    } else {
      setWords([])
      setHighlight(null)
    }
  }, [user])

  useEffect(() => {
    if (useTTS && highlightedWord)
      tts.speak(!swapMeanings ? highlightedWord.word : (!showMeaning ? highlightedWord.meaning : highlightedWord.word))
    }, [highlightedWord, showMeaning])

  useEffect(() => {
    if (highlightedWord && !highlightedWord.picture) {
        replacePicture()
    }
  }, [highlightedWord])

  const handleKeyUp = e => {
    if (highlightedWord === null) return

    const repeat = e.repeat
    if (repeat)
      return
    const key = e.key

    if (key === 'Backspace')
      resetCorrectGuesses()

    else if (!showMeaning) {
      if (key === 'Enter' || key === 'ArrowLeft' || key === 'ArrowRight')
        handleToggleMeaning(true)
    }
    else {
      if (key === 'ArrowLeft')
        highlightRandomWord()
      else if (key === 'ArrowRight')
        handleRightClick()
      else if (key === 'Enter')
        replacePicture()
    }
  }


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

  const fillWordInput = () => {
    if (!highlightedWord) return
    setNewWord(highlightedWord.word)
    setNewMeaning(highlightedWord.meaning)
    setSentence(highlightedWord.sentence)
    setPictureChecked(highlightedWord.picture !== '/')
  }

  const clearWordInput = () => {
    setNewWord('')
    setNewMeaning('')
    setSentence('')
  }

  const handleToggleMeaning = toggle => {
    toggleMeaning(toggle)
    toggle ? fillWordInput() : clearWordInput()
  }

  const addWord = e => {
    e.preventDefault()

    if (!user) return

    if (newWord.trim() === '' || newMeaning.trim() === '') return

    const word = { word: newWord, meaning: newMeaning, sentence: newSentence, picture: pictureChecked ? '' : '/', i: words.length}
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
  }

  const highlightHandler = word => {
    handleToggleMeaning(false)
    setHighlight(word)
  }

  const delHandler = word => {
    if (!user) return

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
        resetCorrectGuesses()
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
    const _maxWords = maxWords ? maxWords : availableWords.length
    availableWords = searchFilter.length > 0
    ?  availableWords = availableWords.filter(w => w.word.includes(searchFilter) || w.meaning.includes(searchFilter))
    : (wordsOffset >= 0
      ? availableWords.slice(Math.max(wordsOffset, 0), Math.min(_maxWords + wordsOffset, availableWords.length))
      : availableWords.slice(Math.max(availableWords.length - _maxWords + wordsOffset + 1, 0), Math.min(availableWords.length + wordsOffset + 1, availableWords.length))
    )
    return availableWords
  }

  const handleRightClick = () => {
    const rect = flashcardRef.current.getBoundingClientRect()
    confetti({
      particleCount: 50,
      startVelocity: 30,
      spread: 60,
      origin: { y: (rect.y / screen.height) + 0.2 }
    });

    if (audioRef.current)
      {
        if (useSFX) {
          audioRef.current.currentTime = 0
          audioRef.current.play()
        }
      }
      else
        console.log("couldn't find audio file")

    setCorrectGuesses(correctGuesses + 1)
    const newSet = (new Set(correctlyGuessedWords)).add(highlightedWord.id)
    setCorrectlyGuessedWords(newSet)
    highlightRandomWord(newSet)
  }

  const replacePicture = () => {
    const currentHighlightedWordId = highlightedWord.id; // Capture the ID of the highlighted word at the time of the function call

    photoService.replacePhoto(highlightedWord.id)
    .then(updatedWord => {
      setWords(words.map(x => x.id === updatedWord.id ? updatedWord : x))
      setHighlight(highlightedWord =>
        highlightedWord?.id === currentHighlightedWordId ? updatedWord : highlightedWord
      );
    })
    .catch(e => console.log("can't load picture"))
  }

  const resetCorrectGuesses = () => {
    setCorrectlyGuessedWords(new Set())
  }

  const handleLogin = async e => {
    e.preventDefault()

    try {
      const user = await authService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      wordService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      window.alert('Authentication successful!')
    } catch (exception) {
      window.alert('Invalid credentials')
    }
  }

  const wordForm = () =>
    <form onSubmit={addWord}>
      <h3>Add new word</h3>
      <p>
        <input onChange={handleInput(setNewWord)} value={newWord} placeholder='word'/>
        &nbsp; : &nbsp;
        <input onChange={handleInput(setNewMeaning)} value={newMeaning} placeholder='english meaning'/>
      </p>
      <p>
        <input onChange={handleInput(setSentence)} value={newSentence} placeholder='example sentence (optional)' style={{width:330}}/>
      </p>
      <p>
        <input id="picture-checkbox" type="checkbox" style={{width: 25}} checked={pictureChecked} onChange={(e => setPictureChecked(!pictureChecked))} />
        <label htmlFor="picture-checkbox">Picture</label>
      </p>
      <p>
        <button type="submit">add</button>
      </p>
    </form>

  const loginForm = () =>
    <form onSubmit={handleLogin}>
      <h4>Authenticate</h4>
      <p>
        Username &nbsp;
        <input type="username" value={username} onChange={e => setUsername(e.currentTarget.value)}/>
      </p>
      <p>
        Password &nbsp;
        <input type="password" value={password} onChange={e => setPassword(e.currentTarget.value)}/>
      </p>
      <p>
        <button type='submit'>login</button>
      </p>
    </form>


  if (!highlightedWord && visibleWords().length > 0)
    highlightRandomWord()

  const progressMax = Math.ceil(words.length / 1000) * 1000;
  const progressVal = words.length

  return (
    <div>
        <audio ref={audioRef}>
          <source src={correctSound} type='audio/mpeg'/>
          Your browser does not support the audio element.
        </audio>

        <h4>

          <button onClick={() => setUseTTS(!useTTS)}>{useTTS ? 'tts' : <em><s>tts</s></em>}</button>
          &nbsp;
          <button onClick={() => setUseSFX(!useSFX)}>{useSFX ? 'sfx' : <em><s>sfx</s></em>}</button>
          &nbsp;
          <button onClick={resetCorrectGuesses}>reset</button>
          &nbsp;
          <Metronome></Metronome>
          <p>correct guesses: {correctGuesses}</p>
        </h4>
        <progress max={PROGRESS_BAR_MAX} value={correctlyGuessedWords.size % PROGRESS_BAR_MAX} style={{ width: '40vh'}}></progress>
      <div ref={flashcardRef} id="flashcard" onKeyUp={handleKeyUp} tabIndex="0" style={{outline: "none"}}>
        <WordDisplay word={highlightedWord} showMeaning={showMeaning} toggleMeaning={handleToggleMeaning} onRightClick={handleRightClick} onWrongClick={() => highlightRandomWord()} swapMeanings={swapMeanings} replacePicture={replacePicture}/>
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
        <p>
          {progressVal} / <strong>{progressMax}</strong>
          <br />
          <progress max={progressMax} value={progressVal} style={{ width: '40vh'}}></progress>
        </p>
      </div>

      {user ?
        <>
          <div style={{ border: '1px solid' }}>
            <p>{user.username}</p>
            {wordForm()}
          </div>
          <p>
          <button onClick={() => {
            window.localStorage.removeItem('loggedUser');
            setUser(null);
          }}>logout</button>
          </p>
        </> :
        <div style={{ border: '1px solid' }}>
          {loginForm()}
        </div>
      }

      <Footer />
    </div>
  )
}

export default App
