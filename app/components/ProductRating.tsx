// app/components/ProductRating.tsx
import type { ComponentProps } from 'react';

type Props = ComponentProps<'div'> & {
  rating: number;
  reviewCount: number;
};

export function ProductRating({ rating, reviewCount, ...props }: Props) {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>
      ★
    </span>
  ));

  return (
    <div className="product-rating" {...props}>
      <span className="stars">{stars}</span>
      <span className="rating-text">({reviewCount} reviews)</span>
    </div>
  );
}