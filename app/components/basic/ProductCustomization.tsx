import { Link, useNavigate } from 'react-router';
import type { MappedProductOptions } from '@shopify/hydrogen';
import type { Maybe, ProductOptionValueSwatch } from '@shopify/hydrogen/storefront-api-types';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import HandOrientation from '../Product/HandOrientation';
import type { ClubVariant } from '~/lib/shopify/product-queries';

type StylingType = 'default' | 'club' | 'drivers';
type BorderType = 'solid' | 'dashed' | 'dotted';

interface ProductCustomizationProps {
  productOptions: MappedProductOptions[];
  styling?: StylingType;
  borderType?: BorderType;
  clubVariants?: ClubVariant[];
  currentProductId: string;
}

const DROPDOWN_OPTIONS = [
  "Shaft Flex",
  "Shaft Model",
  "Shoe size"
];

// Style configurations
const styleConfig = {
  club: {
    container: (isFirst: boolean, borderType: BorderType = 'solid') =>
      // `p-4 rounded-lg mb-4 ${isFirst ? 'border' : 'border'} border-${borderType} shadow-md bg-white`
      `p-4 rounded-lg mb-4 shadow-lg border-1 border-gray-100  bg-white`
  }
};

const ProductCustomization = ({
  productOptions,
  styling = 'default',
  borderType = 'solid',
  clubVariants,
  currentProductId
}: ProductCustomizationProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});

  if (!productOptions?.length) return null;

  const toggleDropdown = (optionName: string) => {
    setIsOpen(prev => ({ ...prev, [optionName]: !prev[optionName] }));
  };

  // Group options into loft and others
  const { loftOption, otherOptions } = productOptions.reduce((acc, option) => {
    if (option.name === 'Loft') {
      acc.loftOption = option;
    } else if (option.optionValues.length > 1 &&
      option.name !== 'Color' &&
      !option.name?.includes('pack size')) {
      acc.otherOptions.push(option);
    }
    return acc;
  }, { loftOption: null, otherOptions: [] });

  const renderOption = (option: any, index: number, isLoft: boolean = false) => {
    if (DROPDOWN_OPTIONS.includes(option.name || '')) {
      return renderDropdown(option, index, isLoft);
    }
    return renderCard(option, index, isLoft);
  };

  const renderDropdown = (option: any, index: number, isLoft: boolean) => {
    const selectedValue = option.optionValues.find((v: any) => v.selected)?.name || 'Select';
    const isClubStyle = styling === 'club';
    const containerClass = isClubStyle
      ? isLoft
        ? styleConfig.club.container(true, borderType)
        : 'mb-2'
      : 'mb-6';

    return (
      <div key={option.name} className={`relative ${containerClass}`}>
        <h5 className="font-medium mb-2">
          {option.name}
        </h5>
        <div className="relative ">
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-full shadow-sm text-left bg-[#fafafa] cursor-pointer"
            onClick={() => toggleDropdown(option.name)}
          >
            <span>{selectedValue}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${isOpen[option.name] ? 'transform rotate-180' : ''}`}
            />
          </button>

          {isOpen[option.name] && (
            <div className="absolute z-10 mt-1 w-full bg-[#fafafa] border border-gray-300 shadow-lg max-h-60 overflow-auto">
              {option.optionValues.map((value: any) => (
                <button
                  key={value.name}
                  type="button"
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#2563eb] hover:text-white cursor-pointer ${value.selected ? 'font-medium' : ''}`}
                  onClick={() => {
                    if (value.variantUriQuery) {
                      void navigate(`?${value.variantUriQuery}`, {
                        replace: true,
                        preventScrollReset: true,
                      });
                    }
                    toggleDropdown(option.name);
                  }}
                >
                  {value.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCard = (option: any, index: number, isLoft: boolean) => {
    const isClubStyle = styling === 'club';
    const containerClass = isClubStyle && !isLoft ? 'mb-2' : 'mb-6';
    const hasSelected = option.optionValues.some((v: any) => v.selected);

    return (
      <div className={`product-options ${!isLoft ? containerClass : ''}`} key={option.name}>
        <h5 className={`mb-3 ${hasSelected ? 'font-bold' : 'font-medium'
          } `}>
          {option.name}
        </h5>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 min-w-[300px]">
          {option.optionValues.map((value: any) => {
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
                  className={`product-options-item relative rounded-xs overflow-hidden transition-all duration-300 cursor-pointer ${selected ? 'ring-2 ring-black ring-offset-2' : 'ring-1 ring-gray-200'
                    } ${!available ? 'opacity-40 grayscale' : ''}`}
                  key={`${option.name}-${name}`}
                  prefetch="intent"
                  preventScrollReset
                  replace
                  to={`/products/${handle}?${variantUriQuery}`}
                >
                  <ProductOptionSwatch swatch={swatch} name={name || ''} />
                </Link>
              );
            }

            return (
              <button
                type="button"
                className={`product-options-item relative rounded-xs overflow-hidden transition-all duration-300 cursor-pointer ${selected ? 'ring-2 ring-black ring-offset-2' : 'ring-1 ring-gray-200'
                  } ${!exists ? 'opacity-40 cursor-not-allowed' : ''
                  } ${!available ? 'grayscale' : ''
                  }`}
                key={`${option.name}-${name}`}
                disabled={!exists}
                onClick={() => {
                  if (!selected && variantUriQuery) {
                    void navigate(`?${variantUriQuery}`, {
                      replace: true,
                      preventScrollReset: true,
                    });
                  }
                }}
              >
                <ProductOptionSwatch swatch={swatch} name={name || ''} />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (styling === 'drivers') {
    return (
      <div className="space-y-4">
        {/* Hand Orientation (if any) */}
        {clubVariants?.length > 0 && (
          <div className={styleConfig.club.container(true, borderType)}>
            <HandOrientation
              clubVariants={clubVariants}
              currentProductId={currentProductId}
            />
          </div>
        )}
        {/* Loft Option in its own container */}
        {loftOption && (
          <div className={styleConfig.club.container(true, borderType)}>
            {renderOption(loftOption, -1, true)}
          </div>
        )}
        {/* All other options */}
        {otherOptions.length > 0 && (
          <div className={styleConfig.club.container(true, borderType)}>
            {otherOptions.map((option, index) => (
              <div key={option.name || index} className="mb-6 last:mb-0">
                {renderOption(option, index, false)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }


  return (
    <div className="space-y-4">
      {styling === 'club' && clubVariants && clubVariants?.length > 0 && otherOptions.length > 0 ? (
        // For club products with variants and options
        <>
          {/* Combined container for HandOrientation and first option */}
          <div className={styleConfig.club.container(true, borderType)}>
            {/* Hand Orientation */}
            <HandOrientation
              clubVariants={clubVariants}
              currentProductId={currentProductId}
            />

            {/* First other option */}
            {renderOption(otherOptions[0], 0, false)}
          </div>

          {/* Combined container for remaining options */}
          {otherOptions.length > 1 && (
            <div className={styleConfig.club.container(true, borderType)}>
              {otherOptions.slice(1).map((option, index) => (
                <div key={option.name || index} className="mb-4 last:mb-0">
                  {renderOption(option, index + 1, false)}
                </div>
              ))}
            </div>
          )}

          {/* Loft Option in its own container */}
          {loftOption && (
            <div className={styleConfig.club.container(true, borderType)}>
              {renderOption(loftOption, -1, true)}
            </div>
          )}
        </>
      ) : (
        // Original layout for non-club products
        <>
          {/* Hand Orientation (if any) */}
          {clubVariants && clubVariants?.length > 0 && (
            <div className={styling === 'club' ? styleConfig.club.container(true, borderType) : ''}>
              <HandOrientation
                clubVariants={clubVariants}
                currentProductId={currentProductId}
              />
            </div>
          )}

          {/* All other options */}
          {otherOptions.map((option, index) => (
            <div key={option.name || index} className={styling === 'club' ? styleConfig.club.container(true, borderType) : ''}>
              {renderOption(option, index, false)}
            </div>
          ))}

          {/* Loft Option in its own container */}
          {loftOption && (
            <div className={styling === 'club' ? styleConfig.club.container(true, borderType) : ''}>
              {renderOption(loftOption, -1, true)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;
  if (!image && !color) return <span className="text-sm font-medium">{name}</span>;
  return (
    <div
      aria-label={name}
      className="product-option-label-swatch w-full aspect-square flex items-center justify-center"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} className="w-full h-full object-cover" />}
    </div>
  );
}

export default ProductCustomization;