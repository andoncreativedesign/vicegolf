export function ProductGallerySkeleton({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none rounded-md overflow-hidden bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 ${className}`}
    >
      <div className="absolute inset-0 bg-gray-200" />
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-white/100 to-transparent animate-[shimmer_2s_linear_infinite]" />
      </div>
    </div>
  );
}
