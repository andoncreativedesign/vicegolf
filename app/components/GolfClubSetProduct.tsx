import type {ProductFragment} from 'storefrontapi.generated';

const ProductSummaryGolfClub = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
        {/* Image section - left side */}
        <div className="w-full lg:w-[50%] max-w-xl">
          <div className="relative pb-[90%] rounded-lg overflow-hidden">
            <img 
              src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/Palm-Tree-Starter-Set-greener_FINAL_1.jpg?v=1741972122?width=1600&quality=80" 
              alt="Vice Boost Golf Club Set"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Content section - right side */}
        <div className="w-full lg:w-[50%] flex items-center">
          <div className="w-full space-y-4 lg:space-y-6 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">Beyond Your Average Starter Set</h3>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Built to last and adapt as your game improves, the Vice Boost intro set is a step above traditional beginner sets and offers premium feel, without the premium price. The Vice Boost set will stay with you for much longer than your average package sets, and grow from a beginner set to your favorite set as your game develops
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

type GolfClubSetProductProps = {
  product: ProductFragment;
};

export function GolfClubSetProduct({product}: GolfClubSetProductProps) {
  return (
    <div className="golf-club-set-product">
      <ProductSummaryGolfClub />
    </div>
  );
}
