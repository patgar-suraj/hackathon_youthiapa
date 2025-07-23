import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Loading from "./components/Loading";
import ScrollToTop from "./components/pages/customs/ScrollToTop";
import Exclusive from "./components/home/Exclusive";
import Home from "./components/home/Home";
import NavBar from "./components/Navbar";
import Contact from "./components/home/Contact";
import Offer from "./components/home/Offer";
import HoodieSec from "./components/home/HoodieSec";
import CustomCursor from "./components/pages/customs/CustomCursor";
import About from "./components/About";

// Only lazy load heavy or rarely used pages
const Products = lazy(() => import("./components/pages/product/Products"));
const ProductDetails = lazy(() => import("./components/pages/product/ProductDetails"));

const HomeWithSections = () => (
  <>
    <Home />
    <Exclusive />
    <Offer />
    <HoodieSec />
    <Contact />
  </>
);

function App() {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <CustomCursor />
      {showLoading ? (
        // Wrap Loading in a div with className instead of class
        <div className="loading-wrapper">
          <Loading />
        </div>
      ) : (
        <>
          <ScrollToTop />
          <NavBar />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HomeWithSections />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/productDetails/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Suspense>
        </>
      )}
    </Router>
  );
}

export default App;
