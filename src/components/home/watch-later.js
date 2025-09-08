import { IoMdCloseCircle } from 'react-icons/io';
import useKeywordHook from '../../hooks/useKeywordHook';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { IoAddCircleOutline } from 'react-icons/io5';
import useWatchLaterHook from '../../hooks/useWatchLaterHook';
const WatchLater = ({ setScreen }) => {
  const { listOfWatchLater, removeWatchLater } = useWatchLaterHook();
  return (
    <div
      style={{
        width: '100%',
        height: 550,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingLeft: 10,
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 12,
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
          Watch Later
        </p>
      </div>

      <div
        style={{
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          // backgroundColor  : "red"
        }}
      >
        {listOfWatchLater?.map((item, index) => (
          <div
            key={index}
            style={{
              width: '88%',
              padding: 10,
              backgroundColor: '#1E2938',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 5,
              marginBottom: 10,
            }}
            onClick={() => {
              window.open(item?.url, '_blank');
              window.close();
            }}
          >
            <p
              style={{
                width: '90%',
                fontSize: 12,
                margin: 0,
                padding: 0,
                color: 'white',
              }}
            >
              {item?.title || 'jskldf'}
            </p>

            <IoMdCloseCircle
              onClick={() => {
                removeWatchLater(index);
              }}
              size={18}
              color="#E80009"
              style={{ cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchLater;
