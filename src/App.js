/* global chrome */
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [screen, setScreen] = useState('home');

  useEffect(() => {
    chrome.storage.local.get('path', function(result) {
      if (result?.path) {
        setScreen(result?.path);
        chrome.storage.local.remove('path');
      }
    });
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'scroll',
        overflowX: 'hidden',
      }}
    >
      <p>kldjsfksjf</p>
    </div>
  );
}

export default App;
