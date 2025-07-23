import React from "react";

const pastelColors = {
  hanger: "#bfc7d1",
  shirt: "#e3eaf2",
  pants: "#f5e6e0",
  jacket: "#dbe7e4",
  accent: "#a3b6c7",
};

const Loading = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center min-h-screen w-screen bg-white backdrop-blur-[2px]"
      style={{
        background: "linear-gradient(120deg, #f7f8fa 0%, #e9ecf2 100%)",
      }}
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated SVG */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          className="block"
        >
          {/* Hanger (spins) */}
          <g>
            <g className="hanger-spin" style={{ transformOrigin: "60px 32px" }}>
              <path
                d="M60 22c0 5 4 10 10 10s10-5 10-10"
                stroke={pastelColors.hanger}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M60 22v10"
                stroke={pastelColors.hanger}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M40 42c0-6 8-10 20-10s20 4 20 10l-20 20-20-20z"
                stroke={pastelColors.hanger}
                strokeWidth="2.5"
                fill="none"
                strokeLinejoin="round"
              />
            </g>
          </g>
          {/* Shirt (fade in/out) */}
          <g className="clothing-item shirt-fade">
            <rect
              x="45"
              y="52"
              width="30"
              height="28"
              rx="6"
              fill={pastelColors.shirt}
              stroke={pastelColors.accent}
              strokeWidth="2"
            />
            <rect
              x="42"
              y="52"
              width="6"
              height="14"
              rx="2"
              fill={pastelColors.shirt}
              stroke={pastelColors.accent}
              strokeWidth="2"
            />
            <rect
              x="72"
              y="52"
              width="6"
              height="14"
              rx="2"
              fill={pastelColors.shirt}
              stroke={pastelColors.accent}
              strokeWidth="2"
            />
          </g>
          {/* Pants (fade in/out) */}
          <g className="clothing-item pants-fade">
            <rect
              x="50"
              y="80"
              width="8"
              height="18"
              rx="3"
              fill={pastelColors.pants}
              stroke={pastelColors.accent}
              strokeWidth="2"
            />
            <rect
              x="62"
              y="80"
              width="8"
              height="18"
              rx="3"
              fill={pastelColors.pants}
              stroke={pastelColors.accent}
              strokeWidth="2"
            />
          </g>
          {/* Jacket (fade in/out) */}
          <g className="clothing-item jacket-fade">
            <path
              d="M45 52 Q40 70 50 98"
              stroke={pastelColors.jacket}
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M75 52 Q80 70 70 98"
              stroke={pastelColors.jacket}
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </svg>
        <span className="font-fright text-base text-[#7a8597] tracking-wide uppercase select-none loading-text-anim">
          <span className="loading-letter">L</span>
          <span className="loading-letter">o</span>
          <span className="loading-letter">a</span>
          <span className="loading-letter">d</span>
          <span className="loading-letter">i</span>
          <span className="loading-letter">n</span>
          <span className="loading-letter">g</span>
          <span className="loading-letter">&nbsp;</span>
          <span className="loading-letter">y</span>
          <span className="loading-letter">o</span>
          <span className="loading-letter">u</span>
          <span className="loading-letter">r</span>
          <span className="loading-letter">&nbsp;</span>
          <span className="loading-letter">s</span>
          <span className="loading-letter">t</span>
          <span className="loading-letter">y</span>
          <span className="loading-letter">l</span>
          <span className="loading-letter">e</span>
          <span className="loading-letter">.</span>
          <span className="loading-letter">.</span>
          <span className="loading-letter">.</span>
        </span>
      </div>
      {/* Animation styles */}
      <style>{`
        .hanger-spin {
          animation: hanger-spin 1.6s cubic-bezier(.6,.1,.4,.9) infinite;
        }
        @keyframes hanger-spin {
          0% { transform: rotate(0deg);}
          80% { transform: rotate(360deg);}
          100% { transform: rotate(360deg);}
        }
        .clothing-item {
          opacity: 0;
        }
        .shirt-fade {
          animation: fadeInOut 2.4s linear infinite;
          animation-delay: 0.2s;
        }
        .pants-fade {
          animation: fadeInOut 2.4s linear infinite;
          animation-delay: 0.8s;
        }
        .jacket-fade {
          animation: fadeInOut 2.4s linear infinite;
          animation-delay: 1.4s;
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          40% { opacity: 1; }
          60% { opacity: 0; }
          100% { opacity: 0; }
        }
        .loading-text-anim {
          display: inline-block;
        }
        .loading-letter {
          display: inline-block;
          opacity: 0.7;
          transform: translateY(0);
          animation: loading-bounce 1.6s infinite;
        }
        .loading-letter:nth-child(1)  { animation-delay: 0s; }
        .loading-letter:nth-child(2)  { animation-delay: 0.06s; }
        .loading-letter:nth-child(3)  { animation-delay: 0.12s; }
        .loading-letter:nth-child(4)  { animation-delay: 0.18s; }
        .loading-letter:nth-child(5)  { animation-delay: 0.24s; }
        .loading-letter:nth-child(6)  { animation-delay: 0.30s; }
        .loading-letter:nth-child(7)  { animation-delay: 0.36s; }
        .loading-letter:nth-child(8)  { animation-delay: 0.42s; }
        .loading-letter:nth-child(9)  { animation-delay: 0.48s; }
        .loading-letter:nth-child(10) { animation-delay: 0.54s; }
        .loading-letter:nth-child(11) { animation-delay: 0.60s; }
        .loading-letter:nth-child(12) { animation-delay: 0.66s; }
        .loading-letter:nth-child(13) { animation-delay: 0.72s; }
        .loading-letter:nth-child(14) { animation-delay: 0.78s; }
        .loading-letter:nth-child(15) { animation-delay: 0.84s; }
        .loading-letter:nth-child(16) { animation-delay: 0.90s; }
        .loading-letter:nth-child(17) { animation-delay: 0.96s; }
        .loading-letter:nth-child(18) { animation-delay: 1.02s; }
        .loading-letter:nth-child(19) { animation-delay: 1.08s; }
        .loading-letter:nth-child(20) { animation-delay: 1.14s; }
        .loading-letter:nth-child(21) { animation-delay: 1.20s; }
        @keyframes loading-bounce {
          0%   { transform: translateY(0);    opacity: 0.7; }
          10%  { transform: translateY(-7px); opacity: 1; }
          20%  { transform: translateY(0);    opacity: 0.7; }
          100% { transform: translateY(0);    opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default Loading;