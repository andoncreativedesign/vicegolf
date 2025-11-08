import {useState, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductImage} from './ProductImage';
import './ProductGallery.css';

type ImageType = {
  id: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  __typename?: string;
};

type ProductGalleryProps = {
  images: ImageType[];
  selectedImage?: ImageType | null;
  onImageSelect?: (image: ImageType) => void;
};

export function ProductGallery({
  images,
  selectedImage: initialSelectedImage,
  onImageSelect: externalOnImageSelect,
}: ProductGalleryProps) {
  if (!images?.length && !initialSelectedImage) return null;

  const fixedExcludedId = initialSelectedImage?.id || images?.[0]?.id;
  const galleryThumbs = images.filter((img) => img.id !== fixedExcludedId);

  const shouldPrepend = !!initialSelectedImage && !images.some((img) => img.id === initialSelectedImage.id);
  const fullImagesForNav = shouldPrepend ? [initialSelectedImage, ...images] : images;

  const [selectedImage, setSelectedImage] = useState<ImageType | null>(
    initialSelectedImage || (images?.[0] || null),
  );

  // Update selectedImage when initialSelectedImage changes
  useEffect(() => {
    if (initialSelectedImage) {
      setSelectedImage(initialSelectedImage);
    } else if (images?.[0]) {
      setSelectedImage(images[0]);
    } else {
      setSelectedImage(null);
    }
  }, [initialSelectedImage, images]);

  const handleImageSelect = (image: ImageType) => {
    setSelectedImage(image);
    externalOnImageSelect?.(image);
  };

  const thumbnailImages = galleryThumbs;

  return (
    <div className="product-gallery flex flex-col md:flex-row gap-4">
      {thumbnailImages.length > 0 && (
        <div className="thumbnail-container flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible md:overflow-y-auto md:max-h-[600px] md:w-20">
          {thumbnailImages.map((image) => (
            <button
              key={image.id}
              className={`thumbnail-image flex-shrink-0 w-16 h-16 md:w-full md:h-auto ${
                selectedImage?.id === image.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleImageSelect(image)}
            >
              <Image
                data={image}
                alt={image.altText || 'Product thumbnail'}
                aspectRatio="1/1"
                className="w-full h-full object-cover rounded"
                sizes="(min-width: 64em) 12.5vw, 25vw"
              />
            </button>
          ))}
        </div>
      )}
      <div className="main-image flex-1">
        <ProductImage
          image={selectedImage!}
          galleryImages={fullImagesForNav}
          onImageChange={handleImageSelect}
        />
      </div>
    </div>
  );
}