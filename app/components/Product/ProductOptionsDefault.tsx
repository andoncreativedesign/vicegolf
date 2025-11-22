import type { MappedProductOptions } from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import { useEffect } from "react";
import { Link, useNavigate } from 'react-router';


const ProductOptionsDefault = ({ option }: { option: MappedProductOptions }) => {
  const navigate = useNavigate()
  
  return (
    <div className="product-options mb-6" key={option.name}>
      <h5 className="text-sm font-medium text-gray-700 mb-3">
        {option.name}:
      </h5>
      <div className="grid grid-cols-6 gap-2">
        {option.optionValues.map((value) => {
          const {
            name,
            handle,
            variantUriQuery,
            selected,
            available,
            exists,
            isDifferentProduct,
            swatch,
          } = value;

          if (isDifferentProduct) {
            return (
              <Link
                className={`product-options-item relative rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${selected ? 'ring-2 ring-black ring-offset-2' : 'ring-1 ring-gray-200'
                  } ${!available ? 'opacity-40 grayscale' : ''}`}
                key={option.name + name}
                prefetch="intent"
                preventScrollReset
                replace
                to={`/products/${handle}?${variantUriQuery}`}
              >
                <ProductOptionSwatch swatch={swatch} name={name} />
              </Link>
            );
          } else {
            return (
              <button
                type="button"
                className={`product-options-item relative rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${selected ? 'ring-2 ring-black ring-offset-2' : 'ring-1 ring-gray-200'
                  } ${!exists ? 'opacity-40 cursor-not-allowed' : ''} ${!available ? 'grayscale' : ''
                  }`}
                key={option.name + name}
                disabled={!exists}
                onClick={() => {
                  if (!selected) {
                    void navigate(`?${variantUriQuery}`, {
                      replace: true,
                      preventScrollReset: true,
                    });
                  }
                }}
              >
                <ProductOptionSwatch swatch={swatch} name={name} />
              </button>
            );
          }
        })}
      </div>
    </div>
  )
}


function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;
  if (!image && !color) return null;
  return (
    <div
      aria-label={name}
      className="w-6 h-6 rounded-full border border-gray-200 overflow-hidden flex-shrink-0"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} className="w-full h-full object-cover" />}
    </div>
  );
}


export default ProductOptionsDefault