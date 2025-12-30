export function HeroSectionSkeleton() {
  return (
    <div className="relative w-full h-[500px] bg-gray-100 animate-pulse rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-8 max-w-3xl w-full">
          <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
          <div className="h-12 w-48 bg-gray-200 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
}