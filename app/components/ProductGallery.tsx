import { useState, useEffect, useCallback, useRef } from 'react';
import { Image } from '@shopify/hydrogen';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import './ProductGallery.animations.css';

type ProductImageType = {
  id: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type ProductGalleryProps = {
  images: ProductImageType[];
  selectedImage: ProductImageType | null;
  onImageSelect: (image: ProductImageType) => void;
  mainImageClassNames?: string;
  isAvailable?: boolean;
  tags?: string[];
  badge_colors?: string;
};

export function ProductGallery({
  images = [],
  selectedImage,
  onImageSelect,
  mainImageClassNames = '',
  isAvailable = true,
  tags = [],
  badge_colors,
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Initialize Embla with loop enabled
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 30, // Adjust speed if needed
    skipSnaps: false,
  });

  // Handle scroll events from Embla
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setCurrentIndex(index);
    onImageSelect(images[index]);
  }, [emblaApi, images, onImageSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Sync Embla with parent selectedImage (e.g., from variant change)
  useEffect(() => {
    if (emblaApi && selectedImage) {
      const index = images.findIndex((img) => img.id === selectedImage.id);
      if (index !== -1 && index !== emblaApi.selectedScrollSnap()) {
        emblaApi.scrollTo(index);
      }
    }
  }, [emblaApi, selectedImage, images]);

  const handleNavigate = (dir: 'prev' | 'next') => {
    if (!emblaApi) return;
    if (dir === 'next') {
      emblaApi.scrollNext();
    } else {
      emblaApi.scrollPrev();
    }
  };

  const handleDotClick = (index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  };

  const handleThumbnailClick = (image: ProductImageType) => {
    const index = images.findIndex(img => img.id === image.id);
    if (index !== -1 && emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Synchronize thumbnail scroll
  useEffect(() => {
    if (thumbnailsRef.current && !isMobileView) {
      const activeThumbnail = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (activeThumbnail) {
        const container = thumbnailsRef.current;
        const containerHeight = container.offsetHeight;
        const thumbnailTop = activeThumbnail.offsetTop;
        const thumbnailHeight = activeThumbnail.offsetHeight;

        // Calculate scroll position - using a fixed offset to ensure it moves immediately
        // This puts the active thumbnail near the top, causing it to scroll up on every 'next' click
        const scrollOffset = 20; // Padding from top
        const scrollPosition = thumbnailTop - scrollOffset;

        container.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex, isMobileView]);

  if (!images.length) {
    return (
      <div className="bg-gray-100 aspect-square flex items-center justify-center rounded-xl">
        <span className="text-gray-400 text-sm">No images available</span>
      </div>
    );
  }

  const hasMultiple = images.length > 1;

  return (
    <div className="product-gallery flex flex-col md:flex-row gap-4 pb-4 md:gap-6 items-stretch w-full overflow-visible">
      {/* Thumbnails */}
      {hasMultiple && !isMobileView && (
        <div className="relative flex-shrink-0 lg:w-[70px] xl:w-[88px]">
          <div
            ref={thumbnailsRef}
            className="absolute inset-0 flex md:flex-col gap-2 md:overflow-y-auto w-full
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
          >
            {images.map((image, idx) => {
              return (
                <button
                  key={image.id}
                  onClick={() => handleThumbnailClick(image)}
                  className="lg:w-[70px] lg:h-[70px] xl:w-[88px] xl:h-[88px] relative flex-shrink-0 rounded-md overflow-hidden transition-all duration-300 border-2 border-transparent"
                >
                  <Image
                    data={image}
                    alt={image.altText || 'Thumbnail'}
                    className="w-full h-full bg-[#f6f6f6] object-cover"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Image Slider with Embla */}
      <div
        className="relative w-full mx-auto group bg-[#f6f6f6] rounded-md overflow-hidden aspect-square max-h-[700px]"
      >
        <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
          {!isAvailable && (
            <span className="bg-[#e2e2e2] text-[#3e3e40] text-[15px] font-medium px-5 py-2.5 rounded-md shadow-sm">
              Sold out
            </span>
          )}
          {isAvailable && (tags || [])?.map((tag: string) => {
            const tagText = tag?.trim()?.replace(/^badge:/i, '')?.trim();
            const normalizedTag = tagText?.toLowerCase();
            let customStyles = {};
            try {
              const rawColors = badge_colors;
              const colorsString = typeof rawColors === 'string'
                ? rawColors
                : (rawColors as any)?.value;
              const parsed = colorsString ? JSON.parse(colorsString) : {};
              const badgeColors = Object.keys(parsed).reduce((acc: any, key) => {
                acc[key.toLowerCase()] = parsed[key];
                return acc;
              }, {});
              customStyles = badgeColors[normalizedTag] || {};
            } catch (e) { }

            return (
              <span
                key={tag}
                className="text-[15px] font-medium px-5 py-2.5 rounded-md shadow-sm capitalize"
                style={{
                  backgroundColor: (customStyles as any).bg || 'black',
                  color: (customStyles as any).text || 'white'
                }}
              >
                {tagText}
              </span>
            );
          })}
        </div>
        <div className="w-full h-full overflow-hidden" ref={emblaRef}>
          <div className="flex w-full h-full touch-pan-y">
            {images.map((image, idx) => (
              <div key={image.id} className="flex-[0_0_100%] min-w-0 h-full relative">
                <Image
                  data={image}
                  alt={image.altText || 'Product Image'}
                  className="w-full h-full object-contain"
                  aspectRatio="1/1"
                  loading={idx === currentIndex || Math.abs(idx - currentIndex) === 1 ? 'eager' : 'lazy'}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            ))}
          </div>
        </div>

        {hasMultiple && (
          <>
            {isMobileView ? (
              /* Mobile Dots Pagination */
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDotClick(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                      ? 'bg-black w-3'
                      : 'bg-black/20 hover:bg-black/40'
                      }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            ) : (
              /* Desktop Arrows */
              <div className="absolute bottom-6 right-6 flex gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate('prev');
                  }}
                  className="bg-white/90 p-3 rounded-full shadow-sm hover:bg-white transition-all opacity-90 hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate('next');
                  }}
                  className="bg-white/90 p-3 rounded-full shadow-sm hover:bg-white transition-all opacity-90 hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductGallery;


