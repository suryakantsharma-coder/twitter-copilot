import { useState } from "react";
import Header from "../components/home/header";
import KeyWords from "../components/home/Keywords";
import SettingItem from "./setting";
import useHomeHook from "../hooks/useHomeHook";
import { settingOptions, startOption } from "../constant/constant";

const Home = ({setScreen}) => {
   const {setting, isActive, handleExtensionState, handleSettingState, getSettingState, clearSettingState} = useHomeHook();

    return (
        <div style={{
            width : '100%',
            height : 550,
            backgroundColor : "#0f0f0f",
            display : 'flex',
            flexDirection : "column",
        }}>
        <Header />

        <div style={{
        width : "100%",
        height : "550px",
        justifyContent : "center",
        alignItems : 'center',
      }}>
        {
          startOption?.map((item, index) => {
            return (
              <SettingItem key={index} item={item} onStateChange={handleExtensionState} />
            )
          })
        }
      </div>
        <div style={{
        width : "100%",
        height : "550px",
        justifyContent : "center",
        alignItems : 'center',
        opacity : (isActive) ? 1 : 0.2
      }}
      >
        {
          setting?.map((item, index) => {
            return (
              <SettingItem isExtensionActive={isActive} key={index} item={item} handleSettingChange={handleSettingState} onItemClick={() => {
                if (item?.name?.toString()?.toLowerCase() == "clear settings") 
                  clearSettingState();
                else if (item?.name?.toString()?.toLowerCase() == "keywords settings" && setting[index - 1].action)
                 setScreen("keywords");
              }} 
              isKeywordsEnable={(item?.name?.toString()?.toLowerCase() == "keywords settings" && setting[index - 1].action) ? true : false}
              />
            )
          })
        }
      </div>
        
        <KeyWords />
       {/* <ActiveSwitch /> */}
        </div>
    )
}

export default Home;