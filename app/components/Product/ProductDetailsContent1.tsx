import { Image } from "@shopify/hydrogen";
import type { ProductContent1Item } from "~/lib/sanity/products";

interface ProductContent1Props {
  content: ProductContent1Item;
  showImageLeft?: boolean;
  isTextFull?: boolean;
  isImageFull?: boolean;
  isDescriptionFull?: boolean;
  isFirst?: boolean;
  imageSize?: 'small' | 'medium' | 'large' | 'xlarge';
  titleClassName?: string;
  descriptionClassName?: string;
}

const ProductDetailsContent1 = ({
  content,
  showImageLeft = false,
  isTextFull = false,
  isImageFull = false,
  isDescriptionFull = false,
  isFirst = false,
  imageSize = 'medium',
  titleClassName = '',
  descriptionClassName = ''
}: ProductContent1Props) => {
  const imageSection = (
    <div className={`flex items-center justify-center ${isImageFull || isFirst ? 'w-full' : ''} ${showImageLeft ? 'lg:justify-end' : 'lg:justify-start'} order-1 ${showImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
      <div className={`relative group ${isFirst ? 'w-full' : ''} ${isFirst ? 'max-h-[80vh] overflow-hidden' : ''}`}>
        {content?.images?.[0]?.asset?.url && (
          <img
            src={content.images[0].asset.url}
            alt={content.title || 'Product image'}
            className={`${isImageFull || isFirst ? 'w-full' : 'w-full'} ${isFirst ? 'max-w-none' : ''} ${!isImageFull && !isFirst && imageSize === 'small' ? 'max-w-xs lg:max-w-sm' :
              !isImageFull && !isFirst && imageSize === 'medium' ? 'max-w-md lg:max-w-lg' :
                !isImageFull && !isFirst && imageSize === 'large' ? 'max-w-xl lg:max-w-2xl' :
                  !isImageFull && !isFirst && imageSize === 'xlarge' ? 'max-w-2xl lg:max-w-4xl' :
                    ''
              } ${isFirst ? 'h-auto max-h-[80vh] object-cover object-center' : 'object-contain'}`}
          />
        )}
      </div>
    </div>
  );

  const textSection = (
    <div className={`space-y-4 ${isTextFull ? 'w-full flex flex-col items-center' : 'flex flex-col justify-center h-full w-full pr-0'} text-center lg:text-left order-2 ${showImageLeft ? 'lg:order-2' : 'lg:order-1'} ${isFirst ? 'mt-6' : ''}`}>
      <div className={`${isTextFull ? 'w-full max-w-4xl' : 'w-full'}`}>
        {content.title && (
          <h3 className={`text-2xl lg:text-3xl font-semibold ${titleClassName || 'text-main-900'} ${isTextFull ? 'text-center' : 'text-center lg:text-left'}`}>
            {content.title}
          </h3>
        )}
      </div>
      {content.description && (
        <p className={`!text-lg !lg:text-xl leading-relaxed font-light text-gray-500 ${isDescriptionFull ? 'w-full text-center' : (isTextFull ? 'max-w-4xl text-center' : 'text-center lg:text-left w-full')} mx-0 mb-3 mt-1 ${descriptionClassName}`}>
          {content.description}
        </p>
      )}
      {content.points && content.points.length > 0 && (
        <ul className={`space-y-2 ${isTextFull ? 'max-w-2xl text-start' : 'max-w-md'} mx-auto lg:mx-0`}>
          {content.points.map((point, index) => (
            <li key={index} className="flex items-start group">
              <span className="text-green-500 mr-4 mt-1 transform group-hover:scale-110 transition-transform shrink-0">
                ✓
              </span>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors flex-1 font-normal text-base">
                {point}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // If no images, only show text section
  if (!content?.images?.length) {
    return (
      <div className="w-full flex justify-center items-center">
        {textSection}
      </div>
    );
  }

  // Show layout with images and text
  return (
    <div className={`grid ${isTextFull || isImageFull ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} ${isFirst ? 'gap-8 lg:gap-10' : 'gap-6 lg:gap-8'} items-center justify-center mb-1 lg:mb-2`}>
      {showImageLeft ? (
        <>
          {imageSection}
          {textSection}
        </>
      ) : (
        <>
          {textSection}
          {imageSection}
        </>
      )}
    </div>
  )
}

export default ProductDetailsContent1