import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Contact from "./components/Contact";
import Inventory from "./components/Inventory";
import Offer from "./components/Offer";
import HoodieSec from "./components/HoodieSec";

function App() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <Hero />
      <About />
      <Offer />
      <Features />
      <HoodieSec />
      <Inventory />
      <Contact />
    </main>
  );
}

export default App;
