import { useRef, useEffect, useState, useCallback, memo } from "react";
import { BiSolidDiscount } from "react-icons/bi";
import { TbArrowLoopLeft, TbArrowIteration } from "react-icons/tb";
import gsap from "gsap";
import { MAIN_IMAGES, COMBO_IMAGES, COUPON_IMAGES } from "./OfferData";

// Memoized ComboImage for performance
const ComboImage = memo(({ src, alt }) => {
  const imgRef = useRef(null);

  // Memoize handlers to avoid recreation
  const handleMouseEnter = useCallback(() => {
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
      className="w-1/4 rounded-3xl min-w-0 flex-shrink-0 object-cover block will-change-transform"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      loading="lazy"
      draggable={false}
    />
  );
});
ComboImage.displayName = "ComboImage";

const Offer = () => {
  // Main images carousel (swipe after 2 seconds infinitely)
  const mainRef = useRef(null);
  const [mainIndex, setMainIndex] = useState(0);

  // Combo images carousel
  const comboRef = useRef(null);
  const [comboIndex, setComboIndex] = useState(0);

  // Coupon scroll
  const couponRef = useRef(null);

  // Helper to get offset for carousels
  const getOffset = (el, gap) => {
    const child = el?.children[0];
    return child ? child.offsetWidth + gap : 0;
  };

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

  // Animate combo images: swipe left/right on button click, smooth
  const handleComboLeft = useCallback(() => {
    if (!comboRef.current) return;
    setComboIndex((prev) => {
      const next = prev <= 0 ? 0 : prev - 1;
      const offset = getOffset(comboRef.current, 40);
      gsap.to(comboRef.current, {
        x: -next * offset,
        duration: 0.7,
        ease: "power2.inOut",
      });
      return next;
    });
  }, []);

  const handleComboRight = useCallback(() => {
    if (!comboRef.current) return;
    setComboIndex((prev) => {
      // Show max 4 images at a time, so max index = images.length - 4
      const max = COMBO_IMAGES.length - 3;
      const next = prev >= max ? max : prev + 1;
      const offset = getOffset(comboRef.current, 40);
      gsap.to(comboRef.current, {
        x: -next * offset,
        duration: 0.7,
        ease: "power2.inOut",
      });
      return next;
    });
  }, []);

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
    <div id="offer" className="w-screen h-auto p-10 overflow-hidden">
      {/* Main images carousel */}
      <div className="main flex gap-10 w-full overflow-hidden min-h-0">
        <div
          ref={mainRef}
          className="flex gap-10 w-full will-change-transform"
        >
          {MAIN_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`main${i + 2}`}
              className="rounded-3xl min-w-0 w-auto flex-shrink-0 object-cover block"
              loading="lazy"
              draggable={false}
            />
          ))}
        </div>
      </div>

      {/* Centered Super Saving Combos and Loved by Peoples */}
      <div className="w-full flex flex-col items-center justify-center m-10">
        <div className="w-full flex flex-col items-center justify-center">
          <h1
            className="font-bold font-general mb-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center w-full flex items-center justify-center"
          >
            Super Saving Combos
          </h1>
          <span
            className="font-robert-medium text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center w-full flex items-center justify-center"
          >
            Loved by People
          </span>
        </div>
      </div>

      {/* Combo images carousel */}
      <div className="relative w-full flex items-center justify-center px-10 md:px-20">
        <div
          className="absolute left-0 text-xl md:text-3xl p-2 md:px-3 bg-white rounded-tl-2xl rounded-bl-3xl rounded-tr-3xl rounded-br-xl z-10"
          onClick={handleComboLeft}
          tabIndex={0}
          aria-label="Previous"
          role="button"
        >
          <TbArrowLoopLeft />
        </div>
        <div className="combo w-full overflow-hidden flex gap-10 rounded-3xl min-h-0">
          <div
            ref={comboRef}
            className="flex gap-8 md:gap-10 will-change-transform"
          >
            {COMBO_IMAGES.map((src, i) => (
              <ComboImage key={src} src={src} alt={String(i + 1)} />
            ))}
          </div>
        </div>
        <div
          className="absolute right-0 text-xl md:text-3xl p-2 md:px-3 bg-white rounded-tl-2xl rounded-bl-3xl rounded-tr-3xl rounded-br-xl z-10"
          onClick={handleComboRight}
          tabIndex={0}
          aria-label="Next"
          role="button"
        >
          <TbArrowIteration />
        </div>
      </div>

      {/* Coupon infinite scroll */}
      <div className="w-full flex items-center justify-center mt-10 gap-2 md:gap-10 bg-[#212121] p-2 md:p-3 rounded-xl">
        <div>
          <h2 className="text-sm md:text-xl md:font-bold font-robert-medium text-white">
            <BiSolidDiscount />
            SPECIAL <br />
            COUPON <br />
            CORNER
          </h2>
        </div>
        <div className="coupon flex bg-white rounded-xl p-3 overflow-hidden gap-5 min-w-0 relative">
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
                loading="lazy"
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
