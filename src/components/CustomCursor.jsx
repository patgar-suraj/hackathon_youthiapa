import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Utility to detect touch devices or small screens
const isMobileOrTablet = () => {
  if (typeof window === "undefined") return false;
  // Check for touch events or small screen width
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth < 768
  );
};

const CustomCursor = () => {
  const [showCursor, setShowCursor] = useState(() => !isMobileOrTablet());
  const cursorRef = useRef(null);
  const cursorFollowerRef = useRef(null);

  // Update on resize/orientation change
  useEffect(() => {
    const handleResize = () => {
      setShowCursor(!isMobileOrTablet());
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Custom cursor effect (desktop only)
  useEffect(() => {
    if (!showCursor) {
      document.body.style.cursor = "";
      return;
    }

    const cursor = cursorRef.current;
    const follower = cursorFollowerRef.current;
    if (!cursor || !follower) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      gsap.set(follower, {
        x: followerX,
        y: followerY,
      });
      requestAnimationFrame(animateFollower);
    };

    document.addEventListener("mousemove", moveCursor);
    animateFollower();

    // Hide cursor on mouse leave
    const handleMouseLeave = () => {
      gsap.to([cursor, follower], { opacity: 0, duration: 0.2 });
    };
    const handleMouseEnter = () => {
      gsap.to([cursor, follower], { opacity: 1, duration: 0.2 });
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Hide system cursor
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.body.style.cursor = "";
    };
  }, [showCursor]);

  if (!showCursor) return null;

  return (
    <div>
      {/* Custom Cursor */}
      <div>
        <div
          ref={cursorFollowerRef}
          className="custom-cursor-follower pointer-events-none fixed left-0 top-0 z-[9999]"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "2px solid #E1A81E",
            background: "rgba(225,168,30,0.08)",
            position: "fixed",
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            transition: "background 0.2s, border 0.2s",
            mixBlendMode: "exclusion",
            willChange: "transform, background, border",
            opacity: 1,
          }}
        ></div>
        <div
          ref={cursorRef}
          className="custom-cursor pointer-events-none fixed left-0 top-0 z-[10000]"
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#E1A81E",
            boxShadow: "0 0 8px 2px #E1A81E55",
            position: "fixed",
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            transition: "background 0.2s, transform 0.1s",
            willChange: "transform, background",
            opacity: 1,
          }}
        ></div>
        <style>{`
          .custom-cursor--pointer {
            background: #fff !important;
            box-shadow: 0 0 12px 2px #E1A81E99;
            transform: translate(-50%, -50%) scale(1.7) !important;
          }
          .custom-cursor-follower--pointer {
            border: 2px solid #fff !important;
            background: rgba(255,255,255,0.12) !important;
            transform: translate(-50%, -50%) scale(1.2) !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default CustomCursor;
