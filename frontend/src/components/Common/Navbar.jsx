import { Link } from "react-router-dom";
// HiOutlineShoppingBag = Cart
// HiBars3BottomRight = Mobile Navbar Drawer
import {
    HiOutlineUser,
    HiOutlineShoppingBag,
    HiBars3BottomRight
} from "react-icons/hi2"
import SearchBar from "./SearchBar.jsx";
import CartDrawer from "../Layout/CartDrawer.jsx";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import {useSelector} from "react-redux";

const Navbar = ({ transparent = false }) => {

    // to open and close the cart drawer
    const [drawerOpen, setDrawerOpen] = useState(false);

    // open hamburger menu when clicked on small screen
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);

    // Update SHopping Bag Count
    // Get cart from the cartSlice
    const {cart} = useSelector((state) => state.cart);

    const { user } = useSelector((state) => state.auth);

    const cartItemCount = cart?.products?.reduce(
        (total, product) => total + product.quantity,
        0
        // if products are not present, value will be 0
    ) || 0;

    const toggleNavDrawer = () => {
        setNavDrawerOpen(!navDrawerOpen);
    }

    // to toggle the value of drawerOpen
    const toggleCartDrawer = () => {
        setDrawerOpen(!drawerOpen);
    }

    return (
        <>
            {/* Full width background with fade effect */}
            <div className={`w-full relative ${!transparent ? 'bg-white' : ''}`}>
                {/* Fade effect overlay */}
                {transparent && (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-white/70 backdrop-blur-sm"></div>
                )}
                <nav className="container mx-auto flex items-center justify-between py-4 px-1 relative z-10">
                {/*<nav className="w-full px-20 md:px-36 lg:px-40 flex items-center justify-between py-4 relative z-10">*/}


                {/* Left - Logo */}
                <div>
                    {/*we need Link component from react-router-dom*/}
                    <Link to="/" className="text-xl font-medium">
                        {/*Rabbit*/}
                        ChaseNorth
                    </Link>
                </div>
                {/* Center - Navigation Links */}
                {/* for smaller devices, we'll have a different layout */}
                <div className="hidden md:flex space-x-6">
                    {/* assign when backend is complete*/}
                    <Link to="/collections/all?gender=Men" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
                        Men
                    </Link>
                    {/* assign when backend is complete*/}
                    <Link to="/collections/all?gender=Women" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
                        Women
                    </Link>
                    {/* assign when backend is complete*/}
                    <Link to="/collections/all?category=Top Wear" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
                        Top Wear
                    </Link>
                    {/* assign when backend is complete*/}
                    <Link to="/collections/all?category=Bottom Wear" className="text-gray-700 hover:text-black text-sm font-medium uppercase">
                        Bottom Wear
                    </Link>
                </div>
                {/* work on right sections for the icons */}
                {/* Right - Icons */}
                <div className="flex items-center space-x-4">
                    {/* Admin Button */}
                    {/* check if user is present and role of user should be admin */}
                    {user && user.role === "admin" && (
                        <Link to="/admin" className="block bg-black px-2 rounded text-sm text-white">
                            Admin
                        </Link>
                    )}
                    {/* 1. Account Icon */}
                    <Link to="/profile" className="hover:text-black">
                        {/* Icon from react icons */}
                        <HiOutlineUser className="h-6 w-6 text-gray-700"/>
                    </Link>
                    {/* add onEvent handler to Cart icon, assign to toggle function */}
                    {/* onClick open Cart Drawer */}
                    <button
                        onClick={toggleCartDrawer}
                        className="relative hover:text-black"
                    >
                        <HiOutlineShoppingBag className="h-6 w-6 text-gray-700"/>
                        {/* to display the count of items in the cart */}
                        {/* FIX: position on top of the cart -> -top-1*/}
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 bg-custom-red text-white text-xs rounded-full px-2 py-0.5">
                                {cartItemCount}
                            </span>
                        )}

                    </button>
                    {/* 2. Search Icon */}
                    {/* For Search functionality create a different component, we will come back to it later */}
                    {/* when you click the search icon, the search form opens up, where you can enter the query */}
                    {/* when you submit the request, it will take you to the collection page and display the matching results */}
                        {/* 1. when you click search icon, we want the form to open up */}
                        {/* 2. ensure that we want to capture the search term from the form */}
                            {/* make use of the State hook */}
                    {/* create file under Common folder -> SearchBar.jsx */}
                    <div className="overflow-auto">
                        <SearchBar/>
                    </div>
                        {/* you now should be able to see SearchBar Txt on the screen */}
                    {/* 3. Hamburger Menu Icon for smaller devices */}
                    {/* for the menu to work add onClick event handler*/}
                    <button onClick={toggleNavDrawer} className="md:hidden">
                        <HiBars3BottomRight className="h-6 w-6 text-gray-700"/>
                    </button>
                </div>
                </nav>
            </div>
            {/* Cart Drawer */}
            <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>
            {/* Mobile Navigation */}
            <div
                className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform 
                transition-transform duration-300 z-50 ${
                    navDrawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/*    add close button */}
                <div className="flex justify-end p-4">
                    {/* close button to work, onClick event handler*/}
                    <button onClick={toggleNavDrawer}>
                        <IoMdClose className="h-6 w-6 text-gray-600"/>
                    </button>
                </div>
                {/*    navigation links */}
                <div className="p-4">
                    <h2 className="text-xl font-semibold mb-4">
                        Menu
                    </h2>
                    {/* add spacing */}
                    <nav className="space-y-4">
                        <Link
                            to="/collections/all?gender=Men"
                            onClick={toggleNavDrawer}
                            className="block text-gray-600 hover:text-black"
                        >
                            Men
                        </Link>
                        <Link
                            to="/collections/all?gender=Women"
                            onClick={toggleNavDrawer}
                            className="block text-gray-600 hover:text-black"
                        >
                            Women
                        </Link>
                        <Link
                            to="/collections/all?category=Top Wear"
                            onClick={toggleNavDrawer}
                            className="block text-gray-600 hover:text-black"
                        >
                            Top Wear
                        </Link>
                        <Link
                            to="/collections/all?category=Bottom Wear"
                            onClick={toggleNavDrawer}
                            className="block text-gray-600 hover:text-black"
                        >
                            Bottom Wear
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    )
}
export default Navbar
