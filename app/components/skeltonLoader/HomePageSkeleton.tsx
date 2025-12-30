import { HeroSectionSkeleton } from './HeroSectionSkeleton';
import { ProductGridSkeleton } from './ProductGridSkeleton';

export function HomePageSkeleton() {
  return (
    <div className="container mx-auto px-4">
      <HeroSectionSkeleton />
      <div className="my-12">
        <ProductGridSkeleton count={4} />
      </div>
      <div className="my-12">
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}