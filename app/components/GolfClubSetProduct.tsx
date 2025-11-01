import type {ProductFragment} from 'storefrontapi.generated';

type GolfClubSetProductProps = {
  product: ProductFragment;
};

export function GolfClubSetProduct({product}: GolfClubSetProductProps) {
  return (
    <div className="golf-club-set-product mt-12">
      <h2 className="text-2xl font-bold mb-6">About This Club Set</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold mb-3">Specifications</h3>
          <ul className="space-y-2">
            <li>• Complete set for all skill levels</li>
            <li>• Premium materials and construction</li>
            <li>• Designed for maximum performance</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">What's Included</h3>
          <ul className="space-y-2">
            <li>• Complete set of clubs</li>
            <li>• Premium headcovers</li>
            <li>• 1-year manufacturer warranty</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
