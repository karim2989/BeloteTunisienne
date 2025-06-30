import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <>
      <h1>Belote</h1>
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="password">Password (optional):</label>
          <input type="password" id="password" name="password" />
        </div>
        <div>
          <label>
            <input type="radio" name="roomAction" value="create" defaultChecked />
            Create New Room
          </label>
          <label>
            <input type="radio" name="roomAction" value="join" />
            Join Existing Room
          </label>
        </div>
        <div>
          <label htmlFor="roomId">Room ID:</label>
          <input type="text" id="roomId" name="roomId" disabled />
        </div>
        <button type="submit">Continue</button>
      </form>
    </>
  )
}

export default App
