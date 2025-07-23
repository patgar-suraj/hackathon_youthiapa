import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const lookRef = useRef(null);
  const exclusiveRef = useRef(null);
  const maskClipRef = useRef(null);

  useLayoutEffect(() => {
    let clipTimeline = null;

    // Always run ScrollTrigger-based animation on all devices (mobile, tablet, desktop)
    if (maskClipRef.current) {
      // Set initial state for animation
      // Set initial state for animation, width 50vw on laptop view (min-width: 1024px), else 80vw
      const isLaptop = window.matchMedia("(min-width: 1024px)").matches;
      gsap.set(maskClipRef.current, {
        width: isLaptop ? "30vw" : "80vw",
        height: isLaptop ? "30vw" : "100vw",
        borderRadius: "32px",
        overwrite: "auto",
      });

      clipTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#clip",
          start: "top top",
          end: "+=800 center",
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
        },
      });

      clipTimeline.to(maskClipRef.current, {
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
        overwrite: "auto",
        ease: "power1.inOut",
      });
    }

    // Fade in/out for subtext p tags (works on all devices)
    const fadeLines = gsap.utils.toArray(".fadeLine");
    fadeLines.forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            end: "top 30%",
            toggleActions: "play reverse play reverse",
          },
          overwrite: "auto",
        }
      );
    });

    // Animate the heading: "Look" first, then "Exclusive->" with bounce
    // Now scroll-based in and out (not just once)
    if (lookRef.current && exclusiveRef.current) {
      // Set initial state
      gsap.set(lookRef.current, { x: -120, opacity: 0 });
      gsap.set(exclusiveRef.current, { x: -120, opacity: 0 });

      // Timeline for heading animation, scroll-based in and out
      const headingTl = gsap.timeline({
        defaults: { overwrite: "auto" },
        scrollTrigger: {
          trigger: lookRef.current,
          start: "top 70%",
          end: "+=500 70%",
          toggleActions: "play reverse play reverse",
        },
      });

      headingTl
        .to(
          lookRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          0
        )
        .to(
          exclusiveRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "bounce.out",
          },
          "+=0.2"
        );
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (clipTimeline) clipTimeline.kill();
      gsap.killTweensOf(fadeLines);
      gsap.killTweensOf(lookRef.current);
      gsap.killTweensOf(exclusiveRef.current);
      gsap.killTweensOf(maskClipRef.current);
    };
  }, []);

  return (
    <section id="about" className="relative min-h-screen w-screen">
      <img src="/aboutimg/aboutbg.webp" alt="" className="absolute top-0 left-0 w-full h-full object-cover" />
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="welcomeTage font-fright text-sm text-[#B5894A] uppercase md:text-[20px] mt-14 tracking-widest">
          A new chapter
        </p>

        {/* 
          Animated heading: "Look" comes first, then "Exclusive->" with bounce
        */}
        <h2 className="!text-[#121212] text-center p-10 text-2xl sm:text-4xl md:text-6xl font-bold flex flex-wrap justify-center items-center gap-2">
          <p
            ref={exclusiveRef}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
            className="exclusive-text font-saintCarell text-3xl md:text-5xl lg:text-7xl"
          >
            EXCLUSIVE-&gt;
          </p>
          <p
            ref={lookRef}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
            className="look-text font-saintCarell text-3xl md:text-5xl lg:text-7xl"
          >
            LOOK
          </p>
        </h2>

        <div className="about-subtext">
          <p className="text-[#2C2C2C]">
            We’re built on respect, responsibility, and resilience.
          </p>
          <p className="fadeLine text-[#F5F5F5]">
            So when you wear Raised Right, you're repping more than style—you're repping values that matter.
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen overflow-x-hidden" id="clip">
        <div
          ref={maskClipRef}
          className="mask-clip-path about-video"
          style={{
            // fallback for mobile: initial state for animation
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src="/aboutimg/bb.webp"
            className="absolute left-0 top-0 size-full object-cover"
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

export default About;
