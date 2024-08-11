import { useState, useEffect } from 'react'
import './App.css'
import wordService from './services/words'

function WordDisplay( { word, showMeaning, toggleMeaning } ) {
  if (word === null)
    return (<br/>)

  return (
    <table>
      <tbody>
        <tr>
          <td><button className='clickable-text' onClick={() => toggleMeaning(!showMeaning)}><strong>{word.word}</strong></button></td>
        </tr>
        <tr>
          <td>
            <small><em>{showMeaning ? word.meaning : ''}</em></small>
          </td>
        </tr>
        {/* <tr>
          <td>{word.sentence}</td>
        </tr>
        <tr>
          <td>{word.sentenceMeaning}</td>
        </tr> */}
        {/* <tr>
          <td>{word.picture}</td>
        </tr> */}
      </tbody>
    </table>
  )
}

function Word( { word, wordNumber, onHighlight, showMeanings, delHandler }) {
  
  return (
    <tr>
      <td className='wordNumber'>
        {wordNumber}. &nbsp;
        <button className='delete' onClick={delHandler}>X</button>
      </td>
      <td>
        <button className='clickable-text' onClick={() => onHighlight(word)}>
          {word.word}
        </button> 
      </td>
      <td className='wordMeaning'>
        <small>{showMeanings ? word.meaning : ''}</small>
      </td>
    </tr>
  )
}

function Words( {words, filter, highlightHandler, delHandler} ) {
  const [showMeanings, setShowMeanings] = useState(false)
  const filteredWords = (filter == '') ? words
    : words.filter(w => w.word.includes(filter) || w.meaning.includes(filter))
  let wordNumber = 1
  
  return (
    <>
      <button onClick={() => setShowMeanings(!showMeanings)}>{!showMeanings ? 'Show Meanings' : 'Hide Meanings'}</button>
      <div style={{ margin: 'auto', height: '50vh', width: '50vh', overflow: 'scroll', border: '1px solid' }}>
        <table>
          <tbody>
            {filteredWords.map(w => <Word key={w.id} word={w} wordNumber={wordNumber++} onHighlight={() => highlightHandler(w)} showMeanings={showMeanings} delHandler={() => delHandler(w)}/>)}
          </tbody>
        </table>
      </div>
    </>
  )
}

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
          if (highlightedWord.id === nW.id)
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
        if (word.id === highlightedWord.id) highlightHandler(null)
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
