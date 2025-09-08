/* global chrome */
import { useEffect, useState } from 'react';
import './App.css';
import KeyWords from './components/home/Keywords';
import Home from './screens/home';
import SlowMotionPlayback from './components/home/smPlayback';
import WatchLater from './components/home/watch-later';
import usePostHog from './hooks/usePostHog';
import FeedbackForm from './components/home/feedbackPage';

function App() {
  usePostHog();
  const [screen, setScreen] = useState('home');

  useEffect(() => {
    chrome.storage.local.get('path', function (result) {
      console.log({ result });
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
      {screen === 'home' && <Home setScreen={setScreen} />}
      {screen === 'keywords' && <KeyWords setScreen={setScreen} />}
      {screen === 'watch-later' && <WatchLater setScreen={setScreen} />}
      {screen === 'feedback-form' && <FeedbackForm setScreen={setScreen} />}
      {screen === 'smplayback' && <SlowMotionPlayback setScreen={setScreen} />}
    </div>
  );
}

export default App;
