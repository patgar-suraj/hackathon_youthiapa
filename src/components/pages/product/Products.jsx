import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { PRODUCTS } from "../../data/ProductsData";
import { useNavigate, useLocation } from "react-router-dom";

// Optimized animation hook: only animates when refs are present and stable
const useAnimateFromRight = (refs, stagger = 0.18, distance = 60, triggerKey = "") => {
  useEffect(() => {
    if (!Array.isArray(refs) || refs.length === 0) return;

    // Reset all refs to initial state
    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.style.opacity = "0";
        ref.current.style.transform = `translateX(${distance}px)`;
        ref.current.style.transition = "none";
      }
    });

    // Force reflow to ensure transition will play
    void document.body.offsetHeight;

    refs.forEach((ref, i) => {
      if (ref.current) {
        ref.current.style.transition = `opacity 0.7s cubic-bezier(.4,0,.2,1) ${i * stagger}s, transform 0.7s cubic-bezier(.4,0,.2,1) ${i * stagger}s`;
      }
    });

    // Trigger animation after mount
    const timeout = setTimeout(() => {
      refs.forEach((ref) => {
        if (ref.current) {
          ref.current.style.opacity = "1";
          ref.current.style.transform = "translateX(0)";
        }
      });
    }, 120);

    // Clean up: reset to initial state if unmounting or re-triggering
    return () => {
      clearTimeout(timeout);
      refs.forEach((ref) => {
        if (ref.current) {
          ref.current.style.opacity = "0";
          ref.current.style.transform = `translateX(${distance}px)`;
          ref.current.style.transition = "none";
        }
      });
    };
  }, [refs, stagger, distance, triggerKey]);
};

// Helper to render a section for a gender
const ProductSection = React.memo(function ProductSection({ title, products, sectionIndex = 0, triggerKey }) {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  // Always create the correct number of refs for cards, and keep them stable across renders
  const cardRefs = useMemo(
    () => products.map(() => React.createRef()),
    [products.length] // Only re-create refs if products length changes
  );

  // Animate title, grid, and cards from right
  useEffect(() => {
    // Title animation
    if (titleRef.current) {
      titleRef.current.style.opacity = "0";
      titleRef.current.style.transform = "translateX(80px)";
      titleRef.current.style.transition = "none";
      void titleRef.current.offsetHeight;
      titleRef.current.style.transition = `opacity 0.7s cubic-bezier(.4,0,.2,1) ${sectionIndex * 0.45}s, transform 0.7s cubic-bezier(.4,0,.2,1) ${sectionIndex * 0.45}s`;
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.style.opacity = "1";
          titleRef.current.style.transform = "translateX(0)";
        }
      }, 180);
    }
    // Grid animation
    if (gridRef.current) {
      gridRef.current.style.opacity = "0";
      gridRef.current.style.transform = "translateX(60px)";
      gridRef.current.style.transition = "none";
      void gridRef.current.offsetHeight;
      gridRef.current.style.transition = `opacity 0.7s cubic-bezier(.4,0,.2,1) ${0.25 + sectionIndex * 0.45}s, transform 0.7s cubic-bezier(.4,0,.2,1) ${0.25 + sectionIndex * 0.45}s`;
      setTimeout(() => {
        if (gridRef.current) {
          gridRef.current.style.opacity = "1";
          gridRef.current.style.transform = "translateX(0)";
        }
      }, 320);
    }
    // Clean up: reset to initial state if unmounting or re-triggering
    return () => {
      if (titleRef.current) {
        titleRef.current.style.opacity = "0";
        titleRef.current.style.transform = "translateX(80px)";
        titleRef.current.style.transition = "none";
      }
      if (gridRef.current) {
        gridRef.current.style.opacity = "0";
        gridRef.current.style.transform = "translateX(60px)";
        gridRef.current.style.transition = "none";
      }
    };
  }, [sectionIndex, triggerKey, products.length]);

  useAnimateFromRight(cardRefs, 0.18, 40, triggerKey + products.length);

  // Handler to go to product details
  const handleProductClick = useCallback((id) => {
    navigate(`/productDetails/${id}`);
  }, [navigate]);

  return (
    <div className="mb-16">
      <h3
        ref={titleRef}
        className="font-Verve-regular text-2xl md:text-4xl font-bold text-blue-800 mb-6 text-center"
        style={{ willChange: "opacity, transform" }}
      >
        {title}
      </h3>
      <div
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        style={{ willChange: "opacity, transform" }}
      >
        {products.length === 0 ? (
          <div className="col-span-full text-center text-blue-700 opacity-70">
            No products found.
          </div>
        ) : (
          products.map((product, idx) => (
            <div
              key={product.id}
              ref={cardRefs[idx]}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
              style={{
                cursor: "none",
                willChange: "opacity, transform",
              }}
              onClick={() => handleProductClick(product.id)}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  handleProductClick(product.id);
                }
              }}
              role="button"
              aria-label={`View details for ${product.name}`}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  style={{ cursor: "none" }}
                />
                <span className="absolute top-3 left-3 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-full shadow text-blue-900 uppercase tracking-wide">
                  {product.tag}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex-1 flex flex-col justify-between p-5">
                <div>
                  <h3 className="font-semibold text-lg md:text-xl text-blue-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-yellow-700 font-LEMONMILK font-bold text-base md:text-lg mb-2">
                    {product.price}
                  </p>
                </div>
                <button
                  className="mt-2 w-full font-LEMONMILK py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-yellow-400 hover:text-blue-900 transition-colors duration-200 shadow"
                  style={{ cursor: "none" }}
                  tabIndex={-1}
                  // Prevent button click from bubbling to card navigation
                  onClick={e => e.stopPropagation()}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

const Products = React.memo(function Products() {
  // Only filter once, memoized by PRODUCTS reference
  const mensProducts = useMemo(() => PRODUCTS.filter((p) => p.gender === "men"), []);
  const womensProducts = useMemo(() => PRODUCTS.filter((p) => p.gender === "women"), []);

  // Refs for animating the main heading and subheading
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);

  // Use location.key to trigger animation every time this page is navigated to
  const location = useLocation();
  const triggerKey = location.key;

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.style.opacity = "0";
      headingRef.current.style.transform = "translateX(100px)";
      headingRef.current.style.transition = "none";
      void headingRef.current.offsetHeight;
      headingRef.current.style.transition = "opacity 0.8s cubic-bezier(.4,0,.2,1) 0.2s, transform 0.8s cubic-bezier(.4,0,.2,1) 0.2s";
      setTimeout(() => {
        if (headingRef.current) {
          headingRef.current.style.opacity = "1";
          headingRef.current.style.transform = "translateX(0)";
        }
      }, 220);
    }
    if (subheadingRef.current) {
      subheadingRef.current.style.opacity = "0";
      subheadingRef.current.style.transform = "translateX(80px)";
      subheadingRef.current.style.transition = "none";
      void subheadingRef.current.offsetHeight;
      subheadingRef.current.style.transition = "opacity 0.8s cubic-bezier(.4,0,.2,1) 0.5s, transform 0.8s cubic-bezier(.4,0,.2,1) 0.5s";
      setTimeout(() => {
        if (subheadingRef.current) {
          subheadingRef.current.style.opacity = "1";
          subheadingRef.current.style.transform = "translateX(0)";
        }
      }, 500);
    }
    // Clean up: reset to initial state if unmounting or re-triggering
    return () => {
      if (headingRef.current) {
        headingRef.current.style.opacity = "0";
        headingRef.current.style.transform = "translateX(100px)";
        headingRef.current.style.transition = "none";
      }
      if (subheadingRef.current) {
        subheadingRef.current.style.opacity = "0";
        subheadingRef.current.style.transform = "translateX(80px)";
        subheadingRef.current.style.transition = "none";
      }
    };
  }, [triggerKey]);

  return (
    <section
      id="products"
      className="relative w-full min-h-screen mt-20 py-16 px-4 md:px-16 overflow-x-hidden"
      style={{ cursor: "none" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2
            ref={headingRef}
            className="font-Verve-regular text-3xl md:text-5xl font-bold text-blue-900 tracking-tight mb-2"
            style={{ willChange: "opacity, transform" }}
          >
            ⨼Explore Our Collection⨽
          </h2>
          <p
            ref={subheadingRef}
            className="text-lg md:text-xl font-fright text-blue-700 opacity-80"
            style={{ willChange: "opacity, transform" }}
          >
            Modern styles, timeless quality. Find your next favorite piece.
          </p>
        </div>
        <ProductSection title="Men's Collection" products={mensProducts} sectionIndex={0} triggerKey={triggerKey} />
        <ProductSection title="Women's Collection" products={womensProducts} sectionIndex={1} triggerKey={triggerKey} />
      </div>
    </section>
  );
});

export default Products;