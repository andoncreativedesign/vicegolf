import {useState, useEffect} from 'react';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {ArrowLeft, ArrowRight} from 'lucide-react';

type ImageType = {
  id: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  __typename?: string;
};

type ProductImageProps = {
  image: ProductVariantFragment['image'];
  galleryImages?: ImageType[];
  onImageChange?: (image: ImageType) => void;
};

export function ProductImage({image, galleryImages = [], onImageChange}: ProductImageProps) {
  const [currentImage, setCurrentImage] = useState<ImageType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (image) {
      setCurrentImage(image);
      // Find the index of the current image in the gallery
      if (galleryImages.length > 0) {
        const index = galleryImages.findIndex(img => img.id === image.id);
        setCurrentIndex(index >= 0 ? index : 0);
      }
    }
  }, [image, galleryImages]);

  const navigateImage = (direction: 'prev' | 'next') => {
    if (galleryImages.length <= 1) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % galleryImages.length;
    } else {
      newIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    }
    
    const newImage = galleryImages[newIndex];
    setCurrentImage(newImage);
    setCurrentIndex(newIndex);
    onImageChange?.(newImage);
  };

  if (!currentImage) {
    return <div className="product-image" />;
  }

  return (
    <div className="product-image relative group">
      <Image
        alt={currentImage.altText || 'Product Image'}
        aspectRatio="1/1"
        data={currentImage}
        key={currentImage.id}
        sizes="(min-width: 45em) 50vw, 100vw"
        className="w-full h-full object-cover"
      />
      
      {galleryImages.length > 1 && (
        <>
          <button 
            onClick={() => navigateImage('prev')}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Previous image"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button 
            onClick={() => navigateImage('next')}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Next image"
          >
            <ArrowRight className="w-5 h-5 text-gray-800" />
          </button>
        </>
      )}
    </div>
  );
}
