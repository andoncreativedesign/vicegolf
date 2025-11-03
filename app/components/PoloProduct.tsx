import type {ProductFragment} from 'storefrontapi.generated';

const ProductSummaryPolo = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
        {/* Image section - left side */}
        <div className="w-full lg:w-[50%] max-w-xl">
          <div className="relative pb-[90%] rounded-lg overflow-hidden">
            <img 
              src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/vice-golf-drip-polo-navy-body-image1.jpg?v=1751368007?width=1600&quality=80" 
              alt="Vice Golf Polo Shirt"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Content section - right side */}
        <div className="w-full lg:w-[50%] flex items-center">
          <div className="w-full space-y-4 lg:space-y-6 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">The Definitive Golf Polo</h3>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0">
The original performance-focused Vice Golf Polo is a staple of every golfer's wardrobe. Crafted to be the definitive golfing polo, it's specifically engineered with a premium fabric blend featuring sweat-wicking properties to keep you cool when the heat is on. Cut for the course, it provides optimal movement through each swing and is reinforced in high-stress areas to maintain the sleek look and keep you looking sharp if you decide to take things beyond the course.

            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

type PoloProductProps = {
  product: ProductFragment;
};

export function PoloProduct({product}: PoloProductProps) {
  return (
    <div className="polo-product">
      <ProductSummaryPolo />
    </div>
  );
}
