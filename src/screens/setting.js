import { useState } from "react";
import Switch from "react-switch";


const SettingItem = ({
  item, 
  isExtensionActive = true,
  handleSettingChange = () => {},
  onStateChange = () => {},
  onItemClick = () => {},
}) => {
  const [isActive, setIsActive] = useState(item.action || false);

    return (
              <div style={{
                width : '100%',
                textAlign : 'left',
                padding : 12,
                color : 'white',
                display : 'flex',
                justifyContent :'space-between'
              }}

              onClick={()=> {
                if (item?.type == "btn" || item?.type == "option")
                  onItemClick();

              }}
              >
                <div style={{
                  width : "60%"
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

            {item?.type == "switch" && 
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
            }}
        />
        }
              </div>
              </div>
         
    )
}

export default SettingItem;