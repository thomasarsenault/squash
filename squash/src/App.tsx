import './App.scss'

import { useState } from 'react'

import Navbar from './components/Navbar/Navbar.tsx'

const App = () => {

  const [inputText, setInputText] = useState('')

  const onClick = async () => {
    const response = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({text: 'my new task'})
      body: JSON.stringify({text: inputText})
    })
    const data = await response.json()
    console.log(data)
    console.log(inputText)
  }


  return (
    <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      {/* <Navbar /> */}
      <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} />
      <button onClick={onClick}>Click Me</button>
    </div>

  )
}

export default App
