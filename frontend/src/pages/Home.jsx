import Hero from '../components/Layout/Hero'
import GenderCollectionSection from "../components/Products/GenderCollectionSection.jsx";
import NewArrivals from "../components/Products/NewArrivals.jsx";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";
import FeaturedCollection from "../components/Products/FeaturedCollection.jsx";
import FeaturesSection from "../components/Products/FeaturesSection.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchProductsByFilters} from "../redux/slices/productsSlice.js";
import axios from "axios";


// const placeholderProducts = [
//     {
//         _id: "1",
//         name: "Product 1",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=1",
//                 altText: "Product 1",
//             },
//         ]
//     },
//     {
//         _id: "2",
//         name: "Product 2",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=2",
//                 altText: "Product 2",
//             },
//         ]
//     },
//     {
//         _id: "3",
//         name: "Product 3",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=3",
//                 altText: "Product 3",
//             },
//         ]
//     },
//     {
//         _id: "4",
//         name: "Product 4",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=4",
//                 altText: "Product 4",
//             },
//         ]
//     },
//     {
//         _id: "5",
//         name: "Product 5",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=5",
//                 altText: "Product 5",
//             },
//         ]
//     },
//     {
//         _id: "6",
//         name: "Product 6",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=6",
//                 altText: "Product 6",
//             },
//         ]
//     },
//     {
//         _id: "7",
//         name: "Product 7",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=7",
//                 altText: "Product 7",
//             },
//         ]
//     },
//     {
//         _id: "8",
//         name: "Product 8",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=8",
//                 altText: "Product 8",
//             },
//         ]
//     }
// ]

const Home = () => {
    // We will making use of the useDispatch hook
    const dispatch = useDispatch();
    // Get the products, loading and error using the useSelector hook, that allows us to access data from the reduxstore
    const { products, loading, error } = useSelector((state) => state.products);
    // remember our products are available in our productsSlice

    // add a constant for best seller product
    const [bestSellerProduct, setBestSellerProduct] = useState(null);

    useEffect(() => {
        // Fetch products for a specific collection
        dispatch(
            fetchProductsByFilters({
            gender: "Women",
            category: "Bottom Wear",
            limit: 8
            })
        );
        // Fetch best seller product
        const fetchBestSeller = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
                );
                setBestSellerProduct(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBestSeller();
        // dependencies array
    }, [dispatch]);

    return (
        <div>
            <Hero/> {/* update Routes in App.jsx*/}
            <GenderCollectionSection/>
            <NewArrivals/>

            {/* Best Sellers Section */}
            <h2 className="text-3xl text-center font-bold mb-4">
                Best Seller
            </h2>
            {/* Add a condition, if bestSellerProduct is present, then we will call the ProductDetails component, pass the product Id */}
            {bestSellerProduct ? (
                <ProductDetails productId={bestSellerProduct._id} />
            ) : (
                <p className="text-center">Loading best seller product ...</p>
            )}

            {/* make the top womans section, which uses the same product grid */}
            <div className="container mx-auto">
                <h2 className="text-3xl text-center font-bold mb-4">
                    Top Wears for Women
                </h2>
                {/*<ProductGrid products={placeholderProducts}/>*/}
                {/* pass loading and error */}
                {/* open ProductGrid.jsx > pass in loading and error */}
                <ProductGrid products={products} />
            </div>

            {/* Featured Collection */}
            <FeaturedCollection/>

            {/* Features Section */}
            <FeaturesSection/>
        </div>
    )
}
export default Home
