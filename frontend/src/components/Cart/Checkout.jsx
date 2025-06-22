import { useNavigate } from "react-router-dom";
import {useState, useRef, useEffect} from "react";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import PaypalButton from "./PaypalButton.jsx";
import { countries, countryMap, isValidCountry, getCountrySuggestions } from "../../data/countries.jsx";
import { parsePhoneNumberFromString, getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import {useDispatch, useSelector} from "react-redux";
import {createCheckout} from "../../redux/slices/checkoutSlice.js";
import axios from "axios";

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [checkoutId, setCheckoutId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    });

    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/");
        }
    }, [cart , navigate]);

    const capitalizeFirstLetter = (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    const formRef = useRef(null);

    const handleCreateCheckout = async(e) => {
        e.preventDefault();

        const form = formRef.current;

        const requiredFields = [
            "firstName",
            "lastName",
            "address",
            "city",
            "postalCode",
            "country",
            "phone"
        ];

        let allValid = true;

        for (const name of requiredFields) {
            const input = form.elements.namedItem(name);
            if (input && typeof input.checkValidity === "function") {
                const valid = input.checkValidity();
                if (!valid) {
                    input.reportValidity();
                    allValid = false;
                    break;
                }
            }
        }

        if (!allValid) return;

        const phoneValueRaw = form.elements.namedItem("phone").value.trim();
        const userCountry = shippingAddress.country.trim();
        const countryLower = userCountry.toLowerCase();

        if (!isValidCountry(userCountry)) {
            const countryInput = form.elements.namedItem("country");
            const suggestions = getCountrySuggestions(userCountry);
            let errorMsg = "Please enter a valid country name";

            if (suggestions.length > 0) {
                errorMsg += ". Did you mean: " + suggestions.slice(0, 3).join(', ') + '?';
            }

            countryInput.setCustomValidity(errorMsg);
            countryInput.reportValidity();
            return;
        }

        const countryCode = countryMap[countryLower];
        const phoneNumber = parsePhoneNumberFromString(phoneValueRaw, countryCode);
        const exampleNumber = getExampleNumber(countryCode, examples);
        const exampleFormatted = exampleNumber ?
            exampleNumber.formatInternational() :
            `+${countryCode} XXX XXX XXXX`;

        if (!phoneNumber || !phoneNumber.isValid()) {
            const phoneInput = form.elements.namedItem("phone");
            phoneInput.setCustomValidity(
                `Please enter a valid phone number for ${countryCode}. Example: ${exampleFormatted}`
            );
            phoneInput.reportValidity();
            return
        } else {
            const phoneInput = form.elements.namedItem("phone");
            phoneInput.setCustomValidity("");
            setShippingAddress({
                ...shippingAddress,
                phone: phoneNumber.formatInternational()
            });
        }

        console.log('Sending to backend:', {
            shippingAddress: {
                ...shippingAddress,
            },
            cart: {
                products: cart.products,
                totalPrice: cart.totalPrice
            },
            timestamp: new Date().toISOString()
        });

        if (cart && cart.products.length > 0) {
            const res = await dispatch(
                createCheckout({
                    checkoutItems: cart.products,
                    shippingAddress,
                    paymentMethod: "PayPal",
                    totalPrice: cart.totalPrice
                })
            );
            if (res.payload && res.payload._id) {
                setCheckoutId(res.payload._id);
            }
        }
    }

    const handlePaymentSuccess = async(details) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                { paymentStatus: "paid", paymentDetails: details},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            await handleFinalizeCheckout(checkoutId);
        } catch (error) {
            console.error(error);
        }
    }

    const handlePhoneChange = (e) => {
        let value = e.target.value;

        if (value.includes('+') && !value.startsWith('+')) {
            value = '+' + value.replace(/\+/g, '');
        }

        let filteredValue = '';
        let plusCount = 0;

        for (let i = 0; i < value.length; i++) {
            const char = value[i];
            if (char === '+') {
                if (i === 0 && plusCount === 0) {
                    filteredValue += char;
                    plusCount++;
                }
            } else if (/[\d\s()\-]/.test(char)) {
                filteredValue += char;
            }
        }

        if (filteredValue.length > 20) return;

        setShippingAddress({
            ...shippingAddress,
            phone: filteredValue,
        });
    };

    const handleFinalizeCheckout = async (checkoutId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            navigate("/order-confirmation");
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) return <p>Loading cart ...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!cart || !cart.products || cart.products.length === 0) {
        return <p>Your cart is empty</p>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
            {/* Left Section */}
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl uppercase mb-6">Checkout</h2>
                {/* call a function "handleCreateCheckout" */}
                <form ref={formRef} onSubmit={handleCreateCheckout} >
                    <h3 className="text-lg mb-4">Contact Details</h3>
                    <div className="mb-4"><label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            // name="email"
                            // value="user@example.com"
                            // if value is present, value will be user.email
                            value={user ? user.email : ""}
                            className="w-full p-2 border rounded"
                            disabled
                        />
                    </div>
                    <h3 className="text-lg mb-4">Delivery</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={shippingAddress.firstName}
                                // value="John"
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        firstName: capitalizeFirstLetter(e.target.value)
                                    })
                                }
                                className="w-full p-2 border rounded"
                                required
                                pattern="[A-Za-z\s]+" // allows letters and spaces only
                                title="Please enter a valid name"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={shippingAddress.lastName}
                                // value="Smith"
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        lastName: capitalizeFirstLetter(e.target.value)
                                    })
                                }
                                className="w-full p-2 border rounded"
                                required
                                pattern="[A-Za-z\s]+" // allows letters and spaces only
                                title="Please enter a valid name"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={shippingAddress.address}
                            // value="Sdfg 23"
                            onChange={(e) =>
                                setShippingAddress({
                                    ...shippingAddress,
                                    address: capitalizeFirstLetter(e.target.value)
                                })
                            }
                            className="w-full p-2 border rounded"
                            required
                            pattern="^[A-Za-z\s]+\s\d+.*$" // requires at least one digit anywhere in the string
                            title="Address must include a street name,space and number"
                        />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">City</label>
                            <input
                                type="text"
                                name="city"
                                value={shippingAddress.city}
                                // value="New York"
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        city: capitalizeFirstLetter(e.target.value)
                                    })
                                }
                                className="w-full p-2 border rounded"
                                required
                                pattern="^[A-Za-z\s]+$" // only allows letters
                                title="City name must contain only letters"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={shippingAddress.postalCode}
                                // value="12345"
                                onChange={(e) =>
                                    setShippingAddress({
                                        ...shippingAddress,
                                        postalCode: e.target.value.trim()
                                    })
                                }
                                className="w-full p-2 border rounded"
                                required
                                pattern="^\d{5}(-\d{4})?$"  // Only digits
                                title="Postal code must contain numbers only, e.g. 12345 or 12345-6789"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Country</label>
                        <div className="relative">
                            <select
                                name="country"
                                value={shippingAddress.country}
                                onChange={(e) => {
                                    setShippingAddress({
                                        ...shippingAddress,
                                        country: e.target.value
                                    });
                                    // Clear any previous validation message
                                    e.target.setCustomValidity('');
                                }}
                                onMouseDown={() => setIsDropdownOpen(!isDropdownOpen)}
                                onBlur={() => setIsDropdownOpen(false)}
                                className="w-full p-2 pr-8 border rounded appearance-none bg-white"
                                required
                            >
                                {/*<option value="" placeholder="Select a country..." className="text-gray-400"></option>*/}
                                {/*<option value="" disabled hidden>Select a country...</option>*/}
                                <option value="" disabled hidden></option>
                                {countries.map((country) => (
                                    <option key={country.code} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>

                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                {isDropdownOpen ? (
                                    <FaCaretRight className="text-gray-400" />
                                ) : (
                                    <FaCaretDown className="text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={shippingAddress.phone}
                            onChange={handlePhoneChange}
                            className="w-full p-2 border rounded"
                            required
                            title="Enter a valid phone number"
                        />
                    </div>
                    {/* if the checkout id is not present, show the continue to payment button*/}
                    <div className="mt-6">
                        {!checkoutId ? (
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded"
                            >
                                Continue to Payment
                            </button>
                        ) : (
                            <div>
                                {/*<h3 className="text-lg mb-4">Pay with Paypal</h3>*/}
                                {/* Paypal payment button Component */}
                                <PaypalButton
                                    //amount={100} // total Price need to be paid
                                    amount={cart.totalPrice} // total Price need to be paid
                                    onSuccess={handlePaymentSuccess}
                                    onError={(err) => alert("Payment failed. Try again.")}
                                    // order confirmed, but we don't see the "Thank you" message
                                    // -> Order confirmation page needs to be created
                                />
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Right Section: Summary of our Order */}
            <div className="bg-gray-50 p-6 rounded-lg ">
                <h3 className="text-lg mb-4">Order Summary</h3>
                <div className="border-t py-4 mb-4">
                    {cart.products.map((product, index) => (
                        <div
                            key={index}
                            className="flex items-start justify-between py-2 border-b"
                        >
                            <div className="flex items-start">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-20 h-24 object-cover mr-4"
                                />
                                <div>
                                    <h3 className="text-md">{product.name}</h3>
                                    <p className="text-gray-500">Size: {product.size}</p>
                                    <p className="text-gray-500">Color: {product.color}</p>
                                </div>
                            </div>
                            {/* Price*/}
                            <p className="text-xl">${product.price?.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                {/* Total Price */}
                <div className="flex justify-between items-center text-lg mb-4">
                    <p>Subtotal</p>
                    <p>${cart.totalPrice?.toLocaleString()}</p>
                </div>
                {/* Shipping */}
                <div className="flex justify-between items-center text-lg">
                    <p>Shipping</p>
                    <p>Free</p>
                </div>
                <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
                    <p>Total</p>
                    <p>${cart.totalPrice?.toLocaleString()}</p>
                </div>


                {/* UI complete, work on Orders Confirmation page */}


            </div>
        </div>
    )
}
export default Checkout

// Add the route in App.jsx

