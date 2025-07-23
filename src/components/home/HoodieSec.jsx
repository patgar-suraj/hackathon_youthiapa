import gsap from "gsap";
import { useRef, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "../pages/customs/Button";

gsap.registerPlugin(ScrollTrigger);

const HoodieSec = () => {
  const frameRef = useRef(null);
  const titleRef = useRef(null);

  // Mouse tilt effect (desktop only)
  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return; // Disable on mobile/tablet
    const { clientX, clientY } = e;
    const element = frameRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((yPos - centerY) / centerY) * -10;
    const rotateY = ((xPos - centerX) / centerX) * 10;
    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 500,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = () => {
    const element = frameRef.current;
    if (element) {
      gsap.to(element, {
        duration: 0.3,
        rotateX: 0,
        rotateY: 0,
        ease: "power1.inOut",
      });
    }
  };

  // Animate the h1: from bottom to top, fade in on scroll, DO NOT fade out on scroll up or down
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 80 });
    const anim = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        scrub: true,
        toggleActions: "play none none none",
      },
    });
    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div
      id="hoodie"
      className="relative h-auto w-full text-blue-50 py-6"
    >
      <img
        src="/hoodieimg/hoodiebg.webp"
        alt="appBg"
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ zIndex: 0 }}
      />
      <div className="relative flex flex-col items-center justify-center w-full h-full min-h-[60vh] px-2 sm:px-6 md:px-12 py-6 sm:py-10 pb-16 sm:pb-24 z-10">
        <div className="relative flex flex-col items-center w-full h-full">
          <h1
            ref={titleRef}
            className="
              mt-5
              pointer-events-none
              mix-blend-difference
              text-2xl
              xs:text-3xl
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
              xl:text-7xl
              relative
              z-10
              text-center
              font-saintCarell
              leading-tight
              px-2
              text-[#332E2A]
            "
            style={{ opacity: 0, transform: "translateY(80px)" }}
          >
            Wrap yourself in comfort <br /> premium hoodies for every mood.
          </h1>

          {/* Responsive image with animation */}
          <div className="flex justify-center items-center w-full mt-6 sm:mt-10">
            <img
              ref={frameRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseLeave}
              onMouseEnter={handleMouseLeave}
              src="/hoodieimg/hoodie.webp"
              alt="entrance.webp"
              className="
                mx-auto
                rounded-2xl
                shadow-lg
                z-10
                block
                w-[80vw]
                max-w-xs
                xs:max-w-sm
                sm:max-w-md
                md:max-w-lg
                lg:max-w-xl
                xl:max-w-2xl
                h-auto
                max-h-[40vh]
                sm:max-h-[50vh]
                md:max-h-[60vh]
                object-contain
                bg-zinc-900
              "
              style={{
                background: "#18181b",
                userSelect: "none",
                touchAction: "manipulation",
              }}
              draggable={false}
            />
          </div>
        </div>

        {/* Responsive Button Placement */}
        <div
          className="
            flex
            w-full
            justify-center
            mt-8
            sm:mt-10
            md:justify-end
            md:mt-0
            md:me-16
            lg:me-32
            xl:me-44
            relative
            z-20
          "
        >
        </div>
          <div className="flex h-full w-fit flex-col md:mt-10 items-center justify-center md:items-start">
            <Button
              id="realm-btn"
              title="Explore Hoodies"
              containerClass="mt-5 hover:bg-[#E7A103] w-full max-w-xs sm:max-w-sm"
            />
          </div>
      </div>
    </div>
  );
};

export default HoodieSec;
