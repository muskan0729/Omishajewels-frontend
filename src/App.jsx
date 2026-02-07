

import { BrowserRouter, Routes, Route } from "react-router-dom";

/* COMMON */
import { useState } from "react";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

/* PUBLIC PAGES */
import Home from "./pages/Home";
import ViewCart from "./pages/ViewCart";
import Checkout from "./pages/Checkout";
import OrderComplete from "./pages/OrderComplete";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import TermsConditions from "./pages/TermsConditions";
import RefundCancellation from "./pages/RefundCancellation";
import ReturnPolicy from "./pages/ReturnPolicy";
import WishlistPage from "./pages/my-account/Wishlist";

/* MY ACCOUNT */
import MyAccountLayout from "./pages/my-account/MyAccountLayout";
import DashboardMyaccont from "./pages/my-account/Dashboard";
import Orders from "./pages/my-account/Orders";
import Downloads from "./pages/my-account/Downloads";
import AccountDetails from "./pages/my-account/AccountDetails";
import AccountWishlist from "./pages/my-account/Wishlist";
import Logout from "./pages/my-account/Logout";
import Addresses from "./pages/my-account/Addresses";
import EditBillingAddress from "./pages/my-account/EditBillingAddress";
import EditShippingAddress from "./pages/my-account/EditShippingAddress";

import Cartprocess from "./components/Cartprocess";
import ShopPage from "./components/shop/ShopPage";


import AdminLayout from "./components/common/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Ebooks from "./pages/admin/Ebooks";
import Allorders from "./pages/admin/Allorders";
// import Users from "./pages/admin/Users";
// import Images from "./pages/admin/Images";
import Images from "./pages/admin/Images";
import AuthSidebar from "./components/auth/AuthSidebar";




function App() {
     const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState("login");

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route 
          path="/*" 
          element={
            <>

       <Header
        openLogin={() => {
          setAuthView("login");
          setAuthOpen(true);
        }}
      />

      {/* AUTH SIDEBAR (GLOBAL, NOT A ROUTE) */}
      <AuthSidebar
        open={authOpen}
        setOpen={setAuthOpen}
        view={authView}
        setView={setAuthView}
      />

      {/* AUTH SIDEBAR (GLOBAL, NOT A ROUTE) */}
      <AuthSidebar
        open={authOpen}
        setOpen={setAuthOpen}
        view={authView}
        setView={setAuthView}
      />

              <main className="min-h-screen bg-[#FEFCF9]">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/view-cart" element={<ViewCart />} />
                  {/* ... all your public routes */}
                  <Route path="/checkout" element = {<Checkout />} />
           <Route path="/order" element = {<OrderComplete />} />
         <Route path="/shop" element = {<ShopPage />} />

          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/refund-policy" element={<RefundCancellation />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* MY ACCOUNT ROUTES */}
        <Route path="/my-account" element={<MyAccountLayout />}>
  <Route index element={<DashboardMyaccont />} />
  <Route path="orders" element={<Orders />} />
  <Route path="downloads" element={<Downloads />} />
  <Route path="addresses" element={<Addresses />} />
  <Route path="account-details" element={<AccountDetails />} />
  <Route path="wishlist" element={<AccountWishlist />} />
  <Route path="logout" element={<Logout />} />
  <Route path="edit-address" element={<Addresses />} />
<Route path="edit-address/billing" element={<EditBillingAddress />} />
<Route path="edit-address/shipping" element={<EditShippingAddress />} />
</Route>

<Route path="/my-account" element={<MyAccountLayout />}>
  <Route index element={<DashboardMyaccont />} />

  <Route path="edit-address" element={<Addresses />} />
  <Route path="edit-address/billing" element={<EditBillingAddress />} />
  <Route path="edit-address/shipping" element={<EditShippingAddress />} />
</Route>
 <Route path="/Cartprocess" element={<Cartprocess />} />
      
                </Routes>
              </main>
              <Footer />
            </>
          } 
        />

        {/* ADMIN ROUTES - SEPARATE LAYOUT */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="ebooks" element={<Ebooks />} />
          <Route path="orders" element={<Allorders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;