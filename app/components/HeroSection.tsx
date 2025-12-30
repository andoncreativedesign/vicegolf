import { useState, useEffect, useRef } from 'react';
import { useFetcher, useNavigate } from 'react-router';
import { Image } from '@shopify/hydrogen';
import type { HeroItemTransformed } from '~/lib/sanity/home';

interface HeroSlide {
  id: string;
  bgImage: {
    url: string;
    altText: string;
    mobileUrl?: string;
  };
  title: string;
  titleColor?: string;
  text2?: {
    text?: string;
    color?: string;
  };
  description: string;
  descriptionColor?: string;
  buttonText?: string;
  buttonTextColor?: string;
  buttonBgColor?: string;
  handle?: string;
}

interface HeroSectionProps {
  heroData?: HeroItemTransformed[] | null;
  textColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  bgColor?: string;
  center?: boolean;
}

const fallbackSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    bgImage: {
      url: 'https://via.placeholder.com/2032x768/000000/FFFFFF?text=Slide+1',
      altText: 'Black Friday Early Access',
    },
    title: 'BLACK FRIDAY',
    titleColor: '#FFFFFF',
    description: 'Sign up now and be first in line for exclusive drops.',
    handle: '/account/register',
  }
];

export function HeroSection({
  heroData,
  textColor = 'text-white',
  buttonBgColor = 'bg-white',
  buttonTextColor = 'text-black',
  bgColor = 'bg-transparent',
  center = false
}: HeroSectionProps) {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const slideDuration = 5000;
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);

  const slides: HeroSlide[] = heroData?.map((item, index) => ({
    id: item._key || `hero-${index}`,
    bgImage: {
      url: item.image || fallbackSlides[0].bgImage.url,
      altText: item.title?.text || 'Hero Image',
      mobileUrl: item.mobileImage,
    },
    title: item.title?.text || '',
    titleColor: item.title?.color || '#FFFFFF',
    text2: item.text2,
    description: item.description?.text || '',
    descriptionColor: item.description?.color || '#FFFFFF',
    buttonText: item.buttonText?.text,
    buttonTextColor: item.buttonText?.textColor || buttonTextColor,
    buttonBgColor: item.buttonText?.backgroundColor || buttonBgColor,
    handle: item.handle,
  })) || fallbackSlides;

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;

    if (!isPaused) {
      const newProgress = Math.min((elapsed / slideDuration) * 100, 100);
      setProgress(newProgress);
      if (newProgress >= 100) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        startTimeRef.current = time;
      }
    } else {
      startTimeRef.current = time - (progress / 100) * slideDuration;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPaused, slides.length]);

  useEffect(() => {
    if (fetcher.data?.collection) {
      const { id, title } = fetcher.data.collection;
      navigate(`/collections/${encodeURIComponent(JSON.stringify([id]))}/${encodeURIComponent(title)}`);
    }
  }, [fetcher.data, navigate]);

  const handleCTA = (handle?: string) => {
    if (!handle) return;
    fetcher.submit({ handle }, { method: "post", action: "/api/collection" });
  };

  const current = slides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden mb-8 h-[74vh] min-h-[490px] max-h-[740px] w-screen max-w-[100vw] left-1/2 -ml-[50vw]">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <picture>
              {slide.bgImage.mobileUrl && <source media="(max-width: 767px)" srcSet={slide.bgImage.mobileUrl} />}
              <Image
                data={{ url: slide.bgImage.url, altText: slide.bgImage.altText }}
                className="absolute inset-0 w-full h-full object-cover object-center"
                sizes="100vw"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </picture>
            <div className="absolute inset-0 bg-black/25" />
          </div>
        ))}
      </div>

      {/* Content Layer */}
      <div className={`absolute inset-0 z-20 flex px-[clamp(1rem,4vw,3rem)] ${textColor} ${center ? 'items-center justify-start' : 'items-end justify-center md:justify-start pb-12 md:pb-6'}`}>
        <div className={`max-w-2xl lg:max-w-4xl xl:max-w-5xl py-10 md:py-14 ${bgColor} ${center ? '' : 'text-center md:text-left'}`} style={{ width: '90vw', maxWidth: '1200px' }}>
          <h1
            className="!text-3xl md:!text-4xl lg:!text-5xl xl:!text-5xl uppercase tracking-tight leading-none mb-1 font-normal"
            style={{ color: current.titleColor }}
          >
            {current.title}
          </h1>

          {current.text2?.text && (
            <h2
              className="!text-2xl md:!text-3xl lg:!text-4xl xl:!text-4xl font-extrabold uppercase tracking-tight leading-none mb-4"
              style={{ color: current.text2.color }}
            >
              {current.text2.text}
            </h2>
          )}

          {current.description && (
            <p
              className="!text-base md:!text-lg lg:!text-xl xl:!text-xl font-thin mb-6 leading-tight"
              style={{ color: current.descriptionColor }}
            >
              {current.description}
            </p>
          )}

          {current.buttonText && (
            <button
              onClick={() => handleCTA(current.handle)}
              className="!text-xs md:!text-sm px-3 py-1.5 md:px-5 md:py-1.5 font-medium rounded-full hover:opacity-90 transition-all shadow-lg transform hover:scale-105 mt-4"
              style={{ backgroundColor: current.buttonBgColor, color: current.buttonTextColor }}
            >
              {current.buttonText}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Progress & Play/Pause */}
          <div className="absolute bottom-4 right-4 md:right-8 lg:right-16 z-30">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="relative w-9 h-9 flex items-center justify-center bg-transparent hover:bg-white/20 rounded-full transition-all"
            >
              <svg className="absolute top-0 left-0 w-full h-full -rotate-90 overflow-visible" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
                <circle
                  cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeDasharray="100.5"
                  strokeDashoffset={100.5 - (progress / 100) * 100.5}
                  className="transition-none"
                  strokeLinecap="round"
                />
              </svg>
              <div className="relative z-10 text-white">
                {isPaused ? (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                ) : (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                )}
              </div>
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}