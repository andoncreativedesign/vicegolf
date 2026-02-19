import { useState } from 'react';
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

// Custom component for rendering rich text
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
  // If banner is not enabled or not provided, don't render anything
  if (!banner?.enabled || !banner?.content?.length) {
    return null;
  }

  const tickerContent = (
    <div className="flex items-center">
      {Array(10).fill(0).map((_, i) => (
        <span key={i} className="inline-flex items-center mx-10 text-xs font-semibold tracking-wider whitespace-nowrap">
          <BannerText value={banner.content} />
        </span>
      ))}
    </div>
  );

  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="w-screen overflow-hidden h-10 flex items-center relative"
      style={{
        backgroundColor: banner.backgroundColor,
        color: banner.textColor,
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 flex items-center overflow-hidden">
        <div
          className="flex whitespace-nowrap cursor-default"
          style={{
            width: 'max-content',
            animation: 'marquee 100s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {tickerContent}
          {tickerContent}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Hidden portable text for SEO and accessibility */}
      <div className="sr-only">
        <BannerText value={banner.content} />
      </div>
    </div>
  );
}
