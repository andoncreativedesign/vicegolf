import { useState, useEffect, useRef } from 'react';
import { Image } from '@shopify/hydrogen';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
};

export function ProductGallery({
  images = [],
  selectedImage,
  onImageSelect,
  mainImageClassNames = '',
  isAvailable = true,
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    if (!selectedImage) return;
    const index = images.findIndex((img) => img.id === selectedImage.id);
    if (index !== -1 && index !== currentIndex) {
      setCurrentIndex(index);
    }
  }, [selectedImage, images, currentIndex]);

  const handleNavigate = (dir: 'prev' | 'next') => {
    if (!images.length || isAnimating) return;

    setIsAnimating(true);
    setDirection(dir === 'next' ? 'right' : 'left');

    // Calculate new index based on direction
    let newIndex;
    if (dir === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }

    // Start the slide out animation
    if (imageContainerRef.current) {
      imageContainerRef.current.style.transform =
        dir === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
      imageContainerRef.current.style.opacity = '0';
    }

    // After slide out, update the image and slide back in
    setTimeout(() => {
      setCurrentIndex(newIndex);
      onImageSelect(images[newIndex]);

      // Reset position and animate back in
      requestAnimationFrame(() => {
        if (imageContainerRef.current) {
          imageContainerRef.current.style.transition = 'none';
          imageContainerRef.current.style.transform =
            dir === 'next' ? 'translateX(100%)' : 'translateX(-100%)';

          // Force reflow
          imageContainerRef.current.offsetHeight;

          // Start slide in animation
          requestAnimationFrame(() => {
            if (imageContainerRef.current) {
              imageContainerRef.current.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
              imageContainerRef.current.style.transform = 'translateX(0)';
              imageContainerRef.current.style.opacity = '1';
            }
          });
        }
      });

      // Reset animation state
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex || isAnimating) return;

    setIsAnimating(true);
    const dir = index > currentIndex ? 'next' : 'prev';
    setDirection(dir === 'next' ? 'right' : 'left');

    // Start the slide out animation
    if (imageContainerRef.current) {
      imageContainerRef.current.style.transform =
        dir === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
      imageContainerRef.current.style.opacity = '0';
    }

    // After slide out, update the image and slide back in
    setTimeout(() => {
      setCurrentIndex(index);
      onImageSelect(images[index]);

      // Reset position and animate back in
      requestAnimationFrame(() => {
        if (imageContainerRef.current) {
          imageContainerRef.current.style.transition = 'none';
          imageContainerRef.current.style.transform =
            dir === 'next' ? 'translateX(100%)' : 'translateX(-100%)';

          // Force reflow
          imageContainerRef.current.offsetHeight;

          // Start slide in animation
          requestAnimationFrame(() => {
            if (imageContainerRef.current) {
              imageContainerRef.current.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
              imageContainerRef.current.style.transform = 'translateX(0)';
              imageContainerRef.current.style.opacity = '1';
            }
          });
        }
      });

      // Reset animation state
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNavigate('next');
    }
    if (isRightSwipe) {
      handleNavigate('prev');
    }
  };

  if (!images.length) {
    return (
      <div className="bg-gray-100 aspect-square flex items-center justify-center rounded-xl">
        <span className="text-gray-400 text-sm">No images available</span>
      </div>
    );
  }

  const mainImage = selectedImage || images[0];
  const hasMultiple = images.length > 1;

  const handleThumbnailClick = (image: ProductImageType) => {
    const index = images.findIndex(img => img.id === image.id);
    if (index !== -1) {
      setCurrentIndex(index);
      onImageSelect(image);
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


  return (
    <div className="product-gallery flex flex-col md:flex-row gap-4 pb-4 md:gap-6 items-start">
      {/* Thumbnails */}
      {hasMultiple && !isMobileView && (
        <div className="flex md:flex-col gap-2 md:overflow-y-auto lg:h-[480px] xl:h-[580px] w-fit
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {images.map((image) => {
            const isActive = mainImage.id === image.id;
            return (
              <button
                key={image.id}
                onClick={() => handleThumbnailClick(image)}
                className={`lg:w-[70px] lg:h-[70px] xl:w-[88px] xl:h-[88px] relative flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 ${isActive
                  ? '' : ''}`}
              >
                <Image
                  data={image}
                  alt={image.altText || 'Thumbnail'}
                  className="lg:w-[70px] lg:h-[70px] xl:w-[88px] xl:h-[88px] bg-[#f6f6f6] object-cover"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image */}
      <div
        className="relative w-full max-w-3xl mx-auto group bg-[#f6f6f6] rounded-md overflow-hidden aspect-square max-h-[580px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* {isAvailable === false && (
          <div className="absolute top-4 left-4 z-10 bg-[#e5e5e5] text-[#333333] px-3 py-1.5 rounded-sm text-sm font-medium">
            Sold out
          </div>
        )} */}
        <div
          ref={imageContainerRef}
          className="w-full h-full transition-transform duration-300 ease-in-out"
        >
          <div className="w-full h-full">
            <Image
              data={mainImage}
              alt={mainImage.altText || 'Product Image'}
              className="w-full h-full object-contain"
              aspectRatio="1/1"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
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
                  className="bg-white/90 p-3 rounded-full transition-opacity duration-300 opacity-90 hover:opacity-100"
                  aria-label="Previous image"
                  disabled={isAnimating}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate('next');
                  }}
                  className="bg-white/90 p-3 rounded-full transition-opacity duration-300 opacity-90 hover:opacity-100"
                  aria-label="Next image"
                  disabled={isAnimating}
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

export default ProductGallery


