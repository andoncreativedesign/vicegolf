import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useRouteLoaderData } from 'react-router';

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
  const rootData = useRouteLoaderData<any>('root');
  const [rating, setRating] =
    useState<Bottomline | null>(null);

  const [loading, setLoading] =
    useState(true);

  const appKey = rootData?.publicYotpoAppKey || '';

  useEffect(() => {
    async function fetchRating() {
      if (!appKey) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api-cdn.yotpo.com/v1/widget/${appKey}/products/${productId}/reviews.json?page=1&per_page=1`
        );

        const data = await response.json() as any;

        setRating(data?.response?.bottomline);
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
  }, [productId, appKey]);

  if (loading) {
    return (
      <div className="text-sm text-gray-400">
        Loading rating...
      </div>
    );
  }

  if (!rating || rating.total_review === 0) {
    return <div className="min-h-[24px]" />;
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
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = rating.average_score >= star;
          const isPartial = !isFull && rating.average_score > star - 1;
          const rawPercentage = (rating.average_score - (star - 1)) * 100;
          const fillPercentage = isPartial
            ? Math.round(rawPercentage / 10) * 11
            : 0;

          return (
            <div key={star} className="relative w-[22px] h-[22px]">
              {/* Background empty star */}
              <Star size={22} className="text-gray-300" />

              {/* Foreground colored star */}
              {(isFull || isPartial) && (
                <div
                  className="absolute top-0 left-0 overflow-hidden h-full"
                  style={{ width: isFull ? '100%' : `${fillPercentage}%` }}
                >
                  <Star size={22} className="fill-yellow-400 text-yellow-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <span className="text-md text-gray-500">
        ({rating.total_review})
      </span>
    </div>
  );
}