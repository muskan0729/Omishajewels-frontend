import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Login from "./components/Login";
import Cartprocess from "./components/Cartprocess";

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
          <Route path="/Cartprocess" element={<Cartprocess />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
