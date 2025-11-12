import { useState } from 'react';
import { Image } from '@shopify/hydrogen';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ProductVariantFragment } from 'storefrontapi.generated';

type ImageType = NonNullable<ProductVariantFragment['image']>;
type ProductImageProps = {
  image: ImageType;
  galleryImages?: ImageType[];
  onImageChange?: (image: ImageType) => void;
};

export function ProductImage({ image, galleryImages = [], onImageChange }: ProductImageProps) {
  const [index, setIndex] = useState(
    galleryImages.findIndex((img) => img.id === image?.id) || 0
  );

  const handleNavigate = (dir: 'prev' | 'next') => {
    if (!galleryImages.length) return;
    const newIndex =
      dir === 'next'
        ? (index + 1) % galleryImages.length
        : (index - 1 + galleryImages.length) % galleryImages.length;
    setIndex(newIndex);
    onImageChange?.(galleryImages[newIndex]);
  };

  const currentImage = galleryImages[index] || image;

  return (
    <div className="relative group rounded-2xl overflow-hidden bg-white shadow-sm w-full max-w-[550px] mx-auto">
      <div className="relative pt-[100%] w-full">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <Image
            alt={currentImage.altText || 'Product Image'}
            data={currentImage}
            className="w-full h-full max-h-[600px] object-contain transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
            sizes="(min-width: 45em) 50vw, 100vw"
          />
        </div>
      </div>

      {galleryImages.length > 1 && (
        <>
          <button
            onClick={() => handleNavigate('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => handleNavigate('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
          >
            <ArrowRight className="w-5 h-5 text-gray-700" />
          </button>
        </>
      )}
    </div>
  );
}
