import { useState, useEffect } from 'react'
import './App.css'
import wordService from './services/words'

function WordDisplay( { word } ) {
  if (word === null)
    return
  return (
    <table>
      <tbody>
        <tr>
          <td><strong>{word.word}</strong></td>
        </tr>
        <tr>
          <td><em>{word.meaning}</em></td>
        </tr>
        <tr>
          <td>{word.sentence}</td>
        </tr>
        <tr>
          <td>{word.sentenceMeaning}</td>
        </tr>
        {/* <tr>
          <td>{word.picture}</td>
        </tr> */}
      </tbody>
    </table>
  )
}

function Word( { word, wordNumber, onHighlight, showMeanings }) {
  const handleClick = () => {
    onHighlight(word)
  }
  return (
    <tr>
      <td className='wordNumber'>
        {wordNumber}.
      </td>
      <td>
        <button style={{background:'none', border:'none'}} onClick={handleClick}>
          {word.word}
        </button> 
      </td>
      <td className='wordMeaning'>
        <small>{showMeanings ? word.meaning : ''}</small>
      </td>
    </tr>
  )
}

function Words( {words, filter, highlightHandler} ) {
  const [showMeanings, setShowMeanings] = useState(false)
  const filteredWords = (filter == '') ? words
    : words.filter(w => w.word.includes(filter) || w.meaning.includes(filter))
  let wordNumber = 1
  
  return (
    <>
      <button onClick={() => setShowMeanings(!showMeanings)}>{!showMeanings ? 'Show Meanings' : 'Hide Meanings'}</button>
      <table>
        <tbody>
          {filteredWords.map(w => <Word key={w.id} word={w} wordNumber={wordNumber++} onHighlight={() => highlightHandler(w)} showMeanings={showMeanings} />)}
        </tbody>
      </table>
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
        wordService.update(word).then(nW => setWords(words.map(w => w.id !== nW.id ? w : nW)))
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
    setHighlight(word)
  }

  return (
    <div>
      <form onSubmit={addWord}>
        <h3>Add new word</h3>
        <p>
          <input onChange={handleInput(setNewWord)} value={newWord}/> 
          &nbsp; : &nbsp;
          <input onChange={handleInput(setNewMeaning)} value={newMeaning}/>
          &nbsp; : &nbsp;
          <input onChange={handleInput(setSentence)} value={newSentence} />
          &nbsp; : &nbsp;
          <input onChange={handleInput(setSentenceMeaning)} value={newSentenceMeaning} />
          &nbsp; : &nbsp;
          <input type="file" />
        </p>
        <button type="submit">add</button>
      </form>

      <div>
        <h3>Words</h3>
        <WordDisplay word={highlightedWord}/>
        Search: <input onChange={e => updateFilter(e.target.value)} value={searchFilter}/>
        <Words words={words} filter={searchFilter} highlightHandler={highlightHandler}/>
      </div>
    </div>
  )
}

export default App
