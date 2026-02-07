import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

/* COMMON */
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

/* AUTH */
import AuthSidebar from "./components/auth/AuthSidebar";

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
import ShopPage from "./components/shop/ShopPage";

/* MY ACCOUNT */
import MyAccountLayout from "./pages/my-account/MyAccountLayout";
import DashboardMyAccount from "./pages/my-account/Dashboard";
import Orders from "./pages/my-account/Orders";
import Downloads from "./pages/my-account/Downloads";
import Addresses from "./pages/my-account/Addresses";
import AccountDetails from "./pages/my-account/AccountDetails";
import AccountWishlist from "./pages/my-account/Wishlist";
import EditBillingAddress from "./pages/my-account/EditBillingAddress";
import EditShippingAddress from "./pages/my-account/EditShippingAddress";

/* ADMIN */
import AdminLayout from "./components/common/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Ebooks from "./pages/admin/Ebooks";
import Images from "./pages/admin/Images";

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState("login");

  const openLogin = () => {
    setAuthView("login");
    setAuthOpen(true);
  };

  return (
    <BrowserRouter>

      {/* HEADER */}
      <Header openLogin={openLogin} />

      {/* AUTH SIDEBAR (GLOBAL) */}
      <AuthSidebar
        open={authOpen}
        setOpen={setAuthOpen}
        view={authView}
        setView={setAuthView}
      />

      {/* ROUTES */}
      <main className="min-h-screen bg-[#FEFCF9]">
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/view-cart" element={<ViewCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order" element={<OrderComplete />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/refund-policy" element={<RefundCancellation />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />

          {/* MY ACCOUNT */}
          {/* <Route path="/my-account" element={<MyAccountLayout openLogin={openLogin} />}> */}
          <Route
  path="/my-account"
  element={
    <MyAccountLayout
      openLogin={() => {
        setAuthView("login");
        setAuthOpen(true);
      }}
    />
  }
>
            <Route index element={<DashboardMyAccount />} />
            <Route path="orders" element={<Orders />} />
            <Route path="downloads" element={<Downloads />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="account-details" element={<AccountDetails />} />
            <Route path="wishlist" element={<AccountWishlist />} />
            <Route path="edit-address/billing" element={<EditBillingAddress />} />
            <Route path="edit-address/shipping" element={<EditShippingAddress />} />
          </Route>

          {/* ADMIN */}
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="ebooks" element={<Ebooks />} />
            <Route path="images/:ebookId" element={<Images />} />
          </Route>

        </Routes>
      </main>

      <Footer />

    </BrowserRouter>
  );
}

export default App;
