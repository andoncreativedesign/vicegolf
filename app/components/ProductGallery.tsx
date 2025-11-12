import { useState, useEffect } from 'react';
import { Image } from '@shopify/hydrogen';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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

  useEffect(() => {
    if (!selectedImage) return;
    const index = images.findIndex((img) => img.id === selectedImage.id);
    if (index !== -1 && index !== currentIndex) setCurrentIndex(index);
  }, [selectedImage, images, currentIndex]);

  if (!images.length)
    return (
      <div className="bg-gray-100 aspect-square flex items-center justify-center rounded-xl">
        <span className="text-gray-400 text-sm">No images available</span>
      </div>
    );

  const mainImage = selectedImage || images[0];
  const hasMultiple = images.length > 1;

  const handleNavigate = (dir: 'prev' | 'next') => {
    if (!hasMultiple) return;
    const newIndex =
      dir === 'next'
        ? (currentIndex + 1) % images.length
        : (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    onImageSelect(images[newIndex]);
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start">
      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto scrollbar-hide md:w-24">
          {images.map((image) => {
            const isActive = mainImage.id === image.id;
            return (
              <button
                key={image.id}
                onClick={() => onImageSelect(image)}
                className={`relative flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  isActive
                    ? 'border-black shadow-md scale-[1.03]'
                    : 'border-transparent hover:border-gray-300'
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
      <div className="relative flex-1 group bg-white rounded-2xl shadow-sm overflow-hidden aspect-square flex items-center justify-center">
        <Image
          data={mainImage}
          alt={mainImage.altText || 'Product Image'}
          className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
          aspectRatio="1/1"
          sizes="(min-width: 45em) 50vw, 100vw"
        />

        {hasMultiple && (
          <>
            <button
              onClick={() => handleNavigate('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => handleNavigate('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            >
              <ArrowRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductGallery;
