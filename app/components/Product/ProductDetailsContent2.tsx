import type { ProductContent2Section } from "~/lib/sanity/products";

interface ProductContent2Props {
  content: ProductContent2Section;
  index: number;
}

const ProductDetailsContent2 = ({ content, index }: ProductContent2Props) => {
  const isTextOnRight = index % 2 === 0; // Even indices (0, 2, 4...) will have text on right, odd on left

  return (
    <div className="w-full py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          {/* Left Text Section - Only shown on even indices */}
          {isTextOnRight && (
            <div className="lg:px-4 order-2 lg:order-1">
              <div className="space-y-4 text-center lg:text-right">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {content?.contentItems?.[0]?.title}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0 lg:ml-auto">
                  {content?.contentItems?.[0]?.description}
                </p>
              </div>
            </div>
          )}

          {/* Image Section - Always in the center */}
          <div className="order-1 lg:order-2">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <img
                src={content?.images?.[0]?.asset?.url}
                alt={content?.images?.[0]?.alt || 'Product image'}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Text Section - Only shown on odd indices */}
          {!isTextOnRight && (
            <div className="lg:px-4 order-3">
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {content?.contentItems?.[0]?.title}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0">
                  {content?.contentItems?.[0]?.description}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ProductDetailsContent2