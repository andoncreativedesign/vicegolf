import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

type YotpoRatingProps = {
  productId: string;
};

type Bottomline = {
  average_score: number;
  total_review: number;
};

export function YotpoRating({
  productId,
}: YotpoRatingProps) {
  const [rating, setRating] =
    useState<Bottomline | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function fetchRating() {
      try {
        const APP_KEY =
          '1EU1bXsXSLoWFlPOIvXu2rVvbKELtHN0e8xPiPQb';

        const response = await fetch(
          `https://api-cdn.yotpo.com/v1/widget/${APP_KEY}/products/${productId}/reviews.json`
        );

        const data = await response.json();

        setRating(data.response.bottomline);
      } catch (error) {
        console.error(
          'Failed to fetch Yotpo rating',
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRating();
  }, [productId]);

  if (loading) {
    return (
      <div className="text-sm text-gray-400">
        Loading rating...
      </div>
    );
  }

  if (
    !rating ||
    rating.total_review === 0
  ) {
    return null;
  }

  const roundedRating = Math.round(
    rating.average_score
  );

  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-md">
        {rating.average_score.toFixed(1)}
      </span>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={22}
            className={
              star <= roundedRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }
          />
        ))}
      </div>

      <span className="text-md text-gray-500">
        ({rating.total_review})
      </span>
    </div>
  );
}