export const settingOptions = [
        {
          name : "Block Ads",
          description : "Disable YouTube Ads.",
          type : 'switch',
          action : false
        },
        {
          name : "Shorts",
          description : "Disable YouTube Shorts.",
          type : 'switch',
          action : false
        },
        {
          name : "Video Suggestions",
          description : "Disable suggested videos on YouTube.",
          type : 'switch',
          action : false
        },
        {
          name : "Filter By Keywords",
          description : "Filter YouTube feeds using your keywords to stay focused and improve your viewing experience.",
          type : 'switch',
          action : false
        },
        {
          name : "Keywords settings",
          description : "Add or remove keywords to customize your feed.",
          type : 'btn',
          action : false
        },
        {
          name : "Privacy policy",
          description : "Read our privacy policy.",
          type : 'btn',
          action : false,
          url : "https://sites.google.com/view/privacy-policy-for-my-tube/home"
        },
        {
          name : "clear settings",
          description : "Undo your changes.",
          type : 'btn',
          action : false
        }

      ]

 export  const startOption = [ {
          name : "YT Active",
          description : "Activate this extension.",
          type : 'switch',
          action : true
        },]



export const isExtension = true;