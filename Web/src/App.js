import React, { useState } from 'react';
import Welcome from './Modules/Welcome';
import Room from './Modules/Room';
import './App.scss';

function App() {
  const [roomId, setRoomId] = useState(null);

  return (
    roomId ? <Room roomId={roomId} /> : <Welcome setRoomId={setRoomId} />
  );
}

export default App;
