import type {ProductFragment} from 'storefrontapi.generated';

const ProductSummaryShoes = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
        {/* Image section - left side */}
        <div className="w-full lg:w-[50%] max-w-xl">
          <div className="relative pb-[90%] rounded-lg overflow-hidden">
            <img 
              src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/Vice-Golf-Verve-Lifestyle-Shoe-Body02.jpg?v=1725487433?width=1600&quality=80" 
              alt="Vice Golf Verve Lifestyle Shoe"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Content section - right side */}
        <div className="w-full lg:w-[50%] flex items-center">
          <div className="w-full space-y-4 lg:space-y-6 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">Supporting You Every Step Of The Way</h3>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0">
              With advanced cushioning, durable "Action Leather," and a sleek design, the Vice Verve shoe offers unmatched comfort and style. Plus, with a unique pattern and heel-toe relief, the sole is specifically enhanced to improve balance and stability throughout your swing for optimal performance.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col w-full gap-6 mt-12">  
        {/* Image - under description, full width */}
        <div className="w-full rounded-lg overflow-hidden bg-black">
          <img 
            src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/Vice-Golf-Verve-Lifestyle-Shoe-Body01_49bd4262-6300-448d-8938-eaa352bfabd5.jpg?v=1726224084?width=1600&quality=80" 
            alt="Golf Shoe Details"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
          {/* Heading - centered */}
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mx-auto">
          Step Beyond
        </h3>
        
        {/* Description - left-aligned, full width */}
        <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed text-left w-full">
Experience unparalleled versatility with the Vice Golf Verve sneaker. Engineered for golfers who demand style and performance, this shoe excels both on the course and in everyday settings so you can step beyond the fairways, and onto the streets.        </p>
      </div>
    </div>
  );
};

type ShoesProductProps = {
  product: ProductFragment;
};

export function ShoesProduct({product}: ShoesProductProps) {
  return (
    <div className="shoes-product">
      <ProductSummaryShoes />
    </div>
  );
}
