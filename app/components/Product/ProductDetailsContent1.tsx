import { Image } from "@shopify/hydrogen";
import type { ProductContent1Item } from "~/lib/sanity/products";

interface ProductContent1Props {
  content: ProductContent1Item;
  showImageLeft: boolean;
}

const ProductDetailsContent1 = ({ content, showImageLeft = false }: ProductContent1Props) => {
  const imageSection = (
    <div className={`flex justify-center ${showImageLeft ? 'lg:justify-end' : 'lg:justify-start'} order-1 ${showImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
      <div className="relative group">
        {content?.images?.[0]?.asset?.url && (
          <img
            src={content.images[0].asset.url}
            alt={content.title || 'Product image'}
            className="w-full max-w-md lg:max-w-lg object-contain"
          />
        )}
      </div>
    </div>
  );

  const textSection = (
    <div className={`space-y-8 text-center lg:text-left order-2 ${showImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
      <div className="space-y-4">
        {content.title && (
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            {content.title}
          </h3>
        )}
      </div>
      {content.description && (
        <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0">
          {content.description}
        </p>
      )}
      {content.points && content.points.length > 0 && (
        <ul className="space-y-4 text-lg lg:text-xl max-w-md mx-auto lg:mx-0">
          {content.points.map((point, index) => (
            <li key={index} className="flex items-start group">
              <span className="text-green-500 font-bold mr-4 mt-1 transform group-hover:scale-110 transition-transform shrink-0">
                ✓
              </span>
              <span className="text-gray-800 group-hover:text-gray-900 transition-colors flex-1">
                {point}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // If no images, only show text section centered
  if (!content?.images?.length) {
    return (
      <div className="flex justify-center items-center min-h-[30vh] mb-2 lg:mb-4">
        <div className="text-center max-w-3xl px-4">
          {content.title && (
            <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6">
              {content.title}
            </h3>
          )}
          {content.description && (
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">
              {content.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  // If there are images, show the normal layout
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-2 lg:mb-4">
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