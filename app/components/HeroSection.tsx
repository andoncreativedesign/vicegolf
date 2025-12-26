// app/components/HeroSection.tsx
import { useState, useEffect } from 'react';
import { Link, useFetcher, useNavigate } from 'react-router';
import { Image } from '@shopify/hydrogen';
import type { HeroItemTransformed } from '~/lib/sanity/home';

interface HeroSlide {
  id: string;
  bgImage: {
    url: string;
    altText: string;
    mobileUrl?: string;
    mobileAltText?: string;
  };
  title: string;
  titleColor?: string;
  description: string;
  descriptionColor?: string;
  buttonText: string;
  buttonTextColor?: string;
  buttonBgColor?: string;
  handle: string;
  _key?: string;
}

const fallbackSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    bgImage: {
      url: 'https://via.placeholder.com/2032x768/000000/FFFFFF?text=Black+Space+BG+with+Golf+Elements',
      altText: 'Black Friday Early Access',
    },
    title: 'BLACK FRIDAY',
    titleColor: '#FFFFFF',
    description: 'Sign up now and be first in line for exclusive Black Friday drops and deals!',
    descriptionColor: '#FFFFFF',
    buttonText: 'Sign Me Up',
    buttonTextColor: '#000000',
    buttonBgColor: '#FFFFFF',
    handle: '/account/register',
  },
  {
    id: 'slide-2',
    bgImage: {
      url: 'https://via.placeholder.com/2032x768/4ECDC4/FFFFFF?text=Hero+Image+2',
      altText: 'Hero slide 2',
    },
    title: 'Summer Essentials Await',
    titleColor: '#FFFFFF',
    description: 'Beat the heat with lightweight fabrics and vibrant colors. Limited time offer.',
    descriptionColor: '#FFFFFF',
    buttonText: 'Explore More',
    buttonTextColor: '#000000',
    buttonBgColor: '#FFFFFF',
    handle: '/collections/summer',
  },
  {
    id: 'slide-3',
    bgImage: {
      url: 'https://via.placeholder.com/2032x768/45B7D1/FFFFFF?text=Hero+Image+3',
      altText: 'Hero slide 3',
    },
    title: 'Exclusive Deals Inside',
    titleColor: '#FFFFFF',
    description: 'Unlock member perks and get early access to sales. Join today!',
    descriptionColor: '#FFFFFF',
    buttonText: 'Join Now',
    buttonTextColor: '#000000',
    buttonBgColor: '#FFFFFF',
    handle: '/account/register',
  },
];

interface HeroSectionProps {
  heroData?: HeroItemTransformed[] | null;
  textColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  bgColor?: string;
  center?: boolean;
}

export function HeroSection({
  heroData,
  textColor = 'text-white',
  buttonBgColor = 'bg-white',
  buttonTextColor = 'text-black',
  bgColor = 'bg-transparent',
  center = false
}: HeroSectionProps) {
  const heroSlides: HeroSlide[] =
    heroData?.map((item, index) => {
      const titleText = item.title?.text || 'Welcome';
      const descriptionText = item.description?.text || 'Discover amazing products';
      const buttonText = item.buttonText?.text || 'Shop Now';

      return {
        id: `hero-${index}-${titleText.replace(/\s+/g, '-').toLowerCase() || index}`,
        _key: item._key || `hero-${index}`,
        bgImage: {
          url: item.image || fallbackSlides[0].bgImage.url,
          altText: titleText,
          mobileUrl: item.mobileImage,
          mobileAltText: `${titleText} (Mobile)`,
        },
        title: titleText,
        titleColor: item.title?.color || '#FFFFFF',
        description: descriptionText,
        descriptionColor: item.description?.color || '#FFFFFF',
        buttonText: buttonText,
        buttonTextColor: item.buttonText?.textColor || '#000000',
        buttonBgColor: item.buttonText?.backgroundColor || '#FFFFFF',
        handle: item.handle,
      };
    }) || [];

  const slides = heroSlides.length > 0 ? heroSlides : fallbackSlides;
  const validSlides = slides.length > 0 ? slides : fallbackSlides;

  const fetcher = useFetcher()
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationRef, setAnimationRef] = useState<number>();
  const slideDuration = 5000; // 5 seconds per slide

  const animateProgress = (startTimestamp: number, duration: number) => {
    const startTime = performance.now();

    const frame = (currentTime: number) => {
      if (isPaused) return;

      const elapsed = currentTime - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      // Update progress state with the new value
      setProgress(newProgress);

      // Continue the animation if not complete
      if (newProgress < 100) {
        const id = requestAnimationFrame(frame);
        setAnimationRef(id);
      } else {
        // Move to next slide when progress completes
        setCurrentSlide(prev => (prev + 1) % validSlides.length);
      }
    };

    // Start the animation
    const id = requestAnimationFrame(frame);
    setAnimationRef(id);
    return id;
  };

  useEffect(() => {
    if (validSlides.length <= 1) return;

    let timeoutId: NodeJS.Timeout;

    // Cleanup any existing animations
    if (animationRef) {
      cancelAnimationFrame(animationRef);
    }

    if (!isPaused) {
      // Reset progress and start new animation
      setProgress(0);
      setIsAnimating(true);

      // Start smooth progress animation
      const id = animateProgress(performance.now(), slideDuration);

      // Fallback timeout in case animation frame doesn't complete
      timeoutId = setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % validSlides.length);
      }, slideDuration + 50);

      return () => {
        cancelAnimationFrame(id);
        clearTimeout(timeoutId);
      };
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [validSlides.length, isPaused, currentSlide]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % validSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + validSlides.length) % validSlides.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  const currentSlideData = validSlides[currentSlide];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, item: HeroSlide) => {
    e.preventDefault()
    if (!item.handle) return
    fetcher.submit(
      { handle: item.handle },
      { method: "post", action: "/api/collection" }
    );
  }

  useEffect(() => {
    if (
      fetcher.state === "idle"
      && fetcher.data?.collection?.id
      && fetcher.data?.collection?.title
    ) {
      const { id, title } = fetcher.data.collection
      console.log("fetcher.data hero section", id, title)
      navigate(`/collections/${encodeURIComponent(JSON.stringify([id]))}/${encodeURIComponent(title)}`);
    }
  }, [fetcher.state, fetcher.data, navigate]);

  return (
    <section className="relative w-full overflow-hidden mb-8 h-[74vh] min-h-[490px] max-h-[740px] w-screen max-w-[100vw] left-1/2 -ml-[50vw]">
      {/* Background slides */}
      <div className="absolute inset-0">
        {validSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            {/* Desktop Image */}
            <div className="hidden md:block absolute inset-0 w-full h-full">
              <Image
                className="w-full h-full object-cover object-center"
                src={slide.bgImage.url}
                alt={slide.bgImage.altText}
                sizes="100vw"
                loading={index === 0 ? 'eager' : 'lazy'}
                width={1920}
                height={1080}
              />
            </div>

            {/* Mobile Image - only shown if mobileUrl exists */}
            {slide.bgImage.mobileUrl ? (
              <div className="md:hidden absolute inset-0 w-full h-full">
                <Image
                  className="w-full h-full object-cover object-center"
                  src={slide.bgImage.mobileUrl}
                  alt={slide.bgImage.mobileAltText || slide.bgImage.altText}
                  sizes="100vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  width={768}
                  height={1024}
                />
              </div>
            ) : (
              // Fallback to desktop image on mobile if no mobile image is provided
              <div className="md:hidden absolute inset-0 w-full h-full">
                <Image
                  className="w-full h-full object-cover object-center"
                  src={slide.bgImage.url}
                  alt={slide.bgImage.altText}
                  sizes="100vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  width={768}
                  height={1024}
                />
              </div>
            )}

            <div className="absolute inset-0 bg-black/25" />
          </div>
        ))}
      </div>

      {/* Text and CTA */}
      <div className={`absolute inset-0 z-20 flex ${center ? 'items-center justify-start' : 'items-end justify-center md:justify-start pb-12 md:pb-6'} px-[clamp(1rem,4vw,3rem)] ${textColor}`}>
        <div className={`max-w-xl py-10 md:py-14 ${bgColor} ${center ? '' : 'text-center md:text-left'}`}>
          <h1
            className="font-extrabold uppercase tracking-tight"
            style={{
              fontSize: '3rem',
              lineHeight: '1.1',
              marginBottom: '0.5rem',
              color: currentSlideData.titleColor || textColor
            }}
          >
            {currentSlideData.title}
          </h1>

          {currentSlideData.description && (
            <h2
              className="text-2xl md:text-4xl lg:text-5xl font-thin mb-6"
              style={{
                lineHeight: '1.1',
                fontWeight: '200',
                color: currentSlideData.descriptionColor || textColor
              }}
            >
              {currentSlideData.description}
            </h2>
          )}

          <button
            onClick={(e) => handleClick(e, currentSlideData)}
            className="px-8 py-3 font-medium rounded-full hover:opacity-90 transition-opacity"
            style={{
              color: currentSlideData.buttonTextColor || buttonTextColor,
              backgroundColor: currentSlideData.buttonBgColor || buttonBgColor
            }}
          >
            {currentSlideData.buttonText}
          </button>

        </div>
      </div>

      {/* Navigation arrows */}
      {validSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          {/* Pause/Play Button with Progress Ring */}
          <div className="absolute bottom-4 right-4 md:right-8 lg:right-16 z-20">
            <button
              onClick={togglePause}
              className="relative bg-black/50 hover:bg-black/70 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
            >
              {/* Progress Ring */}
              <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="113.1"
                  strokeDashoffset={113.1 - (progress / 100) * 113.1}
                  strokeLinecap="round"
                  style={{
                    transition: 'none',
                    willChange: 'stroke-dashoffset',
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%'
                  }}
                />
              </svg>

              {/* Play/Pause Icon */}
              <div className="relative z-10">
                {isPaused ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6" />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {validSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
