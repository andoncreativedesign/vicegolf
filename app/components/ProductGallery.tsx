import {Image} from '@shopify/hydrogen';
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
  selectedImage,
  onImageSelect,
}: ProductGalleryProps) {
  if (!images?.length) return null;

  const mainImage = selectedImage || images[0];
  const thumbnailImages = images.filter((img) => img.id !== mainImage.id);

  return (
    <div className="product-gallery flex">
      {thumbnailImages.length > 0 && (
        <div className="thumbnail-container mr-4">
          {thumbnailImages.map((image) => (
            <button
              key={image.id}
              className={`thumbnail-image ${selectedImage?.id === image.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => onImageSelect?.(image)}
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
      <div className="main-image">
        <Image
          data={mainImage}
          alt={mainImage.altText || 'Product Image'}
          aspectRatio="1/1"
          className="w-full h-auto rounded-lg"
          sizes="(min-width: 64em) 50vw, 100vw"
        />
      </div>
    </div>
  );
}
