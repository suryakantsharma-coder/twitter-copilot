/* global chrome */
import { useState } from 'react';
import './App.css';
import KeyWords from './components/home/Keywords';
import Home from './screens/home';


function App() {

  const [screen, setScreen] = useState("home")

  return (
    <div style={{
      width : '100%',
      height : '100%',
      overflowY: 'scroll',
      overflowX: 'hidden'
    }}>
      {screen === "home" && <Home setScreen={setScreen} />}
      {screen === "keywords" && <KeyWords setScreen={setScreen}/>}
    </div>
  );
}

export default App;
