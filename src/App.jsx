import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      {/* HEADER */}
      <Header />

      {/* PAGE CONTENT */}
      <main className="min-h-screen bg-[#FEFCF9]">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
