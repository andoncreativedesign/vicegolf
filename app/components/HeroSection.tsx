// app/components/HeroSection.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Image } from '@shopify/hydrogen';
import type { HeroItemTransformed } from '~/lib/sanity/home';

interface HeroSlide {
  id: string;
  bgImage: {
    url: string;
    altText: string;
  };
  title: string;
  subtitle?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

// Fallback slides if Sanity data is not available
const fallbackSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    bgImage: {
      url: 'https://via.placeholder.com/1920x1080/000000/FFFFFF?text=Black+Space+BG+with+Golf+Elements',
      altText: 'Black Friday Early Access',
    },
    title: 'BLACK FRIDAY',
    subtitle: 'EARLY ACCESS',
    description: 'Sign up now and be first in line for exclusive Black Friday drops and deals!',
    buttonText: 'Sign Me Up',
    buttonLink: '/account/register',
  },
  {
    id: 'slide-2',
    bgImage: {
      url: 'https://via.placeholder.com/1920x1080/4ECDC4/FFFFFF?text=Hero+Image+2',
      altText: 'Hero slide 2',
    },
    title: 'Summer Essentials Await',
    description: 'Beat the heat with lightweight fabrics and vibrant colors. Limited time offer.',
    buttonText: 'Explore More',
    buttonLink: '/collections/summer',
  },
  {
    id: 'slide-3',
    bgImage: {
      url: 'https://via.placeholder.com/1920x1080/45B7D1/FFFFFF?text=Hero+Image+3',
      altText: 'Hero slide 3',
    },
    title: 'Exclusive Deals Inside',
    description: 'Unlock member perks and get early access to sales. Join today!',
    buttonText: 'Join Now',
    buttonLink: '/account/register',
  },
];

interface HeroSectionProps {
  heroData?: HeroItemTransformed[] | null;
}

export function HeroSection({ heroData }: HeroSectionProps) {
  // Convert HeroItemTransformed array to HeroSlide array
  const heroSlides: HeroSlide[] = heroData?.map((item, index) => ({
    id: `hero-${index}-${item.title?.replace(/\s+/g, '-').toLowerCase() || index}`,
    bgImage: {
      url: item.image || fallbackSlides[0].bgImage.url,
      altText: item.title || `Hero slide ${index + 1}`,
    },
    title: item.title || 'Welcome',
    subtitle: item.description,
    description: item.description || 'Discover amazing products',
    buttonText: item.buttonText || 'Shop Now',
    buttonLink: '/collections', // Default link, can be customized
  })) || [];

  // Use hero slides if available, otherwise use fallback slides
  const slides = heroSlides.length > 0 ? heroSlides : fallbackSlides;

  // Ensure we always have at least one slide
  const validSlides = slides.length > 0 ? slides : fallbackSlides;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Only auto-advance if there are multiple slides
    if (validSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % validSlides.length);
      }, 5000); // Auto-advance every 5 seconds

      return () => clearInterval(interval);
    }
  }, [validSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % validSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + validSlides.length) % validSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = validSlides[currentSlide];

  return (
    <section className="relative w-full h-[70vh] max-h-[700px] lg:h-[80vh] lg:max-h-none 2xl:h-[40vw] 2xl:max-h-[80vh] mb-8 overflow-hidden">
      {/* Background Container */}
      <div className="absolute inset-0">
        {validSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              className="w-full h-full object-cover"
              data={slide.bgImage}
              alt={slide.bgImage.altText}
              sizes="100vw"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-start pl-8 md:pl-16 text-left text-white pr-8 md:pr-32">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase mb-2 md:mb-4 leading-tight drop-shadow-2xl">
            {currentSlideData.title}
          </h1>
          {currentSlideData.subtitle && (
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase mb-6 md:mb-8 drop-shadow-2xl">
              {currentSlideData.subtitle}
            </h2>
          )}
          <p className="text-base md:text-lg mb-8 md:mb-12 drop-shadow-lg leading-relaxed max-w-none">
            {currentSlideData.description}
          </p>
          <Link
            to={currentSlideData.buttonLink}
            className="inline-block bg-white text-black px-6 md:px-10 py-3 md:py-4 mt-6 rounded-full font-semibold text-base md:text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
          >
            {currentSlideData.buttonText}
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      {validSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300 z-30"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300 z-30"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
            {validSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}