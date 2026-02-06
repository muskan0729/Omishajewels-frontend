import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Home from "./pages/Home";
import ViewCart from "./pages/ViewCart";
import Checkout from "./pages/Checkout";
import OrderComplete from "./pages/OrderComplete";

function App() {
  return (
    <BrowserRouter>
      <Header />

      {/* Page Content */}
      <main className="min-h-screen bg-[#FEFCF9]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view-cart" element ={<ViewCart/> }/>
          <Route path="/checkout" element = {<Checkout />} />
           <Route path="/order" element = {<OrderComplete />} />
         

        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
