import { IoMdSettings } from "react-icons/io";

const Header = () => {
    return (
        <div style={{
            width : "100%",
            marginBottom : 20,
            display : 'flex',
            justifyContent : 'space-between',
            alignItems : 'center',
            paddingLeft : 10,
            // paddingRight : 6,
            backgroundColor : '#202020',
        }}>
            <p style={{
                width : "50%",
                fontSize : 18,
                color : 'white',
                fontWeight : 'bold',
                textAlign : "left",
            }}>YT</p>


            <div style={{
                width : "50%",
                display : "flex",
                justifyContent : 'end',
                alignItems : 'center',
                marginRight : 20,
                overflow : 'auto'
            }}>
            {/* <IoMdSettings size={20} color="white"/> */}
            </div>
        </div>
    )
}

export default Header;