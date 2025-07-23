import { useRef, useEffect, useState, useCallback, memo } from "react";
import { BiSolidDiscount } from "react-icons/bi";
import { TbArrowLoopLeft, TbArrowIteration } from "react-icons/tb";
import gsap from "gsap";
import { MAIN_IMAGES, COMBO_IMAGES, COUPON_IMAGES } from "../OfferData";

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
  const [comboIndex, setComboIndex] = useState(0);

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

  // --- Combo carousel logic ---

  // Touch/drag state for mobile/tablet
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const isDragging = useRef(false);

  // --- FIX: Prevent jerking after slide on button click ---
  // We'll only animate in the comboIndex effect, and NOT in the button handlers.
  // The button handlers will just update comboIndex.

  const handleComboLeft = useCallback(() => {
    if (!comboRef.current) return;
    setComboIndex((prev) => {
      const next = prev <= 0 ? 0 : prev - 1;
      return next;
    });
  }, []);

  const handleComboRight = useCallback(() => {
    if (!comboRef.current) return;
    setComboIndex((prev) => {
      // Show max 4 images at a time, so max index = images.length - 4
      const max = COMBO_IMAGES.length - 3;
      const next = prev >= max ? max : prev + 1;
      return next;
    });
  }, []);

  // Touch/drag handlers for mobile/tablet
  useEffect(() => {
    if (!isMobileTablet) return; // Only for mobile/tablet
    const el = comboRef.current;
    if (!el) return;

    let animationFrame;
    let startX = 0;
    let lastX = 0;
    let dragging = false;
    let initialComboIndex = comboIndex;

    const maxIndex = COMBO_IMAGES.length - 3;

    const getComboOffset = () => getOffset(el, 40);

    const onTouchStart = (e) => {
      dragging = true;
      isDragging.current = true;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      lastX = startX;
      initialComboIndex = comboIndex;
      el.style.cursor = "grabbing";
    };

    const onTouchMove = (e) => {
      if (!dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - startX;
      lastX = clientX;
      const offset = getComboOffset();
      // Move the carousel visually
      gsap.set(el, { x: -initialComboIndex * offset + deltaX });
    };

    const onTouchEnd = (e) => {
      if (!dragging) return;
      dragging = false;
      isDragging.current = false;
      el.style.cursor = "";
      const clientX = e.changedTouches
        ? e.changedTouches[0].clientX
        : lastX;
      const deltaX = clientX - startX;
      const offset = getComboOffset();
      let newIndex = initialComboIndex;

      // Threshold: swipe at least 50px to change slide
      if (deltaX > 50) {
        newIndex = Math.max(0, initialComboIndex - 1);
      } else if (deltaX < -50) {
        newIndex = Math.min(maxIndex, initialComboIndex + 1);
      }

      setComboIndex((prev) => {
        return newIndex;
      });
    };

    // Mouse events for desktop touchpad
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("mousedown", onTouchStart);
    window.addEventListener("mousemove", onTouchMove);
    window.addEventListener("mouseup", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("mousedown", onTouchStart);
      window.removeEventListener("mousemove", onTouchMove);
      window.removeEventListener("mouseup", onTouchEnd);
    };
    // eslint-disable-next-line
  }, [isMobileTablet, comboIndex]);

  // Animate combo position on comboIndex change (for both button and drag)
  useEffect(() => {
    if (!comboRef.current) return;
    const el = comboRef.current;
    const offset = getOffset(el, 40);
    gsap.to(el, {
      x: -comboIndex * offset,
      duration: 0.7,
      ease: "power2.inOut",
    });
  }, [comboIndex]);

  // Reset combo position on mount
  useEffect(() => {
    if (!comboRef.current) return;
    gsap.set(comboRef.current, { x: 0 });
    setComboIndex(0);
  }, []);

  // Animate coupon images: infinite smooth scroll, low speed
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
        {/* Show buttons only on desktop (lg and up) */}
        {!isMobileTablet && (
          <div
            className="group absolute left-0 text-xl md:text-3xl p-2 md:px-3 bg-white active:bg-yellow-200 transition-all duration-200 rounded-tl-2xl rounded-bl-3xl rounded-tr-3xl rounded-br-xl z-10"
            onClick={handleComboLeft}
            tabIndex={0}
            aria-label="Previous"
            role="button"
          >
            <TbArrowLoopLeft className="group-active:scale-95" />
          </div>
        )}
        <div className="combo w-full overflow-hidden flex gap-10 rounded-3xl min-h-0">
          <div
            ref={comboRef}
            className="flex gap-2 md:gap-10 will-change-transform touch-pan-x select-none"
            style={{
              cursor: isMobileTablet ? "grab" : undefined,
              WebkitOverflowScrolling: isMobileTablet ? "touch" : undefined,
            }}
          >
            {COMBO_IMAGES.map((src, i) => (
              <ComboImage key={src} src={src} alt={String(i + 1)} />
            ))}
          </div>
        </div>
        {/* Show buttons only on desktop (lg and up) */}
        {!isMobileTablet && (
          <div
            className="group absolute right-0 text-xl md:text-3xl p-2 md:px-3 bg-white active:bg-yellow-200 transition-all duration-200 rounded-tl-2xl rounded-bl-3xl rounded-tr-3xl rounded-br-xl z-10"
            onClick={handleComboRight}
            tabIndex={0}
            aria-label="Next"
            role="button"
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
