interface ProductDetailsContentSkeletonProps {
  showImageLeft?: boolean;
  isTextFull?: boolean;
  isImageFull?: boolean;
  isDescriptionFull?: boolean;
  isFirst?: boolean;
  isSecond?: boolean;
  isThird?: boolean;
  isSquareAspect?: boolean;
  imageSize?: 'small' | 'medium' | 'large' | 'xlarge';
  titleContainerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  pointsClassName?: string;
  imageContainerClassName?: string;
  imageInnerContainerClassName?: string;
  imageClassName?: string;
  imageCentered?: boolean;
  imageObjectFit?: 'cover' | 'contain' | 'none' | 'scale-down';
  // Enhanced props for comprehensive product support
  descriptionType?: 'normal' | 'subDescriptions';
  showPoints?: boolean;
  pointCount?: number;
  descriptionLineCount?: number;
  showImage?: boolean;
  minHeight?: string;
}

export function ProductDetailContentSkeleton({
  showImageLeft = false,
  isTextFull = false,
  isImageFull = false,
  isDescriptionFull = false,
  isFirst = false,
  isSecond = false,
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
  imageObjectFit = 'cover',
  // Enhanced props
  descriptionType = 'normal',
  showPoints = true,
  pointCount = 3,
  descriptionLineCount = 3,
  showImage = true,
  minHeight = 'h-64 lg:h-80'
}: ProductDetailsContentSkeletonProps) {

  // Image Section Component
  const ImageSection = () => (
    <div className={`flex items-center justify-center w-full ${imageCentered ? 'lg:justify-center' : (showImageLeft ? 'lg:justify-end' : 'lg:justify-start')} order-1 ${showImageLeft ? 'lg:order-1' : 'lg:order-2'} ${imageContainerClassName}`}>
      <div className={`relative group w-full ${isSquareAspect ? 'aspect-square max-w-[1000px] w-full mx-auto' : ''} ${isImageFull ? 'max-w-full' : ''}`}>
        <div className={`w-full h-full ${imageInnerContainerClassName} ${isSquareAspect ? 'aspect-square' : minHeight} bg-gray-200 rounded-lg animate-pulse relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gray-200 transition-opacity duration-500" />
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-white/100 to-transparent animate-[shimmer_2s_linear_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Title Section Component
  const TitleSection = () => (
    <div className={`${isTextFull || isThird ? 'w-full max-w-4xl' : 'w-full'}`}>
      <div className={`${isThird ? 'w-full flex justify-center' : ''} ${titleContainerClassName}`}>
        <div className={`lg:text-[48px] text-[32px] font-semibold w-full ${titleClassName || (isThird ? 'text-4xl lg:text-5xl font-bold' : 'text-2xl lg:text-3xl font-semibold')} ${isTextFull || isThird ? 'text-center' : 'text-center lg:text-left'} h-12 lg:h-14 bg-gray-200 rounded animate-pulse relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_linear_infinite]" />
        </div>
      </div>
    </div>
  );

  // Description Section Component
  const DescriptionSection = () => (
    <div className={`${isThird ? 'w-full flex justify-center' : ''}`}>
      <div className={`${isDescriptionFull || isThird ? 'w-full text-center' : (isTextFull ? 'max-w-4xl text-center' : 'text-center lg:text-left w-full')} ${descriptionClassName || '!text-xl font-light'} ${descriptionClassName ? '' : 'text-gray-600'} leading-relaxed mx-0 mb-3 mt-1`}>
        {descriptionType === 'subDescriptions' ? (
          // SubDescription layout
          <div className="space-y-4 mt-4">
            {Array.from({ length: 2 }).map((_, subIndex) => (
              <div key={subIndex} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_linear_infinite]" />
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_linear_infinite]" />
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_linear_infinite]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Normal description layout
          <div className="space-y-2">
            {Array.from({ length: descriptionLineCount }).map((_, lineIndex) => (
              <div key={lineIndex} className="h-4 bg-gray-200 rounded animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_linear_infinite]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Points Section Component
  const PointsSection = () => (
    <div className={`w-[95%] max-w-[95%] mx-auto ${pointsClassName}`}>
      <div className={`space-y-3 w-full ${isTextFull ? 'text-start' : 'text-center lg:text-left'}`}>
        {Array.from({ length: pointCount }).map((_, index) => (
          <div key={index} className="flex items-start text-base text-gray-600 leading-relaxed font-normal">
            <span className="text-gray-600 mr-1.5 mt-0.5 w-2 h-2 bg-gray-200 rounded-full animate-pulse"></span>
            <div className="h-4 bg-gray-200 rounded animate-pulse flex-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_linear_infinite]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Text Section Component
  const TextSection = () => (
    <div className={`space-y-4 ${isTextFull || isThird ? 'w-full flex flex-col items-center' : 'flex flex-col justify-center h-full w-full pr-0'} text-center lg:text-left order-2 ${showImageLeft ? 'lg:order-2' : 'lg:order-1'} ${isFirst ? 'mt-6' : ''}`}>
      <TitleSection />
      <DescriptionSection />
      {showPoints && <PointsSection />}
    </div>
  );

  // If no images, only show text section
  if (!showImage) {
    return (
      <div className="w-full flex justify-center items-center">
        <TextSection />
      </div>
    );
  }

  // Show layout with images and text
  return (
    <div className={`grid ${isTextFull || isImageFull ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} ${isFirst ? 'gap-8 lg:gap-10' : 'gap-6 lg:gap-8'} items-center justify-center`}>
      {showImageLeft ? (
        <>
          <ImageSection />
          <TextSection />
        </>
      ) : (
        <>
          <TextSection />
          <ImageSection />
        </>
      )}
    </div>
  );
}


