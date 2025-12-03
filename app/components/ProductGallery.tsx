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
};

export function ProductGallery({ images = [], selectedImage, onImageSelect }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  // Handle thumbnail slide-in animation
  useEffect(() => {
    if (!thumbnailContainerRef.current) return;
    
    const container = thumbnailContainerRef.current;
    const thumbnails = container.querySelectorAll('button');
    
    // Add slide-in animation to each thumbnail with staggered delay
    thumbnails.forEach((thumb, index) => {
      (thumb as HTMLElement).style.animation = `slideIn 0.3s ease-out ${index * 0.05}s forwards`;
    });
    
    // Scroll to active thumbnail
    const activeThumbnail = thumbnails[currentIndex];
    if (activeThumbnail) {
      // For vertical layout on desktop
      if (window.innerWidth >= 768) {
        const containerHeight = container.offsetHeight;
        const thumbHeight = activeThumbnail.offsetHeight;
        const scrollTop = activeThumbnail.offsetTop - (containerHeight - thumbHeight) / 2;
        
        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      } 
      // For horizontal layout on mobile
      else {
        const containerWidth = container.offsetWidth;
        const thumbWidth = activeThumbnail.offsetWidth;
        const scrollLeft = activeThumbnail.offsetLeft - (containerWidth - thumbWidth) / 2;
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

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

  return (
    <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start">
      {/* Thumbnails */}
      {hasMultiple && (
        <div 
          ref={thumbnailContainerRef}
          className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[calc(6*5.5rem)] scrollbar-hide"
          style={{ 
            scrollBehavior: 'smooth',
            opacity: 0,
            animation: 'fadeIn 0.3s ease-out 0.2s forwards'
          }}
        >
          {images.map((image) => {
            const isActive = mainImage.id === image.id;
            return (
              <button
                key={image.id}
                onClick={() => onImageSelect(image)}
                className={`relative flex-shrink-0 rounded-none overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md ${
                  isActive
                    ? 'ring-1 ring-white scale-[1.03] shadow-md'
                    : 'hover:ring-0 hover:ring-white'
                }`}
              >
                <Image
                  data={image}
                  alt={image.altText || 'Thumbnail'}
                  className="w-20 h-20 object-cover bg-gray-50"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image */}
      <div className="relative flex-1 group bg-white rounded-none shadow-lg overflow-hidden aspect-square">
        <div 
          ref={imageContainerRef}
          className="w-full h-full transition-transform duration-300 ease-in-out"
        >
          <div className="w-full h-full">
            <Image
              data={mainImage}
              alt={mainImage.altText || 'Product Image'}
              className="w-full h-full object-cover"
              aspectRatio="1/1"
              sizes="(min-width: 45em) 50vw, 100vw"
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
              className="bg-white/90 hover:bg-white p-3 rounded-full shadow-md transition-opacity duration-300 opacity-90 hover:opacity-100"
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
              className="bg-white/90 hover:bg-white p-3 rounded-full shadow-md transition-opacity duration-300 opacity-90 hover:opacity-100"
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

export default ProductGallery;