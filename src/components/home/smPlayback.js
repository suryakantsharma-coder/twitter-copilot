import { IoMdArrowRoundBack } from 'react-icons/io';
import useSlowMotionPlaybackHook from '../../hooks/useSmPlayback';

function SlowMotionPlayback({ setScreen }) {
  const { options, setLocalOptions, setOptions } = useSlowMotionPlaybackHook();
  return (
    <div
      style={{
        width: '100%',
        height: '550px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 12,
          paddingLeft: 12,
        }}
      >
        <IoMdArrowRoundBack
          size={20}
          color="white"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setScreen('home');
          }}
        />
        <p
          style={{
            textAlign: 'start',
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Slow Motion Playback
        </p>
      </div>
      <div
        style={{
          width: '100%',
          height: 550,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '70%', padding: 10 }}>
            <p
              className="no-select"
              style={{
                fontSize: 16,
                margin: 0,
                padding: 0,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Playback Speed
            </p>
            <p
              className="no-select"
              style={{
                fontSize: 12,
                marginTop: 2,
                paddingTop: 5,
                color: 'gray',
              }}
            >
              Hold down the button to slow down video playback speed.
            </p>
          </div>

          <div
            style={{
              width: '30%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <input
              type="number"
              min="0.0"
              step="0.1"
              value={options?.playbackSpeed}
              onChange={(e) => {
                setOptions({ ...options, playbackSpeed: e.target.value });
                setLocalOptions({ ...options, playbackSpeed: e.target.value });
              }}
              style={{
                width: '40%',
                height: 20,
                borderRadius: 5,
                textAlign: 'center',
                outline: 'none',
                border: 'none',
              }}
            />
          </div>
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '70%', padding: 10 }}>
            <p
              className="no-select"
              style={{
                fontSize: 16,
                margin: 0,
                padding: 0,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Select Shortcut Key
            </p>
            <p
              className="no-select"
              style={{
                fontSize: 12,
                marginTop: 2,
                paddingTop: 5,
                color: 'gray',
              }}
            >
              Select the keyboard shortcut to trigger the action when pressed.
            </p>
          </div>

          <div
            style={{
              width: '30%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <select
              style={{
                width: '45%',
                height: 20,
                borderRadius: 10,
                textAlign: 'center',
                borderRadius: 5,
                border: 'none',
                outline: 'none',
              }}
              value={options?.shortcutKey}
              onChange={(e) => {
                setOptions({ ...options, shortcutKey: e.target.value });
                setLocalOptions({ ...options, shortcutKey: e.target.value });
              }}
            >
              {[
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z',
              ].map((item, index) => (
                <option key={index}>{item}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlowMotionPlayback;
