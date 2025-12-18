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
  mainImageClassNames?: string
};

export function ProductGallery({
  images = [],
  selectedImage,
  onImageSelect,
  mainImageClassNames = '',
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
      setIsMobileView(window.innerWidth <= 1024);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


  return (
    <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start">
      {/* Thumbnails */}
      {hasMultiple && !isMobileView && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[580.547px] 
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {images.map((image) => {
            const isActive = mainImage.id === image.id;
            return (
              <button
                key={image.id}
                onClick={() => handleThumbnailClick(image)}
                className={`relative flex-shrink-0 rounded-none overflow-hidden transition-all duration-200 ${isActive
                  ? '' : ''}`}
              >
                <Image
                  data={image}
                  alt={image.altText || 'Thumbnail'}
                  className="w-20 h-20 md:w-20 md:h-20 object-cover bg-gray-50"
                  loading="lazy"
                  sizes="(min-width: 768px) 6rem, 5rem"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image */}
      <div className="relative w-full max-w-3xl mx-auto group bg-[#f6f6f6] rounded-none overflow-hidden">
        <div
          ref={imageContainerRef}
          className="w-full h-full transition-transform duration-300 ease-in-out"
        >
          <div className="">
            <Image
              data={mainImage}
              alt={mainImage.altText || 'Product Image'}
              className={`sm:min-h-[580.547px] min-h-[285px] max-w-[690.547px] max-h-[580.547px]`}
              aspectRatio="1/1"
              // sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>

        {hasMultiple && (
          <div className="absolute bottom-6 right-6 flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate('prev');
              }}
              className="bg-white/90 p-3 rounded-full transition-opacity duration-300 opacity-90"
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
              className="bg-white/90 p-3 rounded-full transition-opacity duration-300 opacity-90"
              aria-label="Next image"
              disabled={isAnimating}
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default ProductGallery
