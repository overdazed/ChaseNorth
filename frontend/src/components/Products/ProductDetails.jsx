import { useState } from "react"
import { useEffect } from "react"
import { toast } from "sonner"
import ProductGrid from "./ProductGrid.jsx";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {fetchProductDetails, fetchSimilarProducts} from "../../redux/slices/productsSlice.js";
import {addToCart} from "../../redux/slices/cartSlice.js";

// create a dummy product to work with
// const selectedProduct = {
//     name: "Stylish Jacket",
//     price: 120,
//     originalPrice: 150,
//     description: "A comfortable and stylish jacket perfect for any occasion.",
//     brand: "FashionBrand",
//     material: "Leather",
//     sizes: ["S", "M", "L", "XL"],
//     colors: ["Red", "Black"],
//     images: [
//         {
//             url:"https://picsum.photos/500/600?random=1",
//             altText: "Stylish Jacket 1",
//         },
//         {
//             url:"https://picsum.photos/500/600?random=2",
//             altText: "Stylish Jacket 2",
//         },
//     ]
//     // add more properties as needed
// }
//
// // similarProducts array
// const similarProducts = [
//     // add more products as needed
//     {
//         _id: "1",
//         name: "Product 1",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=3",
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
//                 url:"https://picsum.photos/500/500?random=4",
//                 altText: "Product 1",
//             },
//         ]
//     },
//     {
//         _id: "3",
//         name: "Product 3",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=5",
//                 altText: "Product 1",
//             },
//         ]
//     },
//     {
//         _id: "4",
//         name: "Product 4",
//         price: 100,
//         images: [
//             {
//                 url:"https://picsum.photos/500/500?random=6",
//                 altText: "Product 1",
//             },
//         ]
//     },
// ]


// pass productId as a prop
const ProductDetails = ({ productId }) => {

    // get the id from used params
    const {id} = useParams()

    // make use of useDispatch hook to dispatch actions
    const dispatch = useDispatch();

    // Structure selected product
    const { selectedProduct, loading, error, similarProducts } = useSelector(
        (state) => state.products
    );

    // Get the userId and guestId
    const { user, guestId } = useSelector((state) => state.auth);
    // Then under [isButtonDisabled] > create constant productFetch

    // change image when you click on a thumbnail
    // const [mainImage, setMainImage] = useState("");
    const [mainImage, setMainImage] = useState(null);

    // declare a few state variables that needs to be passed, when the user clicks the "add to cart" button
    // const [selectedSize, setSelectedSize] = useState("");
    const [selectedSize, setSelectedSize] = useState(null);

    // const [selectedColor, setSelectedColor] = useState("");
    const [selectedColor, setSelectedColor] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    // or id in the parameter
    const productFetchId = productId || id;

    useEffect(() => {
        // if the product id is not null
        if (productFetchId) {
            // then dispatch the fetchProductById action
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts({id: productFetchId}));
        }
    }, [dispatch, productFetchId]);

    useEffect(() => {
        // if selected Product has one or more images
        if (selectedProduct?.images?.length > 0) {
            // set the main image to the first image
            setMainImage(selectedProduct.images[0].url);
        }
    }, [selectedProduct]);

    const handleQuantityChange = (action) => {
        // if the action is "plus", increase the quantity
        if (action === "plus") setQuantity((prev) => prev + 1);
        // if the action is "minus", decrease the quantity (we don't want to have negative quantity)
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    }

    // declare add to cart function
    const handleAddToCart = () => {
        // if the user has not selected a size and a color
        if (!selectedSize || !selectedColor) {
            // display an error message
            toast.error("Please select a size and color before adding to cart.", {duration: 2000});
            return;
        }
            // disable the button
            setIsButtonDisabled(true);
            // to simulate the adding to cart functionality
    //         setTimeout(() => {
    //             // display a success message
    //             toast.success("Product added to cart!", {
    //                 duration: 2000
    //             });
    //             // enable the button
    //             // button not disabled, because we need to add the disabled attribute
    //             setIsButtonDisabled(false);
    //         }, 500);
    // }

            dispatch(
                addToCart({
                    productId: productFetchId,
                    quantity,
                    size: selectedSize,
                    color: selectedColor,
                    guestId,
                    userId: user?._id,
                })
            )
                .then(() => {
                    // display a success message
                    toast.success("Product added to cart!", {
                        duration: 1250,
                    });
                    // enable the button
                    setIsButtonDisabled(false);
                })
                .finally(() => {
                    setIsButtonDisabled(false);
                })
    }

    // Check for loading condition
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="p-6">
            {/* Ensure that the selected product is available */}
            {/* Add condition */}
            {selectedProduct && (
                <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
                    <div className="flex flex-col md:flex-row">
                        {/* declare Left Thumbnails */}
                        {/* hidden on smaller screens */}
                        <div className="hidden md:flex flex-col space-y-4 mr-6">
                            {/* look through the images */}
                            {selectedProduct.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.altText || `Thumbnail ${index}`}
                                    // add few classes if the image is selected
                                    // className="w-20 h-20 object-cover cursor-pointer border rounded-lg"
                                    className={`w-20 h-20 object-cover cursor-pointer border rounded-lg ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                                    // change image when you click on a thumbnail
                                    //pass this as a function
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))}
                        </div>
                        {/* Main Image */}
                        <div className="md:w-1/2">
                            <div className="mb-4">
                                {/* we haven't made use of the main image, we hardcoded it*/}
                                {/*<img src={selectedProduct.images[0]?.url} alt="Main Product" className="w-full h-auto object-cover rounded-lg"/>*/}
                                <img src={mainImage} alt="Main Product" className="w-full h-auto object-cover rounded-lg"/>
                            </div>
                        </div>
                        {/* Mobile Thumbnails */}
                        {/* In mobile version, Thumbnails appear below the main image */}
                        <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
                            {selectedProduct.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.altText || `Thumbnail ${index}`}
                                    className={`w-20 h-20 object-cover cursor-pointer border rounded-lg ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                                    // add same functionality (clicking on thumbnail to change the main image) to mobile
                                    onClick={() => setMainImage(image.url)}
                                />
                            ))}
                        </div>
                        {/* Right Section */}
                        <div className="md-w-1/2 md:ml-10">
                            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                                {selectedProduct.name}
                            </h1>
                            <p className="text-lg text-gray-600 mb-1 line-through">
                                {/* check to see if originalPrice is present */}
                                {/* if its present, display it with the $ symbol */}
                                {selectedProduct.originalPrice && `${selectedProduct.originalPrice}`}
                            </p>
                            {/* Price */}
                            <p className="text-xl text-gray-500 mb-2">
                                $ {selectedProduct.price}
                            </p>
                            {/* Description */}
                            <p className="text-gray-600 mb-4">
                                {selectedProduct.description}
                            </p>
                            <div className="mb-4">
                                <p className="text-gray-700">Color:</p>
                                <div className="flex gap-2 mt-2">
                                    {selectedProduct.colors?.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            // add a few classes if the color is selected
                                            className={`w-8 h-8 rounded-full border ${selectedColor === color ? "border-2 " +
                                                "border-black" : "border-gray-300"}`}
                                            style={{backgroundColor: color.toLocaleLowerCase(),
                                                filter: "brightness(0.5)"}}></button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="text-gray-700">Size:</p>
                                <div className="flex gap-2 mt-2">
                                    {selectedProduct.sizes?.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-12 flex items-center justify-center rounded border 
                                            ${selectedSize === size ? "bg-black text-white" : "" }`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <p className="text-gray-700">Quantity:</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <button onClick={() => handleQuantityChange("minus")} className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded text-lg font-bold">
                                        -
                                    </button>
                                    <span className="text-lg min-w-[30px] text-center">{quantity}</span>
                                    <button onClick={() => handleQuantityChange("plus")} className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded text-lg font-bold">
                                        +
                                    </button>
                                </div>
                            </div>
                            {/* Button for add to cart */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isButtonDisabled}
                                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                                    isButtonDisabled 
                                        ? "cursor-not-allowed opacity-50" 
                                        : "hover:bg-gray-900"
                                }`}
                            >
                                {/* if the button is disabled, add a cursor-not-allowed class*/}
                                {isButtonDisabled ? "Adding..." : `ADD TO CART`}
                            </button>
                            <div className="mt-10 text-gray-700">
                                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                                <table className="w-full text-left text-sm text-gray-600">
                                    <tbody>
                                        <tr>
                                            <td className="py-1">Brand</td>
                                            <td className="py-1">{selectedProduct.brand}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1">Material</td>
                                            <td className="py-1">{selectedProduct.material}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                    {/* You May Like Section */}
                    <div className="mt-20">
                        <h2 className="text-2xl text-center font-medium mb-4">
                            You May Also Like
                        </h2>
                        {/* pass the products to this component */}
                        {/* add loading and error for the similar products grid */}
                        {/* Check the Product Slice code*/}
                        <ProductGrid products={similarProducts} loading={loading} error={error} />
                    </div>
                </div>
            )}
        </div>
    )
}
export default ProductDetails

// include in Home.jsx