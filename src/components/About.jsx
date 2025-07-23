import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGES = [
  {
    src: "/aboutImg/model1.webp",
    alt: "Model in streetwear",
    className:
      "absolute left-0 top-1/2 -translate-y-1/2 w-32 sm:w-44 lg:w-56 rounded-3xl shadow-xl z-10 about-hero-img1",
    style: { zIndex: 2 },
  },
  {
    src: "/aboutImg/model2.webp",
    alt: "Model in hoodie",
    className:
      "absolute right-0 top-1/3 w-28 sm:w-40 lg:w-52 rounded-2xl shadow-lg z-20 about-hero-img2",
    style: { zIndex: 3 },
  },
  {
    src: "/aboutImg/model3.webp",
    alt: "Model in cap",
    className:
      "absolute left-1/2 top-0 -translate-x-1/2 w-36 sm:w-52 lg:w-64 rounded-full shadow-2xl z-30 about-hero-img3",
    style: { zIndex: 4 },
  },
];

const About = () => {
  const headlineRef = useRef(null);
  const storyRef = useRef(null);
  const founderRef = useRef(null);
  const heroRef = useRef(null);
  const scribbleRef = useRef(null);

  useEffect(() => {
    // Headline fade-in
    gsap.fromTo(
      headlineRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 80%",
        },
      }
    );
    // Story paragraph fade-in
    gsap.fromTo(
      storyRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 85%",
        },
      }
    );
    // Founder note slide-in
    gsap.fromTo(
      founderRef.current,
      { opacity: 0, x: 60 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: founderRef.current,
          start: "top 90%",
        },
      }
    );
    // Hero image parallax/slide-in
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 85%",
        },
      }
    );
    // Scribble doodle pop-in
    if (scribbleRef.current) {
      gsap.fromTo(
        scribbleRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          delay: 0.5,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: scribbleRef.current,
            start: "top 90%",
          },
        }
      );
    }
  }, []);

  return (
    <section
      className="relative min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e0e7ef] overflow-x-clip flex items-center justify-center px-2 sm:px-0"
      style={{
        fontFamily: "var(--font-sans, 'Inter', 'Montserrat', 'Arial', sans-serif)",
      }}
    >
      {/* Optional looping video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        autoPlay
        loop
        muted
        playsInline
        poster="/aboutImg/bg-fallback.jpg"
      >
        <source src="/aboutImg/about-bg-loop.mp4" type="video/mp4" />
      </video>

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "url('/aboutImg/pattern-dots.svg'), linear-gradient(135deg,rgba(255,255,255,0.7) 0%,rgba(224,231,239,0.5) 100%)",
          backgroundRepeat: "repeat",
          opacity: 0.18,
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center py-24 sm:py-32 px-4 sm:px-8">
        {/* Decorative scribble */}
        <div
          ref={scribbleRef}
          className="absolute left-4 top-8 sm:left-12 sm:top-10 z-20"
        >
          <svg
            width="70"
            height="32"
            viewBox="0 0 70 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-yellow-400"
          >
            <path
              d="M2 30C10 10 30 2 68 10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="6 8"
            />
          </svg>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl font-extrabold font-saintCarell tracking-tight text-[#121212] text-center mb-6 relative"
          style={{
            // fontFamily: "var(--font-display, 'Montserrat', 'Inter', sans-serif)",
            letterSpacing: "-0.03em",
          }}
        >
          Who We Are
          <span className="block w-16 h-2 bg-yellow-400 rounded-full mt-3 mx-auto" />
        </h1>

        {/* Story */}
        <p
          ref={storyRef}
          className="max-w-2xl text-lg sm:text-2xl text-[#222] font-fright font-medium text-center mb-10 leading-relaxed"
        >
          Youthiapa is a youth‑centric apparel and lifestyle brand founded in 2017 by digital creator Bhuvan Bam, along with partners Rohit Raj and Arvin Bhandari. What began as merchandise for BB Ki Vines evolved into Youthiapa 2.0 (launched January 2021), a full-fledged streetwear line, and continues to grow with new collections like “Raised Right.”
        </p>

        {/* Hero image collage */}
        <div
          ref={heroRef}
          className="relative w-full max-w-3xl h-64 sm:h-80 lg:h-96 mb-12 flex items-center justify-center"
        >
          {/* Decorative shapes */}
          <div className="absolute left-1/4 top-1/4 w-24 h-24 bg-yellow-200 rounded-full opacity-60 blur-2xl z-0" />
          <div className="absolute right-1/4 bottom-0 w-20 h-20 bg-blue-200 rounded-full opacity-40 blur-xl z-0" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-dashed border-yellow-400 rounded-full opacity-60 z-0" />

          {/* Collage images */}
          {HERO_IMAGES.map((img, idx) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className={img.className + " transition-transform duration-500 hover:scale-105 hover:-rotate-2"}
              style={img.style}
              loading="lazy"
            />
          ))}
        </div>

        {/* Founder note */}
        <div
          ref={founderRef}
          className="max-w-xl mx-auto bg-white/80 rounded-2xl shadow-lg px-6 py-6 sm:py-8 flex flex-col items-center relative"
        >
          <span className="text-xl sm:text-2xl font-semibold text-[#222] mb-2 font-LEMONMILK">
            “Fashion is our language. We’re here to help you speak it loud.”
          </span>
          <div className="flex items-center mt-4">
            <span className="text-base text-[#444] font-bold font-LEMONMILK tracking-wide">
              — Bhuvan Bam
            </span>
          </div>
        </div>

        {/* Call to action button */}
        <a
          href="/products"
          className="mt-10 inline-block group relative"
          tabIndex={0}
          aria-label="Shop the collection"
          onMouseEnter={e => {
            gsap.to(e.currentTarget, { scale: 1.06, boxShadow: "0 8px 32px #eab30844", duration: 0.3, ease: "power2.out" });
          }}
          onMouseLeave={e => {
            gsap.to(e.currentTarget, { scale: 1, boxShadow: "0 2px 8px #eab30822", duration: 0.3, ease: "power2.in" });
          }}
        >
          <span
            className="bg-yellow-400 text-black font-bold text-lg px-8 py-3 rounded-full shadow-md transition-all duration-300 group-hover:bg-black group-hover:text-yellow-400 font-LEMONMILK"
            style={{
              letterSpacing: "0.04em",
              boxShadow: "0 2px 8px #eab30822",
            }}
          >
            Shop the Collection
          </span>
          {/* Doodle arrow */}
          <span className="absolute -right-10 top-1/2 -translate-y-1/2 hidden sm:block">
            <svg
              width="48"
              height="24"
              viewBox="0 0 48 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-yellow-400 group-hover:text-black transition-colors duration-300"
            >
              <path
                d="M2 12H44M44 12L36 4M44 12L36 20"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
};

export default About;