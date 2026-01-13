export function ProductCardSkeleton({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div className={`group relative flex flex-col h-full bg-[#fafafa] rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${className}`}>
      {/* Image section */}
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full bg-[#f6f6f6] overflow-hidden aspect-square transition-transform duration-300 hover:scale-105">
          <div className="absolute inset-0 pointer-events-none rounded-md overflow-hidden bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200">
            <div className="absolute inset-0 bg-gray-200 transition-opacity duration-500" />
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-white/100 to-transparent animate-[shimmer_2s_linear_infinite]" />
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-col flex-1 px-5 pb-5 pt-4 space-y-3">
        {/* Title skeleton */}
        <div className="relative">
          <div className="h-7 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-7 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>

        {/* Product type skeleton */}
        <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>

        {/* Variants skeleton */}
        <div className="pt-3">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Price skeleton */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <div className="flex items-center space-x-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-12"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
