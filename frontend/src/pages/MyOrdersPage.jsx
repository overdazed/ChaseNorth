import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";
import {fetchUserOrders} from "../redux/slices/orderSlice.js";

// Custom scrollbar styles (same as FilterSidebar)
const scrollbarStyles = `
  .filter-scrollbar::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  .filter-scrollbar::-webkit-scrollbar-track {
    background-color: #f3f4f6; /* bg-neutral-100 */
    border-radius: 3px;
  }
  .filter-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d1d5db; /* bg-neutral-300 */
    border-radius: 3px;
  }
  .dark .filter-scrollbar::-webkit-scrollbar-track {
    background-color: #1f2937; /* dark:bg-neutral-800 */
  }
  .dark .filter-scrollbar::-webkit-scrollbar-thumb {
    background-color: #4b5563; /* dark:bg-neutral-600 */
  }
`;

const MyOrdersPage = () => {
    // Inject filter scrollbar styles
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = scrollbarStyles;
        document.head.appendChild(styleElement);
        
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    // state variable to hold the orders
    // const [orders, setOrders] = useState([]);

    // add a useNavigate hook for navigation
    const navigate = useNavigate();

    // useEffect(() => {
    //     // fetch the orders from the backend and set it to the "orders" state variable
    //     // Simulate fetching orders
    //     setTimeout(() => {
    //         const mockOrders = [
    //             {
    //                 _id: 12345,
    //                 createdAt: new Date(),
    //                 shippingAddress: {city: "New York", country: "USA", street: "123 Main St", zip: "12345"},
    //                 orderItems: [
    //                     {
    //                         name: "Product 1",
    //                         image: "https://picsum.photos/500/500?random=1"
    //                     }
    //                 ],
    //                 totalPrice: 100,
    //                 isPaid: true,
    //             },
    //             {
    //                 _id: 34564,
    //                 createdAt: new Date(),
    //                 shippingAddress: {city: "New York", country: "USA", street: "123 Main St", zip: "12345"},
    //                 orderItems: [
    //                     {
    //                         name: "Product 2",
    //                         image: "https://picsum.photos/500/500?random=2"
    //                     }
    //                 ],
    //                 totalPrice: 100,
    //                 isPaid: true,
    //             },
    //         ];
    //
    //         setOrders(mockOrders);
    //     }, 1000)
    // //     should be executed on page load
    // }, [])



    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);
    const [isDarkMode, setIsDarkMode] = useState(false)


    useEffect(() => {
        dispatch(fetchUserOrders());
        const handleThemeChange = (e) => {
            setIsDarkMode(e.detail.isDarkMode);
        };
        // Set initial theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
        }

        window.addEventListener('themeChange', handleThemeChange);
        return () => {
            window.removeEventListener('themeChange', handleThemeChange);
        };
    }, [dispatch])

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`);
    } // handleRowClick

    // if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;


    const bgClass = isDarkMode ? 'bg-neutral-950' : 'bg-neutral-50'
    const textClass = isDarkMode ? 'text-neutral-50' : 'text-neutral-950'
    const linkClass = isDarkMode ? 'text-red-700 hover:text-accent' : 'text-accent hover:text-red-700'
    const innerBgClass = isDarkMode ? 'bg-neutral-700' : 'bg-neutral-100'
    const borderClass = isDarkMode ? 'border-neutral-700' : 'border-neutral-200'

    return (
        <div className={`min-h-view flex flex-col ${bgClass} ${textClass} transition-colors duration-500`}>
            <div className="flex-grow container mx-auto p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                    {/* Right Section: Orders Table */}
                    <div className={`w-full ${bgClass} ${borderClass} rounded-lg`}>
                        <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${textClass}`}>
                            My Orders
                        </h2>
                        <div className="relative sm:rounded-lg overflow-hidden">
                            <table className={`min-w-full text-left ${textClass} block lg:table`}>
                                <thead className={`text-xs uppercase ${textClass} ${innerBgClass} lg:table-header-group hidden lg:block`}>
                                    <tr>
                                        <th className="py-2 px-4 sm:py-3">Image</th>
                                         <th className="py-2 px-4 sm:py-3 lg:max-xl:hidden">Order ID</th>
                                        <th className="py-2 px-4 sm:py-3">Created</th>
                                        {/*<th className="py-2 px-4 sm:py-3">Shipping Address</th>*/}
                                        <th className="py-2 px-4 sm:py-3">Items</th>
                                        <th className="py-2 px-4 sm:py-3">Price</th>
                                        <th className="py-2 px-4 sm:py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="block lg:table-row-group">
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr
                                        key={order._id}
                                        onClick={() => handleRowClick(order._id)}
                                        className={`border-b cursor-pointer ${borderClass} block lg:table-row md:pb-4 sm:pb-8`}>
                                             {/* Order Image */}
                                             <td className="py-4 px-4 block lg:table-cell pt-6">
                                                  {order.orderItems.length === 1 ? (
                                                      <img
                                                          src={order.orderItems[0].image}
                                                          alt={order.orderItems[0].name}
                                                          className="lg:w-8 lg:h-8 xl:w-10 xl:h-10 lg:rounded-sm md:w-32 md:h-32 w-[calc(50%-0.5rem)] h-auto object-cover rounded-lg mx-auto"
                                                      />
                                                  ) : (
                                                      <>
                                                          {/* Carousel for md (768-1023) */}
                                                          <div className="overflow-x-auto snap-x lg:hidden w-[calc(50%-0.5rem)] md:w-full mx-auto filter-scrollbar">
                                                              <div className="flex gap-2 md:gap-2 w-max pb-2">
                                                                  {order.orderItems.map((item, index) => (
                                                                      <img
                                                                          key={index}
                                                                          src={item.image}
                                                                          alt={item.name}
                                                                          className="h-8 w-8 flex-shrink-0 object-cover rounded-sm snap-center md:w-32 md:h-32"
                                                                      />
                                                                  ))}
                                                              </div>
                                                          </div>
                                                          {/* 2x2 grid for lg+ */}
                                                          <div className="hidden lg:grid grid-cols-2 gap-1 lg:w-8 lg:h-8 xl:w-10 xl:h-10 mx-auto">
                                                              {order.orderItems.slice(0, 4).map((item, index) => (
                                                                  <img
                                                                      key={index}
                                                                      src={item.image}
                                                                      alt={item.name}
                                                                      className="w-full h-full object-cover rounded-sm lg:rounded-[1px]"
                                                                  />
                                                              ))}
                                                          </div>
                                                      </>
                                                  )}
                                             </td>
                                            {/* Order ID */}
                                             <td
                                                 className={`py-2 px-2 sm:py-4 sm:px-4 ${linkClass} whitespace-nowrap block lg:table-cell lg:text-left lg:max-xl:hidden`}
                                             >
                                                <div className="lg:hidden flex justify-between items-center">
                                                    <span className={`font-semibold text-sm uppercase text-left ${textClass}`}>Order ID</span>
                                                    <span className="text-right">#{order._id}</span>
                                                </div>
                                                <div className="hidden lg:block">#{order._id}</div>
                                            </td>
                                            <td className="py-2 px-2 sm:py-4 sm:px-4 block lg:table-cell lg:text-left">
                                                <div className="lg:hidden flex justify-between items-center">
                                                    <span className="font-semibold text-sm uppercase text-left">Created</span>
                                                    <span className="text-right">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                        {" "}
                                                        {new Date(order.createdAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <div className="hidden lg:block">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                    {" "}
                                                    {new Date(order.createdAt).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            {/* check if order shipping address is present */}
                                            {/*<td className="py-2 px-2 sm:py-4 sm:px-4">*/}
                                            {/*    /!* if it is present, show the shipping address *!/*/}
                                            {/*    {order.shippingAddress ? `${order.shippingAddress.city},
                                            {/*    ${order.shippingAddress.country}` : "N/A"}*/}
                                            {/*</td>*/}
                                            <td className="py-2 px-2 sm:py-4 sm:px-4 block lg:table-cell lg:text-left">
                                                <div className="lg:hidden flex justify-between items-center">
                                                    <span className="font-semibold text-sm uppercase text-left">Items</span>
                                                    <span className="text-right">{order.orderItems.length}</span>
                                                </div>
                                                <div className="hidden lg:block">{order.orderItems.length}</div>
                                            </td>
                                            <td className="py-2 px-2 sm:py-4 sm:px-4 block lg:table-cell lg:text-left">
                                                <div className="lg:hidden flex justify-between items-center">
                                                    <span className="font-semibold text-sm uppercase text-left">Price</span>
                                                    <span className="text-right">{Number(order.totalPrice).toFixed(2)} €</span>
                                                </div>
                                                <div className="hidden lg:block">{Number(order.totalPrice).toFixed(2)} €</div>
                                            </td>
                                            <td className="py-2 px-2 sm:py-4 sm:px-4 block lg:table-cell lg:text-left">
                                                <div className="lg:hidden flex justify-between items-center">
                                                    <span className="font-semibold text-sm uppercase text-left">Status</span>
                                                    <span className="text-right">
                                                        <span className={`${order.isPaid ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"} px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                                                        >
                                                            {order.isPaid ? "Paid" : "Pending"}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="hidden lg:block">
                                                    <span className={`${order.isPaid ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"} px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                                                    >
                                                        {order.isPaid ? "Paid" : "Pending"}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-4 px-4 text-center text-neutral-500"
                                        >
                                            You have no orders
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MyOrdersPage

// include in Profile.jsx component