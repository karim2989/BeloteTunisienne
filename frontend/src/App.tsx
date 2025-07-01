import { useState } from 'react'
import './App.css'
import { ExternalHooks } from './client';

function App() {
  const [isOnline, setIsOnline] = useState(false);
  ExternalHooks.OnOpenOrClose.push((isOpen) => { setIsOnline(isOpen) });

  return (
    <div className='app'>
      <footer>
        <div id="serverstatus" className={isOnline ? 'online' : 'offline'}></div>
        <div id='logininfo'><span>you are logged in as</span> <span className='bigbold'>SamaraEnjoyer</span></div>
        <div id='roominfo'><span>in room number</span> <span className='bigbold'>2546</span></div>
        <div className='flexfiller'></div>
        <div id='disconnectbutton'>Disconnect</div>
      </footer>
      <main>main</main>
    </div>
  )
}

export default App
