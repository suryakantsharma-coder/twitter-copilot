import { useState } from "react";
import Switch from "react-switch";


const SettingItem = ({
  item, 
  isExtenstionActiveBtn = false,
  isExtensionActive = true,
  handleSettingChange = () => {},
  onStateChange = () => {},
  onItemClick = () => {},
  isKeywordsEnable = false,
  onSwitchOff= () => {},
  onSwitchOn = () => {}
}) => {
  const [isActive, setIsActive] = useState(item.action || false);

    return (
              <div style={{
                width : '100%',
                textAlign : 'left',
                padding : 12,
                color : 'white',
                display : 'flex',
                justifyContent :'space-between',
                opacity : (item?.name?.toString()?.toLowerCase() == "keywords settings" && !isKeywordsEnable) ? 0.2: 1
              }}

              onClick={()=> {
                if (item?.type == "btn" || item?.type == "option" || item == "switch-btn")
                  onItemClick();

              }}
              >
                <div style={{
                  width : "60%",
                  cursor : "pointer"
                }}>
              <h2 style={{
                fontSize : 16,
                margin : 0,
                padding : 0
              }}>{item.name}</h2>
              <p style={{
                fontSize : 12,
                marginTop : 2,
                padding : 0,
                color : 'gray'
              }}>{item.description}</p>
              </div>
              <div style={{width : "40%", display : 'flex', justifyContent : 'center', alignItems : 'center'}}>

            {(item?.type == "switch" || item?.type == "switch-btn" ) && 
            <Switch 
            height={24} 
            width={50} 
            checked={isActive} 
            disabled={!isExtensionActive} 
            onChange={(e) => {
              console.log({e})
              setIsActive(e)
              onStateChange(e)

              if (isExtensionActive) {
                handleSettingChange(item, e)
              } 

              if (e) {
                onSwitchOn();
              }

              if (!e) {
                onSwitchOff();
              } else if (e && isExtenstionActiveBtn) {
                onSwitchOff();
              }

            }}
        />
        }
              </div>
              </div>
         
    )
}

export default SettingItem;