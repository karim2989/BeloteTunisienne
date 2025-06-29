import { useState } from 'react'
import Login from './views/Login'
import { ExternalHooks } from './Client';
import { Matchmaking } from './views/Matchmaking';
import Game from './views/Game';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [roomNumber, setroomNumber] = useState<number | null>(null);

  ExternalHooks.OnConnect = (isConnected) => setIsConnected(isConnected);
  ExternalHooks.OnRoom = (roomNumber) => setroomNumber(roomNumber);


  return (
    <>
      {
        isConnected == false ?
          <Login /> :
          roomNumber == null ?
            <Matchmaking /> :
            <>
              <small>you are in {roomNumber}</small>
              <Game />
            </>
      }
    </>
  )
}

export default App
