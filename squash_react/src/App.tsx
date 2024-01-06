import './App.scss'

import { createContext,useEffect, useState } from 'react'

import Navbar from './components/Navbar/Navbar.tsx'
import { TasksProvider } from './context/TasksContext.tsx'
import Agenda from './pages/Agenda/Agenda.tsx'

const App = () => {

  const [inputText, setInputText] = useState('')
  const [tasks, setTasks] = useState([])

  const onClick = async () => {
    const response = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({text: 'my new task'})
      body: JSON.stringify({
        task: {
          name: inputText,
          status: "OPEN",
          description: "A placeholder description"
        }})
    })
    const data = await response.json()
    console.log(data)
    console.log(inputText)
  }
  const getTasks = async () => {
    const response = await fetch('http://localhost:3000/tasks')
    const data = await response.json()

    setTasks(data);
  }


  useEffect(() => {
    getTasks()
  }, []);

  return (
    <div style={{width: '100%', height: '100%' }}>
      <TasksProvider>
        <Agenda />
      </TasksProvider>
      {/* <Navbar /> */}
      {/* <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} />
      <button onClick={onClick}>Click Me</button> */}
    </div>

  )
}

export default App
