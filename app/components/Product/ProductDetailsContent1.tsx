import { Image } from "@shopify/hydrogen";
import type { ProductContent1Item } from "~/lib/sanity/products";

interface SubDescriptionItem {
  mainPoint: string;
  description: string;
  _key: string;
}

interface ProductContent1ItemWithDescriptionType extends ProductContent1Item {
  descriptionType?: 'normal' | 'subDescriptions';
  subDescriptions?: SubDescriptionItem[];
}

interface ProductContent1Props {
  content: ProductContent1ItemWithDescriptionType;
  showImageLeft?: boolean;
  isTextFull?: boolean;
  isImageFull?: boolean;
  isDescriptionFull?: boolean;
  isFirst?: boolean;
  isSecond?: boolean;
  isThird?: boolean;
  isSquareAspect?: boolean;
  imageSize?: 'small' | 'medium' | 'large' | 'xlarge';
  titleContainerClassName?: string,
  titleClassName?: string;
  descriptionClassName?: string;
  pointsClassName?: string;
  imageContainerClassName?: string;
  imageInnerContainerClassName?: string
  imageClassName?: string;
  imageCentered?: boolean;
  containerClassName?: string;
  contentContainerClassName?: string;
  imageObjectFit?: 'cover' | 'contain' | 'cover' | 'none' | 'scale-down'
}

const ProductDetailsContent1 = ({
  content,
  showImageLeft = false,
  isTextFull = false,
  isImageFull = false,
  isDescriptionFull = false,
  isFirst = false,
  isThird = false,
  isSquareAspect = false,
  imageSize = 'medium',
  titleContainerClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  pointsClassName = '',
  imageContainerClassName = '',
  imageInnerContainerClassName = '',
  imageClassName = '',
  imageCentered = false,
  containerClassName = '',
  contentContainerClassName = '',
  imageObjectFit = 'cover'
}: ProductContent1Props) => {
  const isGolfBallSecondSection = (descriptionClassName?.includes('bg-blue-100') || false);

  const imageSection = (
    <div className={`flex items-center justify-center ${isImageFull ? 'w-full' : 'w-full'} ${imageCentered ? 'lg:justify-center' : (showImageLeft ? 'lg:justify-end' : 'lg:justify-start')} order-1 ${showImageLeft ? 'lg:order-1' : 'lg:order-2'} ${imageContainerClassName}`}>
      <div className={`relative group w-full ${isSquareAspect ? 'aspect-square' : ''} ${isImageFull ? 'max-w-full' : ''}`}>
        {content?.images?.[0]?.asset?.url && (
          <div className={"w-full h-full " + imageInnerContainerClassName}>
            <img
              src={content.images[0].asset.url}
              alt={content.title || 'Product image'}
              className={`w-full h-full object-cover ${isImageFull ? 'max-w-full' : ''} 
                ${!isImageFull && imageSize === 'small' ? 'max-w-xs lg:max-w-sm' :
                  !isImageFull && imageSize === 'medium' ? 'max-w-md lg:max-w-lg' :
                    !isImageFull && imageSize === 'large' ? 'max-w-xl lg:max-w-2xl' :
                      !isImageFull && imageSize === 'xlarge' ? 'max-w-2xl lg:max-w-4xl' :
                        ''
                } 
                ${imageClassName}`}
              style={{ objectFit: imageObjectFit }}
            />
          </div>
        )}
      </div>
    </div>
  );

  const textSection = (
    <div className={`space-y-4 ${isTextFull || isThird ? 'w-full flex flex-col items-center' : 'flex flex-col justify-center h-full w-full pr-0'} text-center lg:text-left order-2 ${showImageLeft ? 'lg:order-2' : 'lg:order-1'} ${isFirst ? 'mt-6' : ''}`}>
      <div className={`${isTextFull || isThird ? 'w-full' : 'w-full'} ${contentContainerClassName}`}>
        {content.title && (
          <div className={`${isThird ? 'w-full flex justify-center' : ''} ${titleContainerClassName}`}>
            <h3 className={`lg:text-[48px] text-[32px] font-semibold w-full ${titleClassName || (isThird ? 'text-4xl lg:text-5xl font-bold' : 'text-2xl lg:text-3xl font-semibold')} ${isTextFull || isThird ? 'text-center' : 'text-center lg:text-left'}`}>
              {content.title}
            </h3>
          </div>
        )}
      </div>
      {content.descriptionType === 'subDescriptions' ? (
        <div className="w-full space-y-4 mt-4">
          {content.subDescriptions?.map((item) => (
            <div key={item._key} className="mb-4">
              <p className={`text-gray-600 leading-relaxed ${descriptionClassName || ''}`}>
                <span className="font-semibold text-gray-900">{item.mainPoint}: </span>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      ) : content.description ? (
        <div className={`${isThird ? 'w-full flex justify-center' : ''}`}>
          <p className={`${isDescriptionFull || isThird ? 'w-full text-center' : (isTextFull ? 'max-w-4xl text-center' : 'text-center lg:text-left w-full')} ${descriptionClassName || '!text-xl font-light'} ${descriptionClassName ? '' : 'text-gray-600'} leading-relaxed mx-0 mb-3 mt-1`}>
            {content.description}
          </p>
        </div>
      ) : null}
      {content.points && content.points.length > 0 && (
        <div className={`w-[95%] max-w-[95%] mx-auto ${pointsClassName}`}>
          <ul className={`space-y-3 w-full ${isTextFull ? 'text-start' : 'text-center lg:text-left'}`}>
            {content.points.map((point, index) => (
              <li key={index} className="flex items-start text-base text-gray-600 leading-relaxed font-normal">
                <span className="text-gray-600 mr-1.5 mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
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
    <div className={`grid ${isTextFull || isImageFull ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} ${isFirst ? 'gap-8 lg:gap-10' : 'gap-6 lg:gap-8'} items-center justify-center ${containerClassName}`}>
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