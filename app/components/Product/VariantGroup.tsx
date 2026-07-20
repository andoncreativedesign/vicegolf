import type { ProductFragment } from "storefrontapi.generated";
import type { UIColorVariant } from "~/lib/shopify/product-queries";
import { Link, useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from "react";

interface VariantGroupProps {
  productType?: string;
  colorVariants: UIColorVariant[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}

const VariantGroup = ({ productType, colorVariants, selectedVariant }: VariantGroupProps) => {
  const location = useLocation()
  const [variantStyle, setVariantStyle] = useState('w-18 h-18 rounded-md');
  const [selectedVariantHandle, setSelectedVariantHandle] = useState<string>('');

  useEffect(() => {
    if (productType === 'golf balls') {
      setVariantStyle('w-8 h-8 rounded-full')
    }
  }, [productType])

  // Add this effect to handle client-side selection
  useEffect(() => {
    if (location.pathname) {
      setSelectedVariantHandle(location.pathname.split('/').pop() || '');
    }
  }, [location.pathname]);

  const currentVariantHandle = location?.pathname?.split('/').pop();
  const currentVariant = colorVariants.find(v => v.handle === currentVariantHandle);

  // Identify the main variant (usually the one with no category, or explicitly 'Color'/'Main'/'Base', fallback to the first item)
  const mainVariant = colorVariants.find(v => {
    const cat = v.categoryVariant?.toLowerCase() || '';
    return cat === 'main' || cat === 'color' || cat === 'base' || cat === '';
  }) || colorVariants[0];

  const otherVariants = colorVariants.filter(v => v.id !== mainVariant?.id);

  const regularVariants = otherVariants.filter(v => {
    const cat = v.categoryVariant?.toLowerCase() || '';
    return !cat.includes('special') && !cat.includes('edition') && !cat.includes('limited');
  });

  const specialVariants = otherVariants.filter(v => {
    const cat = v.categoryVariant?.toLowerCase() || '';
    return cat.includes('special') || cat.includes('edition') || cat.includes('limited');
  });

  const isMainSelected = currentVariant?.id === mainVariant?.id;
  const isRegularSelected = regularVariants.some(v => v.id === currentVariant?.id);
  const isSpecialSelected = specialVariants.some(v => v.id === currentVariant?.id);

  const renderVariantGroup = (variants: UIColorVariant[]) => (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => {
        const isSelected = variant.handle === currentVariantHandle;
        return (
          <Link
            key={variant.id}
            to={`/products/${variant.handle}`}
            className="group block"
          >
            <div className="flex items-center gap-4">
              <div
                className={`overflow-hidden bg-gray-100 ${variantStyle} ${isSelected ? 'ring-1 ring-offset-1 ring-gray-500' : 'ring-1 ring-gray-200'
                  }`}
              >
                {variant.featuredImage ? (
                  <img
                    src={variant.featuredImage.url}
                    alt={variant.featuredImage.altText || variant.title}
                    className={`w-full h-full object-cover ${isSelected ? 'opacity-100' : 'group-hover:opacity-90'}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="mb-6">
      {mainVariant && (
        <div className="mb-4">
          <div className='flex gap-2 items-center mb-3'>
            <p className="font-semibold text-gray-800 text-sm">Color{isMainSelected ? ':' : ''}</p>
            {isMainSelected && (
              <p className="text-sm text-gray-500">{selectedVariant?.selectedOptions?.[0]?.value}</p>
            )}
          </div>
          {renderVariantGroup([mainVariant])}
        </div>
      )}
      
      {regularVariants.length > 0 && (
        <div className="mb-4">
          <div className='flex gap-2 items-center mb-3'>
            <p className="font-semibold text-gray-800 text-sm">Color Variants{isRegularSelected ? ':' : ''}</p>
            {isRegularSelected && (
              <p className="text-sm text-gray-500">{selectedVariant?.selectedOptions?.[0]?.value}</p>
            )}
          </div>
          {renderVariantGroup(regularVariants)}
        </div>
      )}

      {specialVariants.length > 0 && (
        <div className="mb-4">
          <div className='flex gap-2 items-center mb-3'>
            <p className="font-semibold text-gray-800 text-sm">Special & Limited Editions{isSpecialSelected ? ':' : ''}</p>
            {isSpecialSelected && (
              <p className="text-sm text-gray-500">{selectedVariant?.selectedOptions?.[0]?.value}</p>
            )}
          </div>
          {renderVariantGroup(specialVariants)}
        </div>
      )}
    </div>
  );
}  

export default VariantGroup