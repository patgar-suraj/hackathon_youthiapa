import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { GiClothesline } from "react-icons/gi";
import Button from "./pages/customs/Button"; // <-- FIXED RELATIVE IMPORT
import { useNavigate } from "react-router-dom";

// Move NAV_ITEMS outside of component and do NOT use hooks at top-level
const NAV_ITEMS = ["Home", "Products", "About", "Login"];

// Extract showDesktopNav logic to a custom hook to avoid using hooks inside render
function useShowDesktopNav() {
  const [showDesktopNav, setShowDesktopNav] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    function handleResize() {
      setShowDesktopNav(window.innerWidth >= 1024);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return showDesktopNav;
}

const NavBar = () => {
  // State
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Refs
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);
  const logoRef = useRef(null);
  const navItemsRef = useRef([]);
  const audioButtonRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  // Scroll
  const { y: currentScrollY } = useWindowScroll();

  // React Router navigation
  const navigate = useNavigate();

  // Handlers (memoized)
  const toggleAudioIndicator = useCallback(() => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Handle Login navigation
  const handleLoginClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate("/login");
    },
    [navigate]
  );

  // Handle Products navigation
  const handleProductsClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate("/products");
    },
    [navigate]
  );

  // Handle Home navigation
  const handleHomeClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate("/");
    },
    [navigate]
  );

  // Handle About navigation
  const handleAboutClick = useCallback(
    (e) => {
      e.preventDefault();
      navigate("/about");
    },
    [navigate]
  );

  // Initial animation on mount
  useEffect(() => {
    // Defensive: filter out nulls
    const navRefs = [logoRef.current, ...navItemsRef.current, audioButtonRef.current, mobileMenuButtonRef.current].filter(Boolean);
    gsap.set(navRefs, { x: -100, opacity: 0 });

    const tl = gsap.timeline();
    tl.to(logoRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, 0.5)
      .to(navItemsRef.current.filter(Boolean), {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1
      }, "<")
      .to([audioButtonRef.current, mobileMenuButtonRef.current].filter(Boolean), {
        x: 0,
        opacity: 1,
        duration: 1.0,
        ease: "power2.out"
      }, "<");
  }, []);

  // Manage audio playback
  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;
    if (isAudioPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isAudioPlaying]);

  // Navbar show/hide on scroll
  useEffect(() => {
    if (!navContainerRef.current) return;
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }
    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  // Animate navbar slide in/out
  useEffect(() => {
    if (!navContainerRef.current) return;
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
      overwrite: "auto"
    });
  }, [isNavVisible]);

  // Memoized nav items for rendering (not strictly needed, but safe)
  const navLinks = useMemo(() => NAV_ITEMS, []);

  // Desktop nav visibility (moved out of render)
  const showDesktopNav = useShowDesktopNav();

  return (
    <div
      ref={navContainerRef}
      className={clsx(
        // Glass effect, border, shadow, rounded, fixed, responsive margin
        "fixed left-0 right-0 top-4 z-50 transition-all duration-700 mx-2 md:mx-36 lg:mx-10",
        // Tailwind glass effect
        "bg-[rgba(20,24,40,0.55)] backdrop-blur-[18px] rounded-[18px] border border-white/15 shadow-[0_4px_32px_0_rgba(0,0,0,0.12)]"
      )}
      // Remove style prop, use Tailwind for all styling
    >
      <header className="w-full">
        {/* Nav bar height: h-9 (mobile), h-12 (md), h-16 (lg) */}
        <nav className="flex w-full h-9 md:h-12 lg:h-16 items-center justify-between p-2 lg:p-4 rounded-lg">
          {/* Logo */}
          <div className="flex items-center">
            <img
              ref={logoRef}
              src="/img/logo.avif"
              alt="Logo"
              className="w-[100px] h-auto invert brightness-120"
              // No style prop, use Tailwind for invert/brightness
            />
          </div>
          <div className="w-full flex items-center justify-end gap-5 lg:gap-6">
            {/* Desktop Navigation Links */}
            {showDesktopNav && (
              <div className="flex items-center gap-2.5 lg:gap-3">
                {navLinks.map((item, index) => {
                  if (item === "Login") {
                    return (
                      <a
                        key={item}
                        href="/login"
                        ref={el => (navItemsRef.current[index] = el)}
                        className="inline-block"
                        tabIndex={0}
                        onClick={handleLoginClick}
                      >
                        <Button
                          bullet={<GiClothesline />}
                          title={item}
                          containerClass="bg-blue-50 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg hover:bg-yellow-400 transition-all duration-200 flex items-center gap-2"
                        />
                      </a>
                    );
                  }
                  if (item === "Products") {
                    return (
                      <a
                        key={item}
                        href="/products"
                        ref={el => (navItemsRef.current[index] = el)}
                        className="inline-block"
                        tabIndex={0}
                        onClick={handleProductsClick}
                      >
                        <Button
                          bullet={<GiClothesline />}
                          title={item}
                          containerClass="bg-blue-50 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg hover:bg-yellow-400 transition-all duration-200 flex items-center gap-2"
                        />
                      </a>
                    );
                  }
                  if (item === "Home") {
                    return (
                      <a
                        key={item}
                        href="/"
                        ref={el => (navItemsRef.current[index] = el)}
                        className="inline-block"
                        tabIndex={0}
                        onClick={e => {
                          e.preventDefault();
                          navigate("/");
                        }}
                      >
                        <Button
                          bullet={<GiClothesline />}
                          title={item}
                          containerClass="bg-blue-50 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg hover:bg-yellow-400 transition-all duration-200 flex items-center gap-2"
                        />
                      </a>
                    );
                  }
                  if (item === "About") {
                    return (
                      <a
                        key={item}
                        href="/about"
                        ref={el => (navItemsRef.current[index] = el)}
                        className="inline-block"
                        tabIndex={0}
                        onClick={handleAboutClick}
                      >
                        <Button
                          bullet={<GiClothesline />}
                          title={item}
                          containerClass="bg-blue-50 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg hover:bg-yellow-400 transition-all duration-200 flex items-center gap-2"
                        />
                      </a>
                    );
                  }
                  // fallback (should not happen)
                  return (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      ref={el => (navItemsRef.current[index] = el)}
                      className="inline-block"
                      tabIndex={0}
                    >
                      <Button
                        bullet={<GiClothesline />}
                        title={item}
                        containerClass="bg-blue-50 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg hover:bg-yellow-400 transition-all duration-200 flex items-center gap-2"
                      />
                    </a>
                  );
                })}
              </div>
            )}
            {/* Right side - Audio button and Mobile menu button */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Audio Button */}
              <button
                ref={audioButtonRef}
                onClick={toggleAudioIndicator}
                className="flex items-center space-x-0.5"
                aria-label="Toggle audio"
                type="button"
              >
                <audio
                  ref={audioElementRef}
                  className="hidden"
                  src="/audio/loop.mp3"
                  loop
                />
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={clsx(
                      "w-1 h-4 mx-0.5 rounded bg-yellow-400 transition-all duration-200",
                      "indicator-line",
                      { "opacity-100": isIndicatorActive, "opacity-40": !isIndicatorActive }
                    )}
                    style={{
                      animationDelay: `${bar * 0.1}s`,
                    }}
                  />
                ))}
              </button>
              {/* Mobile menu button */}
              <button
                ref={mobileMenuButtonRef}
                onClick={toggleMobileMenu}
                className="lg:hidden md:p-1.5 rounded-md bg-blue-50 hover:bg-yellow-400 transition-colors duration-200"
                aria-label="Toggle mobile menu"
                type="button"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>
        {/* Mobile Menu */}
        <div
          className={clsx(
            "lg:hidden mt-2 bg-black/55 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="p-3 space-y-2.5">
            {navLinks.map((item, idx) => {
              if (item === "Login") {
                return (
                  <a
                    key={item}
                    href="/login"
                    onClick={e => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      navigate("/login");
                    }}
                    className="block w-full"
                    ref={el => (navItemsRef.current[idx + navLinks.length] = el)}
                    tabIndex={0}
                  >
                    <Button
                      bullet={<GiClothesline />}
                      title={item}
                      containerClass="bg-blue-50 w-full px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition-all duration-200 flex items-center gap-2 justify-center"
                    />
                  </a>
                );
              }
              if (item === "Products") {
                return (
                  <a
                    key={item}
                    href="/products"
                    onClick={e => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      navigate("/products");
                    }}
                    className="block w-full"
                    ref={el => (navItemsRef.current[idx + navLinks.length] = el)}
                    tabIndex={0}
                  >
                    <Button
                      bullet={<GiClothesline />}
                      title={item}
                      containerClass="bg-blue-50 w-full px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition-all duration-200 flex items-center gap-2 justify-center"
                    />
                  </a>
                );
              }
              if (item === "Home") {
                return (
                  <a
                    key={item}
                    href="/"
                    onClick={e => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      navigate("/");
                    }}
                    className="block w-full"
                    ref={el => (navItemsRef.current[idx + navLinks.length] = el)}
                    tabIndex={0}
                  >
                    <Button
                      bullet={<GiClothesline />}
                      title={item}
                      containerClass="bg-blue-50 w-full px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition-all duration-200 flex items-center gap-2 justify-center"
                    />
                  </a>
                );
              }
              if (item === "About") {
                return (
                  <a
                    key={item}
                    href="/about"
                    onClick={e => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      navigate("/about");
                    }}
                    className="block w-full"
                    ref={el => (navItemsRef.current[idx + navLinks.length] = el)}
                    tabIndex={0}
                  >
                    <Button
                      bullet={<GiClothesline />}
                      title={item}
                      containerClass="bg-blue-50 w-full px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition-all duration-200 flex items-center gap-2 justify-center"
                    />
                  </a>
                );
              }
              // fallback (should not happen)
              return (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full"
                  ref={el => (navItemsRef.current[idx + navLinks.length] = el)}
                  tabIndex={0}
                >
                  <Button
                    bullet={<GiClothesline />}
                    title={item}
                    containerClass="bg-blue-50 w-full px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition-all duration-200 flex items-center gap-2 justify-center"
                  />
                </a>
              );
            })}
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavBar;