import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { GiLoincloth } from "react-icons/gi";
import { useRef, useState } from "react";

import Button from "../Button";
import VideoPreview from "../VideoPreview";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);

  const totalVideos = 4;
  const sovereignTextRef = useRef(null);
  const clothingTextRef = useRef(null);
  const pTagRef = useRef(null);
  const buttonRef = useRef(null);
  const nextVdRef = useRef(null);

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  // --- Text animation for SOVEREIGN and CLOTHING: both use createTextPrintingAnimation, no dots ---

  const createTextPrintingAnimation = (element, finalText, delay = 0) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const timeline = gsap.timeline({ delay });

    // Remove any initial text (no dots)
    element.textContent = "";

    finalText.split("").forEach((char, index) => {
      if (char === " ") return;
      const targetIndex = letters.indexOf(char);
      if (targetIndex === -1) return;

      for (let i = 0; i <= targetIndex; i++) {
        timeline.to(element, {
          duration: 0.05,
          ease: "none",
          onComplete: () => {
            const currentText = element.textContent.padEnd(finalText.length, " ");
            const newText = currentText.substring(0, index) + letters[i] + currentText.substring(index + 1);
            element.textContent = newText;
          }
        });
      }
      timeline.to({}, { duration: 0.1 });
    });
    return timeline;
  };

  const createWordByWordAnimation = (element, text, delay = 0) => {
    const words = text.split(" ");
    const timeline = gsap.timeline({ delay });
    element.textContent = "";
    words.forEach((word, index) => {
      timeline.to(element, {
        duration: 0.1,
        ease: "none",
        onComplete: () => {
          const currentText = element.textContent;
          element.textContent = currentText + (index > 0 ? " " : "") + word;
        }
      });
      timeline.to({}, { duration: 0.3 });
    });
    return timeline;
  };

  useGSAP(() => {
    if (hasClicked) {
      gsap.set("#next-video", { visibility: "visible" });
      gsap.to("#next-video", {
        transformOrigin: "center center",
        scale: 1,
        width: "100%",
        height: "100%",
        duration: 1,
        ease: "power1.inOut",
        onStart: () => nextVdRef.current && nextVdRef.current.play(),
      });
      gsap.from("#current-video", {
        transformOrigin: "center center",
        scale: 0,
        duration: 1.5,
        ease: "power1.inOut",
      });
    }
  }, {
    dependencies: [currentIndex],
    revertOnUpdate: true,
  });

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(10% 0%, 82% 0%, 86% 90%, 5% 80%)",
      borderRadius: "0, 0, 0, 0"
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  useGSAP(() => {
    if (
      sovereignTextRef.current &&
      clothingTextRef.current &&
      pTagRef.current &&
      buttonRef.current
    ) {
      gsap.set(buttonRef.current, { x: -200, opacity: 0 });
      // Remove dots for SOVEREIGN and CLOTHING, just clear text
      sovereignTextRef.current.textContent = "";
      clothingTextRef.current.textContent = "";
      pTagRef.current.textContent = "";
      const masterTimeline = gsap.timeline({ delay: 0.5 });
      // Use createTextPrintingAnimation for both SOVEREIGN and CLOTHING
      masterTimeline.add(createTextPrintingAnimation(sovereignTextRef.current, "SOVEREIGN"), 0);
      masterTimeline.add(createTextPrintingAnimation(clothingTextRef.current, "CLOTHING"), 0.9);
      // For pTagRef, do NOT use dots, just animate the text in
      masterTimeline.add(createWordByWordAnimation(pTagRef.current, "Where modern trends meet classic craftsmanship"), 0);
      masterTimeline.to(
        buttonRef.current,
        {
          x: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        },
        2
      );
    }
  }, []);

  // --- FIX: Use Vite's /public folder for video assets ---
  // In Vite, static assets in the public folder are served from the root ("/").
  // So, reference videos as "/videos/hero-1.mp4" (with a leading slash).
  // Do NOT use import.meta.env.BASE_URL for public assets, just use "/videos/hero-1.mp4".
  // This avoids ERR_CACHE_OPERATION_NOT_SUPPORTED and works in dev/prod.

  const getVideoSrc = (index) => {
    return `/videos/hero-${index}.mp4`;
  };

  // Responsive: always show minivideo player in small size on mobile/tablet
  // We'll use Tailwind's responsive classes to always show the minivideo player in small size on mobile/tablet,
  // and only allow the hover/scale-up effect on large screens (lg: and up).
  // We'll also ensure the minivideo player is always visible (opacity-100, scale-100) on mobile/tablet.

  return (
    <div id="home" className="relative h-dvh w-full overflow-x-hidden">
      <img src="/comboImg/offerbg.webp" alt="offerBg" className="absolute top-0 left-0 w-full h-full object-cover opacity-5 z-[-10]" />
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75 "
      >
        <div>
          {/* Responsive minivideoplayer: always visible and small on mobile/tablet, hover/scale on desktop */}
          <div className="mask-clip-path absolute-center absolute z-50 size-40 sm:size-48 md:size-56 lg:size-64 overflow-hidden rounded-full">
            <VideoPreview>
              <div
                onClick={handleMiniVdClick}
                className={`
                  origin-center
                  scale-100 opacity-100
                  transition-all duration-500 ease-in
                  rounded-full overflow-hidden
                  cursor-pointer
                  lg:scale-50 lg:opacity-0
                  lg:hover:scale-100 lg:hover:opacity-100
                `}
              >
                <video
                  ref={nextVdRef}
                  src={getVideoSrc((currentIndex % totalVideos) + 1)}
                  loop
                  muted
                  id="current-video"
                  className="size-40 sm:size-48 md:size-56 lg:size-64 origin-center scale-150 object-cover object-center rounded-full"
                />
              </div>
            </VideoPreview>
          </div>

          <video
            ref={nextVdRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-40 sm:size-48 md:size-56 lg:size-64 object-cover object-center"
          />
          <video
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
          />
        </div>

        <h1 className="special-font hero-heading absolute bottom-10 right-10 z-40 text-blue-75">
          <p ref={clothingTextRef}>CLOTHIN<b>G</b></p>
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          {/* Move the text and button further down by increasing mt-24 to mt-40 (or adjust as needed) */}
          <div className="mt-40 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              <p ref={sovereignTextRef}>SOVEREIGN</p>
            </h1>

            {/* Add extra margin-top to pTagRef and the button for more spacing */}
            <p
              ref={pTagRef}
              className="mb-5 max-w-64 font-Verve-regular md:text-2xl text-[#E1A81E] mt-8"
            >
              Where modern trends meet classic craftsmanship
            </p>

            <div ref={buttonRef} className="mt-6">
              <Button
                id="watch-trailer"
                title="Shop Now"
                leftIcon={<GiLoincloth />}
                containerClass="flex-center gap-1 bg-white hover:bg-[#E1A81E]"
              />
            </div>
          </div>
        </div>
      </div>

      <h1 className="special-font hero-heading absolute bottom-10 right-10 text-black">
        CLOTHIN<b>G</b>
      </h1>
    </div>
  );
};

export default Home;
