import { useEffect } from 'react';
import { Link } from 'react-router';
import type { ClubVariant } from '~/lib/shopify/product-queries';

interface HandOrientationProps {
  clubVariants: ClubVariant[];
  currentProductId: string;
}

const HandOrientation = ({ clubVariants, currentProductId }: HandOrientationProps) => {
  if (!clubVariants?.length) return null;

  // Get all unique orientation values
  const orientationOptions = Array.from(
    new Set(
      clubVariants
        .map(v => v.node.club_hand_orientation?.value)
        .filter(Boolean)
        .sort()
    )
  );

  // If no specific orientations found, use left/right
  if (orientationOptions.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Hand Orientation</h3>
        <div className="flex flex-wrap gap-3">
          {clubVariants.map((variant) => {
            const isCurrent = variant.node.id === currentProductId;
            const isLeftHanded =
              variant.node.title.toLowerCase().includes('left') ||
              variant.node.title.toLowerCase().includes('lh');
            const orientation = isLeftHanded ? 'Left Handed' : 'Right Handed';

            return (
              <Link
                key={variant.node.id}
                to={`/products/${variant.node.handle}`}
                className={`px-4 py-2 border rounded-md text-center ${isCurrent
                    ? 'border-black'
                    : 'border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {orientation} 
              </Link>
              
            );
          })}
        </div>
      </div>
    );
  }

  // Group variants by orientation
  const variantsByOrientation = orientationOptions.map(orientation => ({
    orientation,
    variants: clubVariants.filter(variant =>
      variant.node.club_hand_orientation?.value === orientation || "test"
    )
  }));


  useEffect(() => {
    variantsByOrientation.map(({ orientation, variants }) => {
      const currentVariant = variants.find(v => v.node.id === currentProductId);
    })
  },[])


  return (
    <div className="">
      <h3 className="font-medium mb-4">Hand Orientation</h3>
      <div className="flex flex-wrap gap-3">
        {variantsByOrientation.map(({ orientation, variants }) => {
          const variantForOrientation = variants.find(
            item => item.node.club_hand_orientation?.value === orientation
          );
          const isCurrent = variantForOrientation?.node.id === currentProductId;
          const variantHandle = variantForOrientation?.node.handle;
          if (!variantHandle) return null;
          return (
            <Link
              key={orientation}
              to={`/products/${encodeURIComponent(variantHandle)}`}
              className={`product-options-item relative rounded-xs overflow-hidden transition-all duration-300 
                ${isCurrent ? 'ring-2 ring-black ring-offset-2' : 'ring-1 ring-gray-200'}`}
              style={{textDecoration:'none'}}
            >
              {orientation}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HandOrientation;