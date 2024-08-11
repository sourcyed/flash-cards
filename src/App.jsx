import { useState } from 'react'
import './App.css'

function Words() {
  return (
    <></>
  )
}

function App() {
  const [words, setWords] = useState(0)

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
