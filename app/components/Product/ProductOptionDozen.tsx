import type { MappedProductOptions } from "@shopify/hydrogen";
import { Link, useNavigate } from "react-router";

const ProductOptionDozen = ({ option }: { option: MappedProductOptions }) => {
  const navigate = useNavigate();

  if (option.optionValues.length === 1 || option.name === 'Color') {
    return null;
  }

  return (
    <div key={option.name} className="space-y-2">
      <h5 className="text-sm font-medium text-gray-900">
        {option.name}:
      </h5>
      <div className="space-y-2">
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

          const optionContent = (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${selected
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 bg-white'
                    }`}
                >
                  {selected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {name}
                </span>
              </div>
            </div>
          );

          if (isDifferentProduct) {
            return (
              <Link
                key={option.name + name}
                className={`relative flex items-center justify-between w-full p-4 rounded-xl border transition-all duration-200 ${selected
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${!available ? 'opacity-40 grayscale' : ''}`}
                prefetch="intent"
                preventScrollReset
                replace
                to={`/products/${handle}?${variantUriQuery}`}
              >
                {optionContent}
              </Link>
            );
          } else {
            return (
              <button
                key={option.name + name}
                type="button"
                className={`relative flex items-center justify-between w-full p-4 rounded-xl border transition-all duration-200 ${selected
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${!exists ? 'opacity-40 cursor-not-allowed' : ''
                  } ${!available ? 'grayscale' : ''}`}
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
                {optionContent}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
};


export default ProductOptionDozen