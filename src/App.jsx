import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import ViewCart from "./pages/ViewCart";
import Checkout from "./pages/Checkout";
import OrderComplete from "./pages/OrderComplete";
import Login from "./components/Login";
import Cartprocess from "./components/Cartprocess";
import Register from "./components/Register";


function App() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <BrowserRouter>
      {/* HEADER */}
      <Header setLoginOpen={setLoginOpen} />

      {/* LOGIN SIDEBAR (NOT A ROUTE) */}
      <Login open={loginOpen} setOpen={setLoginOpen} />


      

      {/* PAGE CONTENT */}
      <main className="min-h-screen bg-[#FEFCF9]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view-cart" element ={<ViewCart/> }/>
          <Route path="/checkout" element = {<Checkout />} />
           <Route path="/order" element = {<OrderComplete />} />
          <Route path="/Cartprocess" element={<Cartprocess />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
