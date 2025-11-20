import React, { useEffect, useState, useMemo } from "react";

interface BannerProps {
  messages?: string[];
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
}

export function Banner({
  messages = [],
  text = "",
  backgroundColor = "bg-black",
  textColor = "text-white",
  className = "",
  speed = 20,
  pauseOnHover = true,
}: BannerProps) {
  const bannerMessages = text ? [text] : messages;
  const [isPaused, setIsPaused] = useState(false);

  const repeated = useMemo(() => {
    const repeats = 10;
    return Array.from({ length: repeats }, () => bannerMessages).flat();
  }, [bannerMessages]);

  if (!bannerMessages.length) return null;

  return (
    <div
      className={`w-full py-2 px-4 overflow-hidden ${backgroundColor} ${textColor} ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        className="flex whitespace-nowrap animate-marquee"
        style={{
          animationDuration: `${speed}s`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {repeated.map((msg, i) => (
          <span key={i} className="mx-8 inline-block">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}

if (typeof document !== "undefined") {
  if (!document.getElementById("marquee-style")) {
    const style = document.createElement("style");
    style.id = "marquee-style";
    style.textContent = `
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        animation: marquee linear infinite;
      }
    `;
    document.head.appendChild(style);
  }
}

export function BlackFridayBanner() {
  return (
    <Banner
      messages={[
        "⚡ Black Friday Deals Are Live ⚡",
        "New Balls: Cosmic Collection 🚀",
        "⚡ Black Friday Deals Are Live ⚡",
      ]}
      className="text-[13px] md:text-[15px] font-semibold tracking-wide leading-tight"
      speed={20}
    />
  );
}
