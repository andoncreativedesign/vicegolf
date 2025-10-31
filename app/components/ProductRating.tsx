// app/components/ProductRating.tsx
import type { ComponentProps } from 'react';
import { Star } from 'lucide-react';

type Props = ComponentProps<'div'> & {
  rating: number;
  reviewCount: number;
};

export function ProductRating({ rating, reviewCount, ...props }: Props) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating);
    const partial = i === Math.floor(rating) && rating % 1 > 0;
    
    return (
      <div key={i} className="relative">
        <Star
          size={20}
          className="text-gray-300"
        />
        {(filled || partial) && (
          <div 
            className={`absolute top-0 left-0 overflow-hidden ${
              partial ? `w-[${(rating % 1) * 100}%]` : 'w-full'
            }`}
          >
            <Star
              size={20}
              className="fill-amber-400 text-amber-400"
            />
          </div>
        )}
      </div>
    );
  });

  return (
    <div
      className="flex items-center gap-3"
      {...props}
    >
      <div className="flex items-center gap-1">{stars}</div>
      <span className="text-lg font-bold text-gray-900">{rating.toFixed(1)}</span>
      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
      <a
        href="#reviews"
        className="text-gray-600 hover:text-gray-900 font-medium text-base transition-colors underline decoration-gray-300 hover:decoration-gray-600"
      >
        {reviewCount.toLocaleString()} Reviews
      </a>
    </div>
  );
}