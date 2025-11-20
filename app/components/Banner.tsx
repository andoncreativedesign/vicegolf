import React, { useEffect, useState } from 'react';

interface BannerProps {
  messages?: string[];
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  speed?: number; // Time in seconds for one full scroll
  pauseOnHover?: boolean;
}

export function Banner({ 
  messages = [],
  text = '',
  backgroundColor = 'bg-black', 
  textColor = 'text-white',
  className = '',
  speed = 20,
  pauseOnHover = true
}: BannerProps) {
  // If text prop is provided, use it as a single message
  const bannerMessages = text ? [text] : messages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Handle auto-scrolling of messages
  useEffect(() => {
    if (bannerMessages.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerMessages.length);
    }, speed * 1000);

    return () => clearInterval(interval);
  }, [bannerMessages.length, speed, isPaused]);

  // If no messages, don't render anything
  if (bannerMessages.length === 0) return null;

  return (
    <div 
      className={`w-full py-2 px-4 overflow-hidden ${backgroundColor} ${textColor} ${className}`}
      style={{ marginLeft: 0, marginRight: 0 }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div className="whitespace-nowrap">
        {bannerMessages.length > 1 ? (
          <div 
            className="inline-block animate-marquee whitespace-nowrap"
            style={{
              animationDuration: `${speed * bannerMessages.length}s`,
              animationPlayState: isPaused ? 'paused' : 'running',
              paddingLeft: '100%',
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            {bannerMessages.map((message, index) => (
              <span key={index} className="inline-block mx-8">
                {message}
              </span>
            ))}
            {/* Duplicate messages for seamless looping */}
            {bannerMessages.map((message, index) => (
              <span key={`duplicate-${index}`} className="inline-block mx-8">
                {message}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm font-medium text-center">{bannerMessages[0]}</p>
        )}
      </div>
    </div>
  );
}

// Add the animation keyframes to the document's head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      animation: marquee linear infinite;
      display: inline-block;
      white-space: nowrap;
    }
  `;
  document.head.appendChild(style);
}

// Default export with Black Friday styling for convenience
export function BlackFridayBanner() {
  return (
    <Banner 
      messages={[
        "⚡️ Black Friday Deals Are Live ⚡️",
        "✈️ Free shipping at $150"
      ]}
      className="font-semibold"
      speed={15}
    />
  );
}
