// app/components/ProductRating.tsx
import type { ComponentProps } from 'react';
import { Star } from 'lucide-react';

type Props = ComponentProps<'div'> & {
  rating: number;
  reviewCount: number;
};

export function ProductRating({ rating, reviewCount, ...props }: Props) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.round(rating);
    return (
      <Star
        key={i}
        size={18}
        className={filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    );
  });

  return (
    <div
      className="flex items-center gap-2 text-sm text-gray-700"
      {...props}
    >
      <span className="flex items-center">{stars}</span>
      <span className="font-semibold text-base">{rating.toFixed(1)}</span>
      <a
        href="#reviews"
        className="text-gray-500 underline hover:text-gray-700"
      >
        ({reviewCount})
      </a>
    </div>
  );
}
