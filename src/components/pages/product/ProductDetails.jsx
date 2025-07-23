import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../../data/ProductsData";
import "../customs/prodetailBKbtn.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/products");
  };

  // Find the product by id (id from params is string)
  const product = PRODUCTS.find((p) => String(p.id) === String(id));

  // Zoom state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const imgRef = useRef(null);

  // Handlers for zoom
  const handleMouseEnter = () => {
    // Only enable zoom if image is loaded and has dimensions
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setIsZoomed(true);
      }
    }
  };

  const handleMouseLeave = () => setIsZoomed(false);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    // Prevent division by zero and NaN
    if (rect.width === 0 || rect.height === 0) return;
    const x = e.clientX - rect.left; // x position within the image
    const y = e.clientY - rect.top; // y position within the image
    setZoomPos({
      x: Math.max(0, Math.min(x, rect.width)),
      y: Math.max(0, Math.min(y, rect.height)),
      width: rect.width,
      height: rect.height,
    });
  };

  if (!product) {
    return (
      <div
        id="productDetails"
        className="flex flex-col items-center justify-center min-h-[60vh]"
      >
        <h2 className="text-2xl font-bold text-blue-900 mb-4">
          Product Not Found
        </h2>
        <button
          className="px-6 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-yellow-400 hover:text-blue-900 transition-colors duration-200"
          onClick={handleBack}
        >
          Go Back
        </button>
      </div>
    );
  }

  // Zoom lens size and zoom factor
  const lensSize = 160;
  const zoomScale = 2.2;

  // Calculate background position for zoomed image
  let zoomStyles = {};
  if (
    isZoomed &&
    imgRef.current &&
    zoomPos.width > 0 &&
    zoomPos.height > 0 &&
    !isNaN(zoomPos.x) &&
    !isNaN(zoomPos.y)
  ) {
    const { x, y, width, height } = zoomPos;
    // Calculate percent
    const percentX = x / width;
    const percentY = y / height;
    // Calculate background position
    zoomStyles = {
      display: "block",
      position: "absolute",
      left: Math.max(0, Math.min(x - lensSize / 2, width - lensSize)),
      top: Math.max(0, Math.min(y - lensSize / 2, height - lensSize)),
      width: `${lensSize}px`,
      height: `${lensSize}px`,
      borderRadius: "12px",
      boxShadow: "0 4px 24px 0 rgba(0,0,0,0.18)",
      border: "2px solid #facc15",
      backgroundImage: `url(${product.image})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${width * zoomScale}px ${height * zoomScale}px`,
      backgroundPosition: `${-percentX * width * (zoomScale - 1)}px ${-percentY * height * (zoomScale - 1)}px`,
      zIndex: 20,
      pointerEvents: "none",
      transition: "box-shadow 0.15s",
    };
  }

  // Handler for back button to go to products page
  const handleBackToProducts = () => {
    navigate("/products");
  };

  return (
    <section
      id="productDetails"
      className="flex flex-col items-center justify-center min-h-[80vh] px-10 mt-36 lg:mt-24"
    >
      <img
        src="/comboImg/offerbg.webp"
        alt="products-bg"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-[0.05] z-[-10]"
      />
      {/* Back Button */}
      <div className="w-full ">
        <button id="back-btn" onClick={handleBackToProducts} type="button">
          <span>Back</span>
        </button>
      </div>

      <div className="w-full lg:flex lg:mt-16">
        {/* Product Image with Zoom */}
        <div className="w-full flex justify-center mb-8 relative">
          <div
            className="relative"
            style={{ width: "100%", maxWidth: "22rem" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <img
              ref={imgRef}
              src={product.image}
              alt={product.name}
              className="rounded-2xl shadow-xl max-w-xs md:max-w-md w-full object-cover select-none"
              style={{ cursor: isZoomed ? "zoom-in" : "pointer" }}
              draggable={false}
              onLoad={() => {
                // Reset zoomPos to valid dimensions on image load
                if (imgRef.current) {
                  const rect = imgRef.current.getBoundingClientRect();
                  setZoomPos((prev) => ({
                    ...prev,
                    width: rect.width,
                    height: rect.height,
                  }));
                }
              }}
            />
            {/* Zoom lens */}
            {isZoomed &&
              imgRef.current &&
              zoomPos.width > 0 &&
              zoomPos.height > 0 &&
              !isNaN(zoomPos.x) &&
              !isNaN(zoomPos.y) && <div style={zoomStyles} />}
          </div>
        </div>
        {/* Product Info */}
        <div className="w-full flex flex-col items-start px-4 md:px-12">
          <span className="bg-yellow-400 text-xs font-bold px-4 py-1 rounded-full shadow text-blue-900 uppercase tracking-wide mb-4">
            {product.tag}
          </span>
          <h1 className="font-Verve-regular text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            {product.name}
          </h1>
          <p className="text-yellow-700 font-LEMONMILK font-bold text-2xl mb-4">
            {product.price}
          </p>
          <p className="text-blue-700 font-medium mb-6">
            <span className="font-bold">Gender:</span>{" "}
            {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
          </p>
          <div className="flex gap-4 w-full lg:w-1/2">
            <button
              className="flex-1 py-3 rounded-lg bg-blue-900 text-white font-LEMONMILK font-semibold text-lg hover:bg-yellow-400 hover:text-blue-900 transition-colors duration-200 shadow"
              tabIndex={0}
            >
              Add to Cart
            </button>
            <button
              className="flex-1 py-3 rounded-lg bg-yellow-400 text-blue-900 font-LEMONMILK font-semibold text-lg hover:bg-blue-900 hover:text-white transition-colors duration-200 shadow"
              tabIndex={0}
            >
              Buy Now
            </button>
          </div>
        </div>
        
      </div>
      {/* Size image always below for all devices */}
      <div className="w-full md:px-10 my-10 gap-10 flex flex-col md:flex-row items-start justify-start">
          <img
            src="/productsImg/s_5.webp"
            alt=""
            className="md:w-1/2 lg:w-1/4 lg:ml-36"
          />
        <div className="flex w-full items-center justify-center gap-4">
            <img src="/productsImg/madein.webp" alt="" className="lg:w-40 md:w-20 w-10" />
            <img src="/productsImg/refund.webp" alt="" className="lg:w-40 md:w-20 w-10" />
        </div>
        </div>
    </section>
  );
};

export default ProductDetails;
