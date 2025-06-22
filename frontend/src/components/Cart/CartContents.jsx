import {RiDeleteBin3Line} from "react-icons/ri";
import {useDispatch} from "react-redux";
import {removeFromCart, updateCartItemQuantity} from "../../redux/slices/cartSlice.js";

const CartContents = ({cart, userId, guestId}) => {
    const dispatch = useDispatch();

    // Handle adding or subtracting to cart
    // delta is the value that the user can add or subtract from the cart, delta > 1 for addition and delta > -1 for subtraction
    const handleAddToCart = (productId, delta, quantity, size, color) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1) {
            dispatch(
                updateCartItemQuantity({
                    productId,
                    quantity: newQuantity,
                    guestId,
                    userId,
                    size,
                    color
                })
            );
        }
    }

    // hardcode some value for cart items
    // picsum.photos api will act as placeholder image, ?random=1 generates a unique random image
    // const cartProducts = [
    //     {
    //         productId: 1,
    //         name: "T-Shirt",
    //         size: "M",
    //         color: "Red",
    //         quantity: 1,
    //         price: 15,
    //         image: "https://picsum.photos/200?random=1"
    //     },
    //     {
    //         productId: 2,
    //         name: "Jeans",
    //         size: "L",
    //         color: "Blue",
    //         quantity: 1,
    //         price: 25,
    //         image: "https://picsum.photos/200?random=2"
    //     },
    // ];

    const handleRemoveFromCart = (productId, size, color) => {
        dispatch(
            removeFromCart({productId, guestId, userId, size, color}))
    }

    return (
        <div>
            {
                cart.products.map((product, index) => (
                    <div key={index} className="flex items-start justify-between py-4 border-b">
                        {/* should be items-center?!?*/}
                        <div className="flex items-start">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-20 h-24 object-cover mr-4 rounded"
                            />
                            <div>
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-sm text-gray-500">
                                    size: {product.size} | color: {product.color}
                                </p>
                                <div className="flex items-center mt-2">
                                    <button
                                        onClick={() =>
                                            handleAddToCart(
                                                product.productId,
                                                -1,
                                                product.quantity,
                                                product.size,
                                                product.color)
                                        }
                                        className="border rounded px-2 py-1 text-xl font-medium">
                                        -
                                    </button>
                                    <span className="mx-4">{product.quantity}</span>
                                    <button
                                        onClick={() =>
                                            handleAddToCart(
                                                product.productId,
                                                1,
                                                product.quantity,
                                                product.size,
                                                product.color)
                                        }
                                        className="border rounded px-2 py-1 text-xl font-medium">
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Display the product price */}
                        <div>
                            <p className="text-lg font-semibold">$ {product.price.toLocaleString()}</p>
                            {/* Delete icon */}
                            <button
                                onClick={() =>
                                    handleRemoveFromCart(
                                        product.productId,
                                        product.size,
                                        product.color
                                    )
                                }
                            >
                                <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600"/>
                            </button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
export default CartContents
