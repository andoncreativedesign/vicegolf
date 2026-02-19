import { useState, useRef, useEffect, useMemo } from 'react';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

interface BannerProps {
  banner?: {
    enabled: boolean;
    backgroundColor: string;
    textColor: string;
    content: PortableTextBlock[];
  };
}

const BannerText = ({ value }: { value: PortableTextBlock[] }) => {
  const components = {
    marks: {
      strong: ({ children }: { children: React.ReactNode }) => (
        <strong className="font-bold">{children}</strong>
      ),
      em: ({ children }: { children: React.ReactNode }) => (
        <em className="italic">{children}</em>
      ),
      underline: ({ children }: { children: React.ReactNode }) => (
        <u className="underline">{children}</u>
      ),
      link: ({ value, children }: { value?: any, children: React.ReactNode }) => {
        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
        return (
          <a
            href={value?.href}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: 'inherit' }}
          >
            {children}
          </a>
        );
      }
    }
  };

  return <PortableText value={value} components={components} />;
};

export default function Banner({ banner }: BannerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Memoize the content block for performance
  const memoizedContent = useMemo(() => {
    if (!banner?.content) return null;
    return (
      <div className="flex items-center flex-shrink-0">
        {/* Massive repetition (40x) to handle even the widest possible screens (8K monitors) */}
        {Array(40).fill(0).map((_, i) => (
          <span key={i} className="inline-flex items-center pr-20 text-[11px] md:text-sm font-semibold tracking-wide whitespace-nowrap">
            <BannerText value={banner.content} />
          </span>
        ))}
      </div>
    );
  }, [banner?.content]);

  useEffect(() => {
    if (!banner?.content?.length) return;

    const calculate = () => {
      if (contentRef.current) {
        const width = contentRef.current.offsetWidth;
        if (width > 0) {
          const pixelsPerSecond = 50; // Optimized constant speed
          const nextDuration = width / pixelsPerSecond;

          // Stability Filter: Only update if the change is more than 0.2s 
          // to prevent microscopic jitter from sub-pixel rounding
          setDuration(prev => {
            if (prev === null) return nextDuration;
            return Math.abs(prev - nextDuration) > 0.2 ? nextDuration : prev;
          });
        }
      }
    };

    const observer = new ResizeObserver(() => calculate());
    if (contentRef.current) observer.observe(contentRef.current);

    calculate();
    // Safety fallback for slow font loading
    const timer = setTimeout(calculate, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [banner?.content]);

  if (!banner?.enabled || !banner?.content?.length) {
    return null;
  }

  return (
    <div
      className="w-full h-8 md:h-9 flex items-center relative group select-none cursor-default border-b border-white/10 overflow-hidden"
      style={{
        backgroundColor: banner.backgroundColor,
        color: banner.textColor,
        margin: '0 auto',
        // Force full viewport breakthrough
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        opacity: duration ? 1 : 0,
        transition: 'opacity 0.6s ease-in-out',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center whitespace-nowrap h-full">
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: duration ? `marquee ${duration}s linear infinite` : 'none',
            animationPlayState: isPaused ? 'paused' : 'running',
            willChange: 'transform',
          }}
        >
          {/* Measured content container */}
          <div ref={contentRef} className="flex whitespace-nowrap flex-shrink-0">
            {memoizedContent}
          </div>
          {/* Duplicated for seamless reset */}
          <div className="flex whitespace-nowrap flex-shrink-0">
            {memoizedContent}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      ` }} />

      <div className="sr-only">
        <BannerText value={banner.content} />
      </div>
    </div>
  );
}
