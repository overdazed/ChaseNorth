// rafce
import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import AdminHomePage from "./pages/AdminHomePage.jsx";
import UserManagement from "./components/Admin/UserManagement.jsx";
import ProductManagement from "./components/Admin/ProductManagement.jsx";
import EditProductPage from "./components/Admin/EditProductPage.jsx";
import OrderManagement from "./components/Admin/OrderManagement.jsx";

import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/Common/ProtectedRoute.jsx";


const App = () => {
    return (
        <Provider store={store}>
            {/* open Login.jsx file > import { loginUser } from '../redux/slices/authSlice' */}
            {/*// enables the client side routing*/}
            <BrowserRouter>
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
                        <Route path="products/:id/edit" element={<EditProductPage />} />
                        <Route path="orders" element={<OrderManagement />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}
export default App
