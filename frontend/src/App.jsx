// LAST WORKING: 2026-01-15 00:47
// To FIX:
// Admin Panel
    //
// Preise überall
// Filter Selection
// colors
// language
// outdoor cooking
// vegan gear

// Farben
import React, { useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { useEffect, useRef } from 'react';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Normalize currency: DE (country code) should be treated as EUR (currency code)
const CURRENCY = import.meta.env.VITE_CURRENCY || "EUR";

// This component handles scroll restoration
const ScrollRestoration = () => {
    const { pathname, state } = useLocation();
    const navType = useNavigationType();
    const isInitialMount = useRef(true);

    useEffect(() => {
        // Handle initial page load or refresh
        if (isInitialMount.current) {
            isInitialMount.current = false;

            // Check if this is a refresh
            const navigationEntries = performance.getEntriesByType('navigation');
            const isPageRefresh = navigationEntries.length > 0 &&
                navigationEntries[0].type === 'reload';

            if (isPageRefresh) {
                // On refresh, scroll to top and clear saved positions
                window.scrollTo(0, 0);
                sessionStorage.removeItem(`scrollPos:${pathname}`);
            }
            return;
        }

        // Handle back/forward navigation
        if (navType === 'POP') {
            const savedPosition = sessionStorage.getItem(`scrollPos:${pathname}`);
            if (savedPosition) {
                // Use requestAnimationFrame to ensure DOM is ready
                const scrollToPosition = () => {
                    window.scrollTo({
                        top: parseInt(savedPosition, 10),
                        behavior: 'instant'
                    });
                };

                // Small delay to ensure the page has rendered
                const timer = setTimeout(scrollToPosition, 50);
                return () => clearTimeout(timer);
            } else {
                window.scrollTo(0, 0);
            }
        } else if (navType === 'PUSH') {
            // For new navigations, scroll to top
            window.scrollTo(0, 0);
        }

        // Save scroll position when leaving the page
        const handleBeforeUnload = () => {
            sessionStorage.setItem(`scrollPos:${pathname}`, window.scrollY);
        };

        // Save scroll position when the page is about to be unloaded
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Also save scroll position when the component unmounts
        return () => {
            handleBeforeUnload();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [pathname, navType]);

    return null;
};
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Toaster } from "sonner";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage.jsx";
import ProductDetails from "./components/Products/ProductDetails.jsx";
import Checkout from "./components/Cart/Checkout.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import ReturnPolicy from "./pages/ReturnPolicy.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import Impressum from "./pages/Impressum.jsx";
import Sustainability from "./pages/Sustainability.jsx";
import Mission from "./pages/Mission.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Projects from "./pages/Projects.jsx";
import SizeChart from "./pages/SizeChart.jsx";
import Delivery from "./pages/Delivery.jsx";
import Payments from "./pages/Payments.jsx";
import GiftCard from "./pages/GiftCard.jsx";
import WebDevPromotion from "./pages/WebDevPromotion.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import AdminHomePage from "./pages/AdminHomePage.jsx";
import UserManagement from "./components/Admin/UserManagement.jsx";
import ProductManagement from "./components/Admin/ProductManagement.jsx";
import EditProductPage from "./components/Admin/EditProductPage.jsx";
import AddProductForm from "./components/Admin/AddProductForm.jsx";
import OrderManagement from "./components/Admin/OrderManagement.jsx";
import ReportManagement from "./components/Admin/ReportManagement.jsx";
import Report from "./pages/Report";
import ReportConfirmation from "./pages/ReportConfirmation";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BugReport from "./pages/BugReport";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import {Provider, useDispatch, useSelector} from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/Common/ProtectedRoute.jsx";
import BugReportConfirmation from "@/pages/BugReportConfirmation.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";
import {updateWishlistCount} from "@/redux/slices/productsSlice.js";

// Under Construction Loading Screen Component
const UnderConstructionScreen = ({ onComplete }) => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Show the construction message for 8 seconds, then fade in the website
        const timer = setTimeout(() => {
            setShowContent(true);
            // Give time for the fade animation, then call onComplete
            setTimeout(() => {
                onComplete();
            }, 1000); // 1 second for fade animation
        }, 8000); // 8 seconds showing "under construction"

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800 transition-opacity duration-1000 ${
            showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
            <div className="text-center">
                <div className="mb-8">
                    <svg className="w-24 h-24 mx-auto mb-4 text-red-200 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-red-400 mb-4 fade-in">
                    This site is
                </h1>
                <h2 className="text-3xl md:text-5xl font-bold text-red-500 mb-8 animate-pulse">
                    under construction
                </h2>
                <div className="flex justify-center">
                    <div className="w-16 h-1 bg-red-200 rounded-full animate-pulse"></div>
                </div>
                <p className="text-neutral-400 mt-8 text-lg">
                    Please wait while we prepare your experience...
                </p>
            </div>
        </div>
    );
};

const WishlistInitializer = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const userId = user?._id || 'guest';

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`wishlist_${userId}`);
            const items = saved ? JSON.parse(saved) : [];
            // const userId = user?._id || 'guest';
            console.log(`Loading wishlist for user ${userId}:`, items);

            // Update the wishlist count in Redux
            dispatch(updateWishlistCount(items.length));
        }

        // console.log('Clearing wishlist from localStorage');
        // localStorage.removeItem('wishlist');
        // dispatch(updateWishlistCount(0));

        // console.log('WishlistInitializer mounted');
        //
        // if (typeof window !== 'undefined') {
        //     const saved = localStorage.getItem('wishlist');
        //     console.log('Initial wishlist from localStorage:', saved);
        //
        //     if (saved) {
        //         const wishlist = JSON.parse(saved);
        //         console.log('Parsed wishlist:', wishlist);
        //
        //         const uniqueWishlist = [...new Set(wishlist.map(id => String(id)))];
        //         console.log('Unique wishlist:', uniqueWishlist);
        //
        //         if (uniqueWishlist.length !== wishlist.length) {
        //             console.log('Found duplicates, updating localStorage');
        //             localStorage.setItem('wishlist', JSON.stringify(uniqueWishlist));
        //         }
        //         console.log('Dispatching wishlist count:', uniqueWishlist.length);
        //         dispatch(updateWishlistCount(uniqueWishlist.length));
        //     } else {
        //         console.log('No saved wishlist, setting count to 0');
        //         dispatch(updateWishlistCount(0));
        //     }
        // }

        return () => {
            console.log('WishlistInitializer unmounting');
        };
    }, [dispatch, userId]);

    return null;
};

const App = () => {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoadingComplete = () => {
        setIsLoading(false);
    };

    return (
        <Provider store={store}>
            {/* Under Construction Loading Screen */}
            {isLoading && (
                <UnderConstructionScreen onComplete={handleLoadingComplete} />
            )}

            {/* open Login.jsx file > import { loginUser } from '../redux/slices/authSlice' */}
            {/*// enables the client side routing*/}

            <PayPalScriptProvider
                options={{
                    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                    currency: CURRENCY,
                    intent: "capture",
                }}
            >

                <BrowserRouter>
                    <WishlistInitializer />
                    {/*    make sure it gets imported from the react-router-dom */}

                    {/*Client side routing. What is this? Why do we need it?*/}
                    {/*React apps are basically single page applications.*/}
                    {/*When building complex applications, it is obvious that they will contain multiple pages. */}
                    {/*Eg. Homepage, Product page, Card page, etc.. Every page will have its own unique URL. Eg. www.xxxx.com/home*/}
                    {/*When we talk about client side routing, each route is handled in the browser, */}
                    {/* rather than the server, making the application faster. */}
                    {/* That is why we use the react router library “react-router-dom” to create an impression of a multipage application.*/}

                    {/* include Sonner library here */}
                    <Toaster position="top-right"/>
                    <ScrollRestoration />

                    <Routes>

                        {/*Add the routes component from the react router dom, which helps us manage multiple routes in our application:*/}
                        {/*inside this you can add the individual routes using the route component*/}
                        {/*our e-commerce website will have separate Layouts for Users and Admins*/}

                        <Route path="/" element={<UserLayout/>}>
                            {/* User Layout */}
                            {/* UserLayout will contain common UI elements that we want to share across different pages.*/}
                            {/* Will serve as the Parent route, within which we will declare other routes like */}

                            <Route index element={<Home/>}/> {/* We will need to include the child component within the UserLayout component. -> Outlet component */}
                            {/* Outlet component will replace the child component depending on the route access.*/}
                            {/*Home*/}
                            {/*Products*/}
                            {/*Card*/}

                            <Route path="login" element={<Login/>} />
                            <Route path="register" element={<Register/>} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="collections/:collection" element={<CollectionPage />} />
                            <Route path="product/:id" element={<ProductDetails />} />
                            <Route path="checkout" element={<Checkout />} />
                            <Route path="order-confirmation" element={<OrderConfirmationPage />} />
                            <Route path="order/:id" element={<OrderDetailsPage />} />
                            <Route path="my-orders" element={<MyOrdersPage />} />
                            <Route path="wishlist" element={<Wishlist />} />
                            <Route path="faq" element={<FAQPage />} />
                            <Route path="return-policy" element={<ReturnPolicy />} />
                            <Route path="terms-and-conditions" element={<TermsAndConditions />} />
                            <Route path="impressum" element={<Impressum />} />
                            <Route path="privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="sustainability" element={<Sustainability />} />
                            <Route path="mission" element={<Mission />} />
                            <Route path="about" element={<About />} />
                            <Route path="contact" element={<Contact />} />
                            <Route path="projects" element={<Projects />} />
                            <Route path="size-chart" element={<SizeChart />} />
                            <Route path="delivery" element={<Delivery />} />
                            <Route path="payments" element={<Payments />} />
                            <Route path="gift-card" element={<GiftCard />} />
                            <Route path="need-a-website" element={<WebDevPromotion />} />
                            <Route path="report" element={<Report />} />
                            <Route path="report/confirmation" element={<ReportConfirmation />} />
                            <Route path="forgot-password" element={<ForgotPassword />} />
                            <Route path="reset-password/:token" element={<ResetPassword />} />
                            <Route path="bug-report" element={<BugReport />} />
                            <Route path="bug-report/confirmation" element={<BugReportConfirmation />} />
                            <Route path="verify-email" element={<EmailVerification />} />
                        </Route>
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute role="admin">
                                    <AdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            {/* Admin Layout */}
                            <Route index element={<AdminHomePage />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="products" element={<ProductManagement />} />
                            <Route path="products/new" element={<AddProductForm />} />
                            <Route path="products/:id/edit" element={<EditProductPage />} />
                            <Route path="orders" element={<OrderManagement />} />
                            <Route path="reports" element={<ReportManagement />} />
                            <Route path="reports/:id" element={<ReportManagement />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </PayPalScriptProvider>
        </Provider>
    )
}
export default App
