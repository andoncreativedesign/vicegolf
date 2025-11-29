import type { ProductContent2Section } from "~/lib/sanity/products";

interface ProductContent2Props {
  content: ProductContent2Section;
  index: number;
}

const ProductDetailsContent2 = ({ content, index }: ProductContent2Props) => {
  const isTextOnRight = index % 2 === 0; // Even indices (0, 2, 4...) will have text on right, odd on left

  return (
    <div className="text-center mb-12 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center max-w-6xl mx-auto mt-8 px-4">
        {/* Text Section - Left or Right based on index */}
        <div className={`lg:text-base xl:text-lg space-y-2 p-6 ${isTextOnRight ? 'order-3 text-left' : 'order-1 text-right'}`}>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-main-900 leading-tight mb-2">
            {content?.contentItems?.[0]?.title}
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-xs">
            {content?.contentItems?.[0]?.description}
          </p>
        </div>

        {/* Image Section - Always in the middle */}
        <div className="relative group flex justify-center order-2 w-3/4 mx-auto">
          <img
            src={content?.images?.[0]?.asset?.url}
            alt={content?.images?.[0]?.alt}
            className="w-full max-w-xs object-contain"
          />
        </div>

        {/* Empty div to maintain grid structure */}
        <div className={isTextOnRight ? 'order-1' : 'order-3'}></div>
      </div>
    </div >
  )
}

export default ProductDetailsContent2