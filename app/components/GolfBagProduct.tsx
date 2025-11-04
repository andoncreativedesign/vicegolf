import type {ProductFragment} from 'storefrontapi.generated';

const ProductSummaryGolfBag = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">


    <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
        {/* Content section - right side */}
        <div className="w-full lg:w-[50%] flex items-center">
          <div className="w-full space-y-4 lg:space-y-6 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">Light on Weight. Big on Function.</h3>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Weighing just 2.5 kg, the Vice Aero Carry Bag is built for golfers who like to walk. A padded strap and quick-deploy stand let you move effortlessly from tee to green, while a stable base ensures your bag stays put, even on uneven lies
            </p>
          </div>
        </div>
             {/* Image section - left side */}
        <div className="w-full lg:w-[50%] max-w-xl">
          <div className="relative pb-[90%] rounded-lg overflow-hidden">
            <img 
              src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/Vice-Golf-Carry-Bag-Slider01.jpg?v=1747656736?width=1600&quality=80" 
              alt="Vice Golf Stand Bag"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>


      </div>

      
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
        {/* Image section - left side */}
        <div className="w-full lg:w-[50%] max-w-xl">
          <div className="relative pb-[90%] rounded-lg overflow-hidden">
            <img 
              src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/Vice-Golf-Carry-Bag-Slider08.jpg?v=1747656738?width=1600&quality=80" 
              alt="Vice Golf Stand Bag"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        

        {/* Content section - right side */}
        <div className="w-full lg:w-[50%] flex items-center">
          <div className="w-full space-y-4 lg:space-y-6 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">Compact Design. Complete Storage.</h3>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Seven (7) smart pockets give you room for everything without weighing you down. From a full-length garment pocket to a soft-lined valuables sleeve and cooler space for mid-round refreshments, this bag keeps you organized without overcomplicating the carry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

type GolfBagProductProps = {
  product: ProductFragment;
  selectedVariant: any; // Consider creating a proper type for variant
};

export function GolfBagProduct({product, selectedVariant}: GolfBagProductProps) {
  return (
    <div className="golf-bag-product">
      <ProductSummaryGolfBag />
    </div>
  );
}
