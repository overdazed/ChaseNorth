import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import {useEffect} from "react";
import axios from "axios";


const NewArrivals = () => {

    // to make the buttons work
    const scrollRef = useRef(null);
    // isDragging = to check if the container can be scrolled
    const [isDragging, setIsDragging] = useState(false);
    //  the starting value of x-axis, when user grabs and scrolls the container
    const [startX, setStartX] = useState(0);
    //  initial scroll position of the container
    const [scrollLeft, setScrollLeft] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    //  to determine if the container can be scrolled to the right
    const [canScrollRight, setCanScrollRight] = useState(true);

    // create dummy products to display
    // const newArrivals = [
    //     {
    //         // _id to match the mongoDB id
    //         _id: "1",
    //         name: "Stylish Jacket",
    //         price: 120,
    //         // array of images
    //         images: [
    //             {
    //                 url: "https://picsum.photos/500/500?random=1",
    //                 altText: "Stylish Jacket",
    //             }
    //         ]
    //     },
    //     {
    //         // _id to match the mongoDB id
    //         _id: "2",
    //         name: "Stylish Jacket",
    //         price: 120,
    //         // array of images
    //         images: [
    //             {
    //                 url:"https://picsum.photos/500/500?random=2",
    //                 altText:"Stylish Jacket",
    //             }
    //         ]
    //     },
    //     {
    //         // _id to match the mongoDB id
    //         _id: "3",
    //         name: "Stylish Jacket",
    //         price: 120,
    //         // array of images
    //         images: [
    //             {
    //                 url:"https://picsum.photos/500/500?random=3",
    //                 altText:"Stylish Jacket",
    //             }
    //         ]
    //     },
    //     {
    //         // _id to match the mongoDB id
    //         _id: "4",
    //         name: "Stylish Jacket",
    //         price: 120,
    //         // array of images
    //         images: [
    //             {
    //                 url:"https://picsum.photos/500/500?random=4",
    //                 altText:"Stylish Jacket",
    //             }
    //         ]
    //     },
    //     {
    //         // _id to match the mongoDB id
    //         _id: "5",
    //         name: "Stylish Jacket",
    //         price: 120,
    //         // array of images
    //         images: [
    //             {
    //                 url:"https://picsum.photos/500/500?random=5",
    //                 altText:"Stylish Jacket",
    //             }
    //         ]
    //     },
    //     {
    //         // _id to match the mongoDB id
    //         _id: "6",
    //         name: "Stylish Jacket",
    //         price: 120,
    //         // array of images
    //         images: [
    //             {
    //                 url:"https://picsum.photos/500/500?random=6",
    //                 altText:"Stylish Jacket",
    //             }
    //         ]
    //     },
    //     {
    //         // _id to match the mongoDB id
    //         _id: "7",
    //         name: "Stylish Jacket",
    //         price: 120,
    //         // array of images
    //         images: [
    //             {
    //                 url:"https://picsum.photos/500/500?random=7",
    //                 altText:"Stylish Jacket",
    //             }
    //         ]
    //     },
    //     {
    //         // _id to match the mongoDB id
    //         _id: "8",
    //         name: "Stylish Jacket",
    //         price: 120,
    //         // array of images
    //         images: [
    //             {
    //                 url:"https://picsum.photos/500/500?random=8",
    //                 altText:"Stylish Jacket",
    //             }
    //         ]
    //     }
    //
    // ];

    // Add a state variable new arrivals
    const [newArrivals, setNewArrivals] = useState([]);

    // useEffect to fetch new arrivals
    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
                setNewArrivals(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchNewArrivals()
        // Dependency empty array, so it gets called on the page load
    }, []);



    const handleMouseDown = (e) => {
        // indicating that the user can scroll the content
        setIsDragging(true);
        // set the startX value, pageX will provide the horizontal position of the pointer - by offsetLeft, which is the distance between the left edge of the child and the parent
        // print it's value to understand it
        // it's the area of the edge of the container
        // substraction will give us the relative horizontal position of the pointer within the container, this value will be the start point when the user starts dragging
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        // setScrollLeft value to the scrollLeft container
        // this values are needed, when the user will move the mouse horizontally to set the position of the container
        setScrollLeft(scrollRef.current.scrollLeft);
    }

    const handleMouseMove = (e) => {
        // return if isDragging is false
        // this will ensure that the remainder of the code will only execute if the user is actually dragging
        if(!isDragging) return;
        // determine the current position of the pointer
        const x = e.pageX - scrollRef.current.offsetLeft;
        // determine the distance dragged
        const walk = x - startX;
        // scroll the content to the intended position
        scrollRef.current.scrollLeft = scrollLeft - walk;
    }

    // we dont want the images to pop up, which is the default behavior of the browser
    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    }

    // function that will get called, when the left or right buttons are clicked
    //direction left or right
    const scroll = (direction) => {
        // scrolls by 300 pixels
        const scrollAmount = direction === "left" ? -300 : 300;
        // to scroll the content we will use the scrollBy method on the container
        scrollRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth"
        });
    }
    // after this add onClick event on our buttons



    // Update Scroll Buttons
    const updateScrollButtons = () => {
        const container = scrollRef.current;

        // initial value of scrollLeft will be 0, since we haven't scrolled the content yet
        // at this point, the left icon will be disabled

        // as you start scrolling to the right, the scrollLeft value will increase
        // with this, the user can scroll to the left side, until scrollLeft value is set back to 0

        // if the scrollLeft value is greater than 0, the left icon will be enabled

        // check if the container is loaded in the DOM to perform any operation
        if (container) {
            // to hold the scrollLeft value
            const leftScroll = container.scrollLeft;

            // How to enable or disable the right icon
            // We need to check if the user has reached the end of scroll
            // This will happen if the sum of leftScroll and the client width is greater than the total container scroll width
            // check the condition, if containerWidth is greater than leftScroll + container.clientWidth
            const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;

            // update the state variable "canScrollLeft" to true or false, to enable or disable the left icon
            // set variable to true, if scrollLeft is greater than 0
            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScrollable);
        }

        // to understand the logic
        // console.log({
        //     // log the values to see what values they hold
        //
        //     // number of pixels the content of the container has been scrolled
        //     scrollLeft: container.scrollLeft,
        //     // position of the container that is visible to the user
        //     clientWidth: container.clientWidth,
        //     // total width of the scrollable content inside the container
        //     containerScrollWidth: container.scrollWidth,
        //
        //     offsetLeft: scrollRef.current.offsetLeft
        // })

    }

    // declare useEffect
    useEffect(() => {
        // get the width of the container
        const container = scrollRef.current;

        // check if the container is loaded in the DOM to perform any operation#
        if (container) {
            container.addEventListener("scroll", updateScrollButtons);
            // invoke the function on the page load
            updateScrollButtons();

            // remove the scrolling event during the unmount
            return () => container.removeEventListener("scroll", updateScrollButtons);
        }
    },
        // this should be executed on the page load
        // for the scroll logic, add the newArrivals Dependency
        [newArrivals]);

    return (
        // on mobile we need some padding
        <section className="py-16 px-4 lg:px-0">
            <div className="container mx-auto text-center mb-10 relative">
                <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
                <p className="text-lg text-gray-600 mb-8">
                    Discover the latest styles straight off the runway, freshly added to
                    keep your wardrobe on the cutting edge of fashion.
                </p>
                
                {/* Scroll Buttons */}
                <div className="absolute right-0 bottom-[-30px] flex space-x-2">
                    {/* rounded-full makes the buttons round */}
                    {/* just rounded has rounded corners */}
                    {/* disabled={!canScrollLeft} will gray out the button if it is disabled */}
                    {/* className={`p-2 rounded-full border bg-white text-black`}> remove the last two classes, check if you can scroll to the left */}
                    {/* {`p-2 rounded-full border ${canScrollLeft ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`} if you can scroll left visible, when not grayed out */}
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded-full border ${
                            canScrollLeft 
                                ? "bg-white text-black" 
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {/* input left icon from React Icons */}
                        <FiChevronLeft className="text-2xl" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className={`p-2 rounded-full border ${
                        canScrollRight
                            ? "bg-white text-black"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    >
                        {/* input right icon from React Icons */}
                        <FiChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            {/* add Ref */}
            <div
                ref={scrollRef}
                // let's update the pointer to indicate the container is draggable
                className={`container mx-auto overflow-x-scroll flex space-x-6 relative scrollbar-hide ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                // instead of using the button, to synchronize this, add the event onMouse to determine when the user presses the mouse button on a draggable content
                // with these events we can determine when the user will drag the content within the container
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
            >
                {newArrivals.map((product) => (
                    // fix ui
                    // style div containing the image
                    <div key={product._id } className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative">
                        {/* style the image */}
                        <img
                            src={product.images[0]?.url}
                            alt={product.images[0]?.altText || product.name}
                            className="w-full h-[500px] object-cover rounded-lg"
                            // we don't want the images to pop up, which is the default behavior of the browser
                            draggable="false"
                        />
                        {/* add product name and price */}
                        <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
                            <Link to={`/product/${product._id}`} className="block">
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="mt-1">${product.price}</p>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
export default NewArrivals

// include in Home.jsx