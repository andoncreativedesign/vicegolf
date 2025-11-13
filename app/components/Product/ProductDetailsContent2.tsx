import type { ProductContent2Section } from "~/lib/sanity/products";

interface ProductContent2Props {
  content: ProductContent2Section;
}

const ProductDetailsContent2 = ({ content }: ProductContent2Props) => {

  return (
    <div className="text-center mb-12" >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center max-w-6xl mx-auto mt-8 px-4">
        {/* Left: Outer Mantle */}
        <div className="text-right lg:text-base xl:text-lg space-y-3 p-6">
          <h2 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
            {content?.contentItems?.[0]?.title}
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-xs ml-auto">
            {content?.contentItems?.[0]?.description}
          </p>
        </div>
        {/* Center: Image */}
        <div className="relative group flex justify-center">
          <img
            src={content?.images?.[0]?.asset?.url}
            alt={content?.images?.[0]?.alt}
            className="w-full max-w-sm lg:max-w-md object-contain"
          />
        </div>
        
      </div>
    </div >
  )
}

export default ProductDetailsContent2