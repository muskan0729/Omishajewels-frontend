import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Header />

      {/* Page Content */}
      <main className="min-h-screen bg-[#FEFCF9]">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
