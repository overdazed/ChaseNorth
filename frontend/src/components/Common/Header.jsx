import Topbar from "../Layout/Topbar.jsx";
import Navbar from "./Navbar.jsx";

const Header = ({ transparent = false }) => {
    return (
        // add border on the bottom
        // <header className="border-b border-gray-200">
        <header className={`${transparent ? 'absolute' : 'relative bg-white'} top-0 left-0 w-full z-50`}>
            {/* Topbar */}
                {/* inside Layout folder create "Topbar.jsx" */}
            <Topbar transparent={transparent}/>
            {/* Navbar */}
            <Navbar transparent={transparent}/>
                {/* open Navbar.jsx file*/}
            {/* Card Drawer*/}
    </header>
    )
}
export default Header
