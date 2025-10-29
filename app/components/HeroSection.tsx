// app/components/HeroSection.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Image } from '@shopify/hydrogen';

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

const slides: HeroSlide[] = [
  {
    id: 'slide-1',
    bgImage: {
      url: 'https://via.placeholder.com/1920x1080/000000/FFFFFF?text=Black+Space+BG+with+Golf+Elements', // Replace with actual dark space-themed golf hero image URL
      altText: 'Black Friday Early Access',
    },
    title: 'BLACK FRIDAY',
    subtitle: 'EARLY ACCESS',
    description: 'Sign up now and be first in line for exclusive Black Friday drops and deals!',
    buttonText: 'Sign Me Up',
    buttonLink: '/account/register',
  },
  // Keep other slides if desired, or remove for single-slide focus
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

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative justify-end flex flex-col w-full vc-wrapper-2xl h-[70vh] max-h-[700px] lg:h-screen-no-nav-80 lg:max-h-none 2xl:h-[40vw] 2xl:max-h-screen-no-nav-80 mb-section-md overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            className="w-full h-full object-cover"
            data={slide.bgImage}
            alt={slide.bgImage.altText}
            sizes="100vw"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          {/* Optional subtle overlay for readability if bg is too bright */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      ))}

      {/* Content Overlay - Left-aligned like the image */}
      <div className="absolute inset-0 flex items-center justify-start pl-8 md:pl-16 text-left text-white pr-8 md:pr-32">
        <div className="max-w-lg">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase mb-2 md:mb-4 leading-tight drop-shadow-lg">
            {currentSlideData.title}
          </h1>
          {currentSlideData.subtitle && (
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase mb-6 md:mb-8 drop-shadow-lg">
              {currentSlideData.subtitle}
            </h2>
          )}
          <p className="text-lg md:text-xl mb-8 md:mb-12 drop-shadow-md leading-relaxed max-w-none">
            {currentSlideData.description}
          </p>
          <Link
            to={currentSlideData.buttonLink}
            className="inline-block bg-white text-black px-8 md:px-12 py-4 rounded-full font-semibold text-lg md:text-xl hover:bg-gray-100 transition-colors duration-300 drop-shadow-lg"
          >
            {currentSlideData.buttonText}
          </Link>
        </div>
      </div>

      {/* Navigation Arrows - Adjusted for left-aligned content */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300 z-10"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300 z-10"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator - Positioned bottom center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
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
    </section>
  );
}