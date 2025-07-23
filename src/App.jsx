import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import Loading from "./components/Loading";

const About = lazy(() => import("./components/pages/About"));
const Hero = lazy(() => import("./components/pages/Hero"));
const NavBar = lazy(() => import("./components/Navbar"));
const Contact = lazy(() => import("./components/pages/Contact"));
const Offer = lazy(() => import("./components/pages/Offer"));
const HoodieSec = lazy(() => import("./components/pages/HoodieSec"));
const CustomCursor = lazy(() => import("./components/CustomCursor"));

function App() {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Suspense fallback={null}>
        <CustomCursor />
        {showLoading ? (
          <Loading />
        ) : (
          <>
            <NavBar />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <About />
                    <Offer />
                    <HoodieSec />
                    <Contact />
                  </>
                }
              />
              <Route path="/login" element={<Login />} />
              {/* Add more routes as needed */}
            </Routes>
          </>
        )}
      </Suspense>
    </Router>
  );
}

export default App;
