import type { ProductFragment } from "storefrontapi.generated";
import type { UIColorVariant } from "~/lib/shopify/product-queries";
import { Link, useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from "react";

interface ColorVariantProps {
  productType?: string;
  colorVariants: UIColorVariant[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}

const ColorVariant = ({ productType, colorVariants, selectedVariant }: ColorVariantProps) => {
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
  }, []);

  return (
    <div className="mb-6">
      <div className='flex gap-2 items-center mb-3'>
        <p className="font-semibold text-gray-700">Color:</p>
        <p className="text-sm text-gray-500">{selectedVariant?.selectedOptions?.[0].value}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {colorVariants.map((variant) => {
          const isSelected = variant.handle === location?.pathname?.split('/').pop();
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
    </div>
  );
}  

export default ColorVariant