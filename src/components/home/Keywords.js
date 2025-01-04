import { IoMdCloseCircle } from "react-icons/io";
import useKeywordHook from "../../hooks/useKeywordHook";
import { IoMdArrowRoundBack } from "react-icons/io";
const KeyWords = ({setScreen}) => {
    const keyword = ['strange parts', 'INDIAN RAILWAYS FAN CLUB -by SATYA', 'yatri doctor', 'Destroyed Phone Restore', 'Mat Armstrong', 'JerryRigEverything', 'Linus Tech Tips', 'Joe HaTTab', 'Gyan Therapy'];
    const {value, listOfKeywords, handleInput,addToKeywords, removeKeywords} = useKeywordHook();

    return (
        <div style={{
            width : '100%',
            display : 'flex',
            flexDirection : 'column',
            overflow : 'auto',
            paddingLeft : 10,
        }}>

            <div style={{
                display : "flex",
                justifyContent : 'flex-start',
                alignItems : 'center',
                gap : 12
            }}>

            <IoMdArrowRoundBack size={20} color="white" style={{cursor : "pointer"}} onClick={() => {
                setScreen("home")
            }}/>
            <p style={{
                textAlign : 'start',
                color : 'white',
                fontSize : 18,
                fontWeight : 'bold'
            }}>KeyWord List</p>
            </div>
            {
                listOfKeywords?.map((item, index) => (
                    <div key={index} style={{
                        width : '88%',
                        padding : 10,
                        backgroundColor : "#606060",
                        display : 'flex',
                        justifyContent : 'space-between',
                        alignItems : 'center',
                        borderRadius : 5,
                        marginBottom : 10,
                    }}>
                        <p style={{
                            fontSize : 12,
                            margin : 0,
                            padding : 0,
                            color : 'white'
                        }}>{item}</p>

                        <IoMdCloseCircle onClick={() => {
                            removeKeywords(index);
                            }}  size={18} color="white" style={{cursor : 'pointer'}} />
                    </div>
                ))
            }

            <div style={{width : "100%", display : 'flex', gap : 4}}>
                <input style={{
                    width : '80%',
                    padding : 6,
                    border : 'none',
                    outline : 'none',
                    borderRadius : 5,

                }} value={value} type="name" placeholder="Type keyword here" onChange={handleInput}/>
                <button style={{
                    width : "10%",
                    borderRadius : 5,
                    color : 'black',
                    backgroundColor :'transparent',
                    cursor : "pointer",
                    border : 'none',
                    backgroundColor : "white"
                }}
                onClick={addToKeywords}
                >+</button>
            </div>
            
        </div>
    )
}

export default KeyWords