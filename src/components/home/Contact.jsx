import React, { useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "../pages/customs/Button";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
  FaEnvelope,
} from "react-icons/fa6";

gsap.registerPlugin(ScrollTrigger);

const IMAGE_DATA = [
  {
    src: "/contactImg/contact1.webp",
    clipClass: "contact-clip-path-1",
    containerClass:
      "absolute -left-20 opacity-0 md:opacity-100 top-0 h-full w-72 overflow-hidden lg:left-20 lg:w-96",
  },
  {
    src: "/contactImg/contact2.webp",
    clipClass:
      "contact-clip-path-2 lg:translate-y-40 translate-y-60 overflow-hidden",
    containerClass: null,
  },
  {
    src: "/contactImg/bb2.webp",
    clipClass: "victor-clip-path md:scale-125",
    containerClass:
      "absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80",
  },
];

const ImageClipBox = React.forwardRef(({ src, clipClass }, ref) => (
  <div ref={ref}>
    <div className={clipClass}>
      <img src={src} alt="" />
    </div>
  </div>
));

const SOCIALS = [
  {
    href: "https://instagram.com/",
    label: "Instagram",
    icon: <FaInstagram size={20} />,
  },
  {
    href: "https://facebook.com/",
    label: "Facebook",
    icon: <FaFacebookF size={20} />,
  },
  {
    href: "https://x.com/",
    label: "X",
    icon: <FaXTwitter size={20} />,
  },
  {
    href: "https://youtube.com/",
    label: "YouTube",
    icon: <FaYoutube size={20} />,
  },
];

const SocialButton = React.forwardRef(({ href, label, icon }, ref) => (
  <a
    ref={ref}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={`
      transition-colors duration-200
      rounded-full w-12 h-12 flex items-center justify-center shadow-lg
      bg-white/80 text-[#121212]
      hover:bg-[#E49906] hover:text-white
      cursor-pointer
      text-xs sm:text-sm md:text-base lg:text-lg
      font-medium
      transform
      hover:scale-105 active:scale-95
      focus:outline-none focus:ring-2 focus:ring-[#E49906] focus:ring-offset-2
    `}
    style={{
      transition: "background 0.2s, color 0.2s, transform 0.15s",
      willChange: "transform, opacity", // Hint browser for smoother transform/opacity
    }}
    tabIndex={0}
  >
    {icon}
  </a>
));

const Contact = () => {
  const containerRef = useRef(null);
  const imageRefs = useRef([null, null, null]);
  const socialRefs = useRef([null, null, null, null]);
  const lastScrollY = useRef(
    typeof window !== "undefined" ? window.scrollY : 0
  );
  const [socialsIn, setSocialsIn] = useState(false);

  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);

  // --- Remove Animated Heading ---
  // const headingRef = useRef(null);

  // Remove heading animation effect

  const handleMouseMove = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltX = ((y - rect.height / 2) / rect.height) * 2;
    const tiltY = ((rect.width / 2 - x) / rect.width) * 2;
    const targets = imageRefs.current.filter(Boolean);
    if (targets.length) {
      gsap.to(targets, {
        duration: 0.3,
        rotationX: tiltX * 15,
        rotationY: tiltY * 15,
        transformPerspective: 1000,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const targets = imageRefs.current.filter(Boolean);
    if (targets.length) {
      gsap.to(targets, {
        duration: 0.5,
        rotationX: 0,
        rotationY: 0,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, []);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave, {
      passive: true,
    });
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Socials animation: from right, one by one, on scroll to bottom, reverse on scroll up
  React.useEffect(() => {
    // Set initial state: all off to right, opacity 0, but with smooth transition
    SOCIALS.forEach((_, i) => {
      const ref = socialRefs.current[i];
      if (ref) {
        gsap.set(ref, {
          x: 120,
          opacity: 0,
          clearProps: "transition", // Remove any inline transition to avoid jump
        });
        ref.__animated = false;
      }
    });

    let ticking = false;

    // Use a custom ease and longer duration for smoother movement
    const animateIn = () => {
      SOCIALS.forEach((_, i) => {
        const ref = socialRefs.current[i];
        if (ref) {
          gsap.to(ref, {
            x: 0,
            opacity: 1,
            duration: 0.85, // slightly longer for smoothness
            delay: 0.14 * i,
            ease: "power2.out", // softer ease
            overwrite: "auto",
            onStart: () => {
              // GSAP pop animation (scale) on appear, mimicking the CSS keyframes
              gsap.fromTo(
                ref,
                { scale: 0.95 },
                {
                  scale: 1,
                  duration: 0.5,
                  ease: "cubic-bezier(.4,2,.6,1)",
                  overwrite: "auto",
                  onUpdate: () => {},
                  onComplete: () => {},
                }
              );
            },
          });
          ref.__animated = true;
        }
      });
    };

    const animateOut = () => {
      SOCIALS.forEach((_, i) => {
        const ref = socialRefs.current[i];
        if (ref) {
          gsap.to(ref, {
            x: 120,
            opacity: 0,
            duration: 0.55, // slightly longer for smoothness
            delay: 0.09 * (SOCIALS.length - 1 - i),
            ease: "power2.in",
            overwrite: "auto",
            onStart: () => {
              // Animate scale down a bit as it leaves
              gsap.to(ref, {
                scale: 0.95,
                duration: 0.3,
                ease: "power2.in",
                overwrite: "auto",
              });
            },
            onComplete: () => {
              // Reset scale after hiding
              gsap.set(ref, { scale: 1 });
            },
          });
          ref.__animated = false;
        }
      });
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const scrollY = window.scrollY;

      // Determine scroll direction
      let direction = null;
      if (scrollY > lastScrollY.current) {
        direction = "down";
      } else if (scrollY < lastScrollY.current) {
        direction = "up";
      }
      lastScrollY.current = scrollY;

      // When bottom of container is in view and scrolling down, animate in
      if (
        rect.bottom - 100 < windowHeight &&
        rect.top < windowHeight &&
        direction === "down"
      ) {
        if (!socialRefs.current[0]?.__animated) {
          animateIn();
        }
      }
      // When scrolling up and container is not at bottom, animate out
      // CHANGE: Increase the threshold so socials hide a little bit more up (e.g. -60 -> +60)
      if (
        (rect.bottom - 260 > windowHeight || rect.top > windowHeight) &&
        direction === "up"
      ) {
        if (socialRefs.current[0]?.__animated) {
          animateOut();
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
      setEmailStatus("Please enter a valid email address.");
      return;
    }
    setEmailStatus("Thank you! We'll be in touch soon.");
    setEmail("");
    setTimeout(() => setEmailStatus(null), 3000);
  };

  return (
    <div
      id="contact"
      className="relative h-auto w-screen px-10 pt-20 md:pt-0 overflow-x-hidden"
    >
      <img
        src="/contactImg/contact_bg.webp"
        alt="appBg"
        className="absolute top-0 left-0 w-full h-full object-cover z-[-15]"
      />
      <img
        src="/comboImg/offerbg.webp"
        alt="offerBg"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-[0.02] z-[-10]"
      />
      <div
        ref={containerRef}
        className="relative rounded-lg py-24 text-blue-50 sm:overflow-hidden"
      >
        {/* Left images */}
        <div className={IMAGE_DATA[0].containerClass}>
          <ImageClipBox
            ref={(el) => (imageRefs.current[0] = el)}
            src={IMAGE_DATA[0].src}
            clipClass={IMAGE_DATA[0].clipClass}
          />
          <ImageClipBox
            ref={(el) => (imageRefs.current[1] = el)}
            src={IMAGE_DATA[1].src}
            clipClass={IMAGE_DATA[1].clipClass}
          />
        </div>
        {/* Right/top image */}
        <div className={IMAGE_DATA[2].containerClass}>
          <ImageClipBox
            ref={(el) => (imageRefs.current[2] = el)}
            src={IMAGE_DATA[2].src}
            clipClass={IMAGE_DATA[2].clipClass}
          />
        </div>
        {/* Content */}
        <div className="flex flex-col items-center text-center pb-32">
          <p className="mb-10 font-squid text-xs sm:text-sm md:text-base lg:text-lg uppercase">
            Let’s connect
          </p>
          <h1
            // ref={headingRef}
            className="text-3xl md:text-7xl font-bold font-saintCarell z-10"
            // style={{ willChange: "transform, opacity" }}
          >
            Reach out to us <br /> we’re here to help <br /> you look your best
          </h1>

          <button className="cursor-pointer relative bg-white/10 py-2 rounded-full min-w-[8.5rem] min-h-[2.92rem] group max-w-full flex items-center justify-start hover:bg-yellow-400 transition-all duration-[0.8s] ease-[cubic-bezier(0.510,0.026,0.368,1.016)] shadow-[inset_1px_2px_5px_#00000080]">
            <div className="absolute flex px-1 py-0.5 justify-start items-center inset-0">
              <div className="w-[0%] group-hover:w-full transition-all duration-[1s] ease-[cubic-bezier(0.510,0.026,0.368,1.016)]"></div>
              <div className="rounded-full shrink-0 flex justify-center items-center shadow-[inset_1px_-1px_3px_0_black] h-full aspect-square bg-yellow-400 transition-all duration-[1s] ease-[cubic-bezier(0.510,0.026,0.368,1.016)] group-hover:bg-black">
                <div className="size-[0.8rem] text-black group-hover:text-white group-hover:-rotate-45 transition-all duration-[1s] ease-[cubic-bezier(0.510,0.026,0.368,1.016)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 16"
                    height="100%"
                    width="100%"
                  >
                    <path
                      fill="currentColor"
                      d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="pl-[3.4rem] pr-[1.1rem] group-hover:pl-[1.1rem] font-squid group-hover:pr-[3.4rem] transition-all duration-[1s] ease-[cubic-bezier(0.510,0.026,0.368,1.016)] group-hover:text-black text-white">
              CONTACT US
            </div>
          </button>
        </div>
        {/* Email section before social media buttons */}
        <form
          onSubmit={handleEmailSubmit}
          className="
            absolute left-1/2 -translate-x-1/2 bottom-28
            flex flex-col items-center z-20
            w-[90vw] max-w-xs sm:max-w-sm md:max-w-md
            px-2 sm:px-0
          "
          autoComplete="off"
        >
          <div className="
            flex w-full bg-white/80 rounded-full shadow-lg overflow-hidden mb-10
            flex-row
            "
          >
            <span className="flex items-center px-2 sm:px-3 text-[#121212]">
              <FaEnvelope size={18} />
            </span>
            <input
              type="email"
              className="
                flex-1 px-2 sm:px-3 py-2 sm:py-3 bg-transparent outline-none
                text-[#121212] font-LEMONMILK
                text-xs xs:text-sm sm:text-base
                min-w-0
              "
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email address"
            />
            <button
              type="submit"
              className="
                bg-[#E49906] hover:bg-[#c17d04] text-white
                px-3 sm:px-5 py-2
                text-xs xs:text-sm sm:text-base
                font-medium font-LEMONMILK
                transition-colors duration-200
                whitespace-nowrap
              "
            >
              Send
            </button>
          </div>
          {emailStatus && (
            <span className="mt-2 text-xs sm:text-sm text-[#121212] bg-white/80 rounded px-2 py-1">
              {emailStatus}
            </span>
          )}
        </form>
        {/* Social icons at bottom center */}
        <div className="absolute left-1/2 mb-8 -translate-x-1/2 flex gap-4 z-20 bottom-8">
          {SOCIALS.map(({ href, label, icon }, idx) => (
            <SocialButton
              key={label}
              href={href}
              label={label}
              icon={icon}
              ref={(el) => (socialRefs.current[idx] = el)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
