import { useState } from 'react'
import './App.css'
import { ExternalHooks, getRoomId, getUsername } from './client';
import LoginScreen from './views/Login/LoginScreen';
import RoomSelection from './views/Room/RoomSelection';
import GameScreen from './views/GameScreen';

function App() {
  const [isOnline, setIsOnline] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  ExternalHooks.OnOpenOrClose.push((isOpen) => { setIsOnline(isOpen) });
  ExternalHooks.OnConnectOrDisconnect.push((isConnected) => { setIsConnected(isConnected) });
  ExternalHooks.OnEnterOrLeaveRoom.push((isInRoom) => { setIsInRoom(isInRoom) })

  return (
    <div className='app'>
      <footer>
        <div id="serverstatus" className={isOnline ? 'online' : 'offline'}></div>
        {
          isConnected ?
            <div id='logininfo'><span>you are logged in as</span> <span className='bigbold'>{getUsername()}</span></div>
            : ""
        }
        {
          isInRoom ?
            <div id='roominfo'><span>in room number</span> <span className='bigbold'>{getRoomId()}</span></div>
            : ""
        }
        <div className='flexfiller'></div>
        {
          isConnected ?
            <div id='disconnectbutton' style={{ display: "none" }}>Disconnect</div>
            : ""
        }
      </footer>
      <main>
        {isConnected ? isInRoom ? <GameScreen /> : <RoomSelection /> : <LoginScreen />}
      </main>
    </div>
  )
}

export default App
