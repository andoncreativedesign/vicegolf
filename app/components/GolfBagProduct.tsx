import type { ProductFragment } from "storefrontapi.generated";
import { FeatureCard } from "./FeatureCard";
const features = [
  {
    title: "Vice Aero Carry Bag",
    price: "$169.99",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0563/0227/2645/files/Vice-Golf-Black-Drip-Bag-Slider.jpg?v=1762199988&width=600&height=600&crop=center",
    specifications: [
      "Type: Carry/Stand Bag",
      "Weight: 5.51 lbs / 2.5kg",
      "Strap: Double",
      "Dividers: 5",
      "Pockets: 7",
      "Top Diameter: 8.5\" x 7\"",
      "Dimensions: 13 x 8.5 x 35.5\"",
    ],
    link: "/products/vice-aero-carry-bag",
  },
  {
    title: "Vice Vibe Carry Bag",
    price: "$199.99",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0563/0227/2645/files/Vice-Golf-Aero-Carry-Bag-TH.png?v=1762199989&width=1200&height=1200&crop=center",
    specifications: [
      "Type: Carry/Stand Bag",
      "Weight: 7.28 lbs / 3.3kg",
      "Strap: Double",
      "Dividers: 5",
      "Pockets: 6",
      "Top Diameter: 8.5\" x 7\"",
      "Dimensions: 14.5 x 9 x 36\"",
    ],
    link: "/products/vice-vibe-carry-bag",
  },
  {
    title: "Vice Cart Bag",
    price: "$299.99",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0563/0227/2645/files/vice-golf-cart-bag-Black-White-TH.jpg?v=1762199444&width=1000&height=1000&crop=center",
    specifications: [
      "Type: Cart Bag",
      "Weight: 9.48 lbs / 4.3kg",
      "Strap: Single",
      "Dividers: 14",
      "Pockets: 8",
      "Top Diameter: 12\" x 10.5\"",
      "Dimensions: 15 x 11.5 x 36\"",
    ],
    link: "/products/vice-cart-bag",
  },
];

const ProductSummaryGolfBag = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section 1 */}
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
        {/* Text */}
        <div className="w-full lg:w-[50%] flex items-center">
          <div className="w-full space-y-4 lg:space-y-6 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Light on Weight. Big on Function.
            </h3>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Weighing just 2.5 kg, the Vice Aero Carry Bag is built for golfers
              who like to walk. A padded strap and quick-deploy stand let you
              move effortlessly from tee to green, while a stable base ensures
              your bag stays put, even on uneven lies.
            </p>
          </div>
        </div>
        {/* Image */}
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

      {/* Section 2 */}
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 mt-16">
        {/* Image */}
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

        {/* Text */}
        <div className="w-full lg:w-[50%] flex items-center">
          <div className="w-full space-y-4 lg:space-y-6 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Compact Design. Complete Storage.
            </h3>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Seven (7) smart pockets give you room for everything without
              weighing you down. From a full-length garment pocket to a
              soft-lined valuables sleeve and cooler space for mid-round
              refreshments, this bag keeps you organized without
              overcomplicating the carry.
            </p>
          </div>
        </div>
      </div>

      {/* Product Cards */}
      <div className="my-16">
        <div className="text-center mb-10 max-w-4xl mx-auto">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Compare Our Bags</h3>
          <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">To see which one is best for your game</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              price={feature.price}
              imageUrl=
              {feature.imageUrl}
              specifications={feature.specifications}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

type GolfBagProductProps = {
  product: ProductFragment;
  selectedVariant: any;
};

export function GolfBagProduct({
  product,
  selectedVariant,
}: GolfBagProductProps) {
  return (
    <div className="golf-bag-product">
      <ProductSummaryGolfBag />
    </div>
  );
}
