import Header from '../components/home/header';
import KeyWords from '../components/home/Keywords';
import SettingItem from './setting';
import useHomeHook from '../hooks/useHomeHook';
import useAskForReview from '../hooks/useAskForReview';
import { useEffect } from 'react';
import useSlowMotionPlaybackHook from '../hooks/useSmPlayback';

const Home = ({ setScreen }) => {
  const {
    setting,
    isStartOption,
    isActive,
    handleExtensionState,
    handleSettingState,
    clearSettingState,
    handleRemoveItem,
  } = useHomeHook();
  const { checkUserUsage, isReviewed } = useAskForReview();
  useSlowMotionPlaybackHook();

  useEffect(() => {
    if (!isReviewed) setTimeout(() => checkUserUsage(), 1000);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: 550,
        backgroundColor: '#0f0f0f',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <div
        style={{
          width: '100%',
          height: '550px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isStartOption?.map((item, index) => {
          const itemState = {
            name: 'My Tube Active',
            description: 'Activate this extension.',
            type: 'switch',
            action: !isActive ? false : true,
          };
          return (
            <SettingItem
              key={index}
              item={itemState}
              onStateChange={handleExtensionState}
              onSwitchOff={handleRemoveItem}
              isExtenstionActiveBtn={true}
              onSwitchOn={handleRemoveItem}
            />
          );
        })}
      </div>
      <div
        style={{
          width: '100%',
          height: '550px',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: isActive ? 1 : 0.2,
        }}
      >
        {setting?.map((item, index) => {
          return (
            <SettingItem
              isExtensionActive={isActive}
              key={index}
              item={item}
              handleSettingChange={handleSettingState}
              onItemClick={() => {
                if (item?.name?.toString()?.toLowerCase() == 'clear settings') clearSettingState();
                else if (
                  item?.name?.toString()?.toLowerCase() == 'keywords settings' &&
                  !setting[index - 1].action
                ) {
                  setScreen('keywords');
                  const filter = {
                    name: 'Filter By Keywords',
                    description:
                      'Filter YouTube feeds using your keywords to stay focused and improve your viewing experience.',
                    type: 'switch',
                    action: false,
                  };
                  handleSettingState(filter, false);
                } else if (item?.name?.toString()?.toLowerCase() == 'watch later') {
                  setScreen('watch-later');
                } else if (item?.name?.toString()?.toLowerCase() == 'privacy policy')
                  window?.open(item?.url);
                else if (item?.name?.toString()?.toLowerCase() == 'feedback & support')
                  window?.open(item?.url);
                else if (item?.name?.toString()?.toLowerCase() == 'slow motion mode')
                  setScreen('smplayback');
              }}
              isKeywordsEnable={
                item?.name?.toString()?.toLowerCase() == 'keywords settings' &&
                !setting[index - 1].action
                  ? true
                  : false
              }
              onSwitchOff={handleRemoveItem}
              onSwitchOn={() => {
                if (item?.name?.toString()?.toLowerCase() == 'my tube active') handleRemoveItem();
              }}
            />
          );
        })}
      </div>

      <KeyWords />
      {/* <ActiveSwitch /> */}
    </div>
  );
};

export default Home;
