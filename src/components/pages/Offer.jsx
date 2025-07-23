import { BiSolidDiscount } from "react-icons/bi";
import { TbArrowLoopLeft, TbArrowIteration } from "react-icons/tb";
import gsap from "gsap";
import { MAIN_IMAGES, COMBO_IMAGES, COUPON_IMAGES } from "../OfferData";
import { useRef, useState, useEffect, useCallback, memo } from "react";

// Memoized ComboImage for performance
const ComboImage = memo(({ src, alt }) => {
  const imgRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Memoize handlers to avoid recreation
  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    if (!imgRef.current) return;
    gsap.to(imgRef.current, {
      y: -10,
      rotate: 3,
      scale: 1.05,
      duration: 0.25,
      ease: "power2.out",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if (!imgRef.current) return;
    gsap.to(imgRef.current, {
      y: 0,
      rotate: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`w-1/4 rounded-3xl min-w-0 flex-shrink-0 object-cover block will-change-transform transition-shadow duration-200 ${hovered ? "shadow-lg" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      draggable={false}
    />
  );
});
ComboImage.displayName = "ComboImage";

const isMobileOrTablet = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 1024; // <lg
};

const Offer = () => {
  // Main images carousel (swipe after 2 seconds infinitely)
  const mainRef = useRef(null);
  const [mainIndex, setMainIndex] = useState(0);

  // Combo images carousel
  const comboRef = useRef(null);

  // Coupon scroll
  const couponRef = useRef(null);

  // Track device type for responsive logic
  const [isMobileTablet, setIsMobileTablet] = useState(isMobileOrTablet());

  // Helper to get offset for carousels
  const getOffset = (el, gap) => {
    const child = el?.children[0];
    return child ? child.offsetWidth + gap : 0;
  };

  // Listen for resize to update device type
  useEffect(() => {
    const handleResize = () => {
      setIsMobileTablet(isMobileOrTablet());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animate main images: swipe after 2 seconds infinitely
  useEffect(() => {
    if (!mainRef.current) return;
    let intervalId;
    const el = mainRef.current;

    gsap.set(el, { x: 0 });

    intervalId = setInterval(() => {
      setMainIndex((prev) => {
        const next = (prev + 1) % MAIN_IMAGES.length;
        const offset = getOffset(el, 40); // gap-10
        gsap.to(el, {
          x: -next * offset,
          duration: 0.7,
          ease: "power2.inOut",
        });
        return next;
      });
    }, 3000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, []);

  // Reset main carousel position if window resizes (to avoid offset issues)
  useEffect(() => {
    const handleResize = () => {
      if (!mainRef.current) return;
      const el = mainRef.current;
      const offset = getOffset(el, 40);
      gsap.set(el, { x: -mainIndex * offset });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line
  }, [mainIndex]);

  // --- Combo carousel: infinite only on button click/drag ---

  // We'll keep a state for the current visible index (virtual, for infinite)
  const [comboIndex, setComboIndex] = useState(0);
  const [comboImages, setComboImages] = useState([...COMBO_IMAGES]);
  const comboAnimatingRef = useRef(false);

  // Helper to get offset for combo carousel
  const getComboOffset = useCallback(() => {
    if (!comboRef.current) return 0;
    const child = comboRef.current.children[0];
    return child ? child.offsetWidth + 40 : 0;
  }, []);

  // When window resizes, reset position
  useEffect(() => {
    if (!comboRef.current) return;
    gsap.set(comboRef.current, { x: 0 });
    setComboIndex(0);
    setComboImages([...COMBO_IMAGES]);
  }, [isMobileTablet]);

  // Infinite scroll logic for combo: only on button click/drag
  // When moving right, if at end, append first image to end and shift left
  // When moving left, if at start, prepend last image to start and shift right

  const handleComboRight = useCallback(() => {
    if (!comboRef.current || comboAnimatingRef.current) return;
    comboAnimatingRef.current = true;

    const el = comboRef.current;
    const offset = getComboOffset();

    // Animate left by one image
    gsap.to(el, {
      x: `-=${offset}`,
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => {
        // After animation, if at end, move first image to end and reset x
        setComboImages((prev) => {
          const newArr = [...prev];
          const first = newArr.shift();
          newArr.push(first);
          // Instantly reset x to 0 for seamless effect
          gsap.set(el, { x: 0 });
          comboAnimatingRef.current = false;
          return newArr;
        });
      },
    });
  }, [getComboOffset]);

  const handleComboLeft = useCallback(() => {
    if (!comboRef.current || comboAnimatingRef.current) return;
    comboAnimatingRef.current = true;

    const el = comboRef.current;
    const offset = getComboOffset();

    // Before animation, move last image to front and shift x instantly
    setComboImages((prev) => {
      const newArr = [...prev];
      const last = newArr.pop();
      newArr.unshift(last);
      // Instantly shift x to -offset so that animating to 0 slides right
      gsap.set(el, { x: -offset });
      // Animate to x: 0
      gsap.to(el, {
        x: 0,
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          comboAnimatingRef.current = false;
        },
      });
      return newArr;
    });
  }, [getComboOffset]);

  // Touch/drag support for combo carousel
  // Only allow horizontal drag, and on drag end, snap to next/prev image and do infinite logic
  useEffect(() => {
    const el = comboRef.current;
    if (!el) return;

    let startX = 0;
    let currentX = 0;
    let dragging = false;
    let dragOffset = 0;

    const onPointerDown = (e) => {
      if (comboAnimatingRef.current) return;
      dragging = true;
      startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      currentX = gsap.getProperty(el, "x");
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      dragOffset = clientX - startX;
      gsap.set(el, { x: currentX + dragOffset });
    };

    const onPointerUp = (e) => {
      if (!dragging) return;
      dragging = false;
      const offset = getComboOffset();
      if (Math.abs(dragOffset) > offset / 3) {
        if (dragOffset < 0) {
          handleComboRight();
        } else {
          handleComboLeft();
        }
      } else {
        // Snap back
        gsap.to(el, { x: 0, duration: 0.3, ease: "power2.out" });
      }
      dragOffset = 0;
    };

    el.addEventListener("mousedown", onPointerDown);
    el.addEventListener("touchstart", onPointerDown, { passive: false });
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchend", onPointerUp);

    return () => {
      el.removeEventListener("mousedown", onPointerDown);
      el.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [handleComboLeft, handleComboRight, getComboOffset]);

  // Coupon infinite scroll (unchanged)
  useEffect(() => {
    if (!couponRef.current) return;
    const el = couponRef.current;
    const originalCount = COUPON_IMAGES.length;

    // Remove any previous duplicated children (if any)
    while (el.children.length > originalCount) {
      el.removeChild(el.lastChild);
    }

    // Now duplicate for seamless loop
    if (el.children.length === originalCount) {
      for (let i = 0; i < originalCount; i++) {
        const clone = el.children[i].cloneNode(true);
        el.appendChild(clone);
      }
    }

    // Calculate total width (for one set)
    const totalWidth = Array.from(el.children)
      .slice(0, originalCount)
      .reduce((acc, child) => acc + child.offsetWidth + 20, 0); // 20 = gap-5

    gsap.set(el, { x: 0 });
    const tween = gsap.to(el, {
      x: -totalWidth,
      duration: 20,
      ease: "linear",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % -totalWidth),
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div id="offer" className="relative w-screen h-auto p-3 md:p-10 overflow-hidden">
      <img src="/comboImg/offerbg.webp" alt="offerBg" className="absolute top-0 left-0 w-full h-full object-cover opacity-5 z-[-10]" />
      {/* Main images carousel */}
      <div className="main flex gap-10 w-full h-auto overflow-hidden rounded-2xl">
        <div
          ref={mainRef}
          className="flex gap-10 w-full will-change-transform"
        >
          {MAIN_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`main${i + 2}`}
              className="rounded-3xl min-w-0 w-auto flex-shrink-0 object-contain block"
              draggable={false}
            />
          ))}
        </div>
      </div>

      {/* Centered Super Saving Combos and Loved by Peoples */}
      <div className="w-full flex flex-col items-center justify-center px-10 lg:py-10 py-4">
        <div className="w-full flex flex-col items-center justify-center">
          <h1
            className="font-bold font-Verve-regular mb-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center w-full flex items-center justify-center"
          >
            Super Saving Combos
          </h1>
          <span
            className="font-Refrigerator-medium text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center w-full flex items-center justify-center"
          >
            Loved by People
          </span>
        </div>
      </div>

      {/* Combo images carousel */}
      <div className="relative w-full flex items-center justify-center md:px-20">
        {/* Show buttons only on desktop */}
        {!isMobileTablet && (
          <div
            className="group absolute left-0 text-xl md:text-3xl p-2 md:px-3 bg-white active:bg-yellow-200 transition-all duration-200 rounded-tl-2xl rounded-bl-3xl rounded-tr-3xl rounded-br-xl z-10"
            onClick={handleComboLeft}
            tabIndex={0}
            aria-label="Previous"
            role="button"
            style={{ cursor: "default" }}
          >
            <TbArrowLoopLeft className="group-active:scale-95" />
          </div>
        )}
        <div className="combo w-full overflow-hidden flex gap-10 rounded-3xl min-h-0">
          <div
            ref={comboRef}
            className="flex gap-2 md:gap-10 will-change-transform touch-pan-x select-none"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            {comboImages.map((src, i) => (
              <ComboImage key={i + "-" + src} src={src} alt={String(i + 1)} />
            ))}
          </div>
        </div>
        {!isMobileTablet && (
          <div
            className="group absolute right-0 text-xl md:text-3xl p-2 md:px-3 bg-white active:bg-yellow-200 transition-all duration-200 rounded-tl-2xl rounded-bl-3xl rounded-tr-3xl rounded-br-xl z-10"
            onClick={handleComboRight}
            tabIndex={0}
            aria-label="Next"
            role="button"
            style={{ cursor: "default" }}
          >
            <TbArrowIteration className="group-active:scale-95" />
          </div>
        )}
      </div>

      {/* Coupon infinite scroll */}
      <div className="w-full flex items-center justify-center mt-10 gap-2 md:gap-10 bg-[#212121] p-2 md:p-3 rounded-xl">
        <div>
          <h2 className="text-[10px] md:text-xl font-Refrigerator-medium text-white">
            <BiSolidDiscount />
            SPECIAL <br />
            COUPON <br />
            CORNER
          </h2>
        </div>
        <div className="coupon flex bg-white rounded-xl p-2 md:p-3 overflow-hidden gap-5 min-w-0 relative">
          <div
            ref={couponRef}
            className="flex gap-5 will-change-transform min-w-0"
          >
            {COUPON_IMAGES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`coupon${i + 1}`}
                className="w-40 sm:w-60 md:w-80 lg:w-96 min-w-0 flex-shrink-0 object-cover block"
                draggable={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Offer);
