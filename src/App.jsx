// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Header from "./components/common/Header";
// import Footer from "./components/common/Footer";
// import Home from "./pages/Home";
// import ViewCart from "./pages/ViewCart";
// import Checkout from "./pages/Checkout";
// import OrderComplete from "./pages/OrderComplete";

// import AdminLayout from "./components/common/AdminLayout";
// import Dashboard from "./pages/admin/Dashboard";
// import Categories from "./pages/admin/Categories";
// import Ebooks from "./pages/admin/Ebooks";
// import Images from "../pages/admin/Images";

// function App() {
//   return (
//     <BrowserRouter>
//       {/* HEADER */}
//       <Header />

//       {/* PAGE CONTENT */}
//       <main className="min-h-screen bg-[#FEFCF9]">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/view-cart" element ={<ViewCart/> }/>
//           <Route path="/checkout" element = {<Checkout />} />
//            <Route path="/order" element = {<OrderComplete />} />
         

//           {/* Admin */}
//       <Route element={<AdminLayout />}>
//         <Route path="/admin" element={<Dashboard />} />
//         <Route path="/admin/categories" element={<Categories />} />
//         <Route path="/admin/ebooks" element={<Ebooks />} />
//         <Route path="/admin/images/:ebookId" element={<Images />} />
//       </Route>

//         </Routes>
//       </main>

//       {/* FOOTER */}
//       <Footer />

//        <Route path="/admin/*" element={<AdminLayout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="categories" element={<Categories />} />
//           <Route path="ebooks" element={<Ebooks />} />
//           <Route path="images/:ebookId" element={<Images />} />
//         </Route>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import ViewCart from "./pages/ViewCart";
import Checkout from "./pages/Checkout";
import OrderComplete from "./pages/OrderComplete";

import AdminLayout from "./components/common/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Ebooks from "./pages/admin/Ebooks";
import Images from "./pages/admin/Images";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Header & Footer */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <main className="min-h-screen bg-[#FEFCF9]">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/view-cart" element={<ViewCart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order" element={<OrderComplete />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />

        {/* Admin Routes with AdminLayout */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="ebooks" element={<Ebooks />} />
          <Route path="images/:ebookId" element={<Images />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;