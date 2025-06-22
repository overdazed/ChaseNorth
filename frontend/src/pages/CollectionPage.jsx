import { useState } from "react"
import { useEffect } from "react"
import { FaFilter } from "react-icons/fa"
import FilterSidebar from "../components/Products/FilterSidebar.jsx";
import { useRef } from "react"
import SortOptions from "../components/Products/SortOptions.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";
import {useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as queryString from "node:querystring";
import {fetchProductsByFilters} from "../redux/slices/productsSlice.js";

const CollectionPage = () => {

    // To get the collection name
    const {collection} = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const queryParams = Object.fromEntries([...searchParams]);


    // add state variable for the products
    //const [products, setProducts] = useState([]);

    // click on filter, drawer comes from side, click anywhere else, close drawer
    const sidebarRef = useRef(null);

    // state variable to determine if the drawer is open or closed
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchProductsByFilters({collection, ...queryParams}))
    }, [dispatch, collection, searchParams]);

    //
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleClickOutside = (e) => {
        // Close sidebar if user clicks outside
        // if the user clicks within the sidebar, don't close it
        // if e.target is clicked outside of the sidebar, close it

        // check if sidebar is loaded first
        if(
            sidebarRef.current &&
            !sidebarRef.current.contains(e.target))
        {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        // Add event listener to detect clicks outside the sidebar
        document.addEventListener("mousedown", handleClickOutside);
        // clean up the event listener by removing it on unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])


    // to populate the products
    // useEffect(() => {
    //     // fetch the products from the backend
    //     // simulate the fetching of products
    //     setTimeout(() => {
    //         // set the products to the state variable
    //         const fetchedProducts = [
    //             {
    //                 _id: "1",
    //                 name: "Product 1",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=1",
    //                         altText: "Product 1",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "2",
    //                 name: "Product 2",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=2",
    //                         altText: "Product 2",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "3",
    //                 name: "Product 3",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=3",
    //                         altText: "Product 3",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "4",
    //                 name: "Product 4",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=4",
    //                         altText: "Product 4",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "5",
    //                 name: "Product 5",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=5",
    //                         altText: "Product 5",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "6",
    //                 name: "Product 6",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=6",
    //                         altText: "Product 6",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "7",
    //                 name: "Product 7",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=7",
    //                         altText: "Product 7",
    //                     },
    //                 ]
    //             },
    //             {
    //                 _id: "8",
    //                 name: "Product 8",
    //                 price: 100,
    //                 images: [
    //                     {
    //                         url:"https://picsum.photos/500/500?random=8",
    //                         altText: "Product 8",
    //                     },
    //                 ]
    //             }
    //         ];
    //         setProducts(fetchedProducts);
    //     }, 1000);
    // }, []);

    return (
        <div className="flex flex-col lg:flex-row">
            {/* Mobile Filter */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden border p-2 flex justify-center items-center">
                <FaFilter className="mr-2" /> Filters
            </button>

            {/* Filter Sidebar */}
            {/* ensure that the translate-x-full is negative so that the sidebar is hidden */}
            <div ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 
            lg:static lg:translate-x-0`}>
                <FilterSidebar />
            </div>
            <div className="flex-grow p-4">
                <h2 className="text-2xl uppercase mb-4">
                    All Collection
                </h2>
                {/* Sort Options */}
                <SortOptions />

                {/* Product Grid */}
                <ProductGrid products={products} loading={loading} error={error} />
            </div>
        </div>
    )
}
export default CollectionPage

// route in App.jsx

// for testing update the main link in Navbar