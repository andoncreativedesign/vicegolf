import { useState, useEffect } from 'react';
import { Image } from '@shopify/hydrogen';

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
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Simple click handler for thumbnails
  const handleThumbClick = (image: ProductImageType) => {
    onImageSelect(image);
  };

  // Update current index when selectedImage changes
  useEffect(() => {
    if (selectedImage && images.length > 0) {
      const index = images.findIndex(img => img.id === selectedImage.id);
      if (index !== -1 && index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  }, [selectedImage, images, currentIndex]);


  // Handle keyboard navigation
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (!images.length) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const direction = e.key === 'ArrowLeft' ? -1 : 1;
        const newIndex = (currentIndex + direction + images.length) % images.length;
        onImageSelect(images[newIndex]);
      }
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [currentIndex, images, onImageSelect]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  // Handle arrow clicks
  const handleArrowClick = (direction: 'prev' | 'next') => {
    if (!images.length) return;
    const offset = direction === 'prev' ? -1 : 1;
    const newIndex = (currentIndex + offset + images.length) % images.length;
    onImageSelect(images[newIndex]);
  };

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 aspect-square flex items-center justify-center rounded-lg">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  const mainImage = selectedImage || images[0] || {};
  const hasMultipleImages = images.length > 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image with Navigation */}
      <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-50">
        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={() => handleArrowClick('prev')}
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => handleArrowClick('next')}
              onMouseDown={(e) => e.preventDefault()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Main Image */}
        <div 
          className="w-full h-full"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            data={mainImage}
            alt={mainImage.altText || 'Product image'}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={{
              transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
            }}
            loading="eager"
            width={mainImage.width ? Number(mainImage.width) : 800}
            height={mainImage.height ? Number(mainImage.height) : 800}
          />
        </div>
      </div>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.map((image, index) => {
            const isActive = mainImage.id === image.id;
            
            return (
              <button
                key={image.id}
                onClick={() => handleThumbClick(image)}
                className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                  isActive ? 'border-primary' : 'border-transparent hover:border-gray-300'
                }`}
                aria-label={`View ${image.altText || 'product image'}`}
                aria-current={isActive ? 'true' : 'false'}
              >
                <Image
                  data={image}
                  alt={image.altText || `Product thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  width={120}
                  height={120}
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;