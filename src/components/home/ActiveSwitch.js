import { useState } from 'react';
import Switch from 'react-switch';

const ActiveSwitch = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      style={{
        width: '92%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          width: '50%',
          fontWeight: 'bold',
          color: '#FFFFFF',
        }}
      >
        My Tube is Active
      </span>

      <Switch
        height={25}
        checked={isActive}
        onChange={(e) => {
          // console.log({e})
        }}
      />
    </div>
  );
};
export default ActiveSwitch;
