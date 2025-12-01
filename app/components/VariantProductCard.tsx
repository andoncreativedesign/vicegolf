
import { Image, Money } from "@shopify/hydrogen";
import { Link } from "react-router";
import { useState, useMemo } from "react";

interface ColorOption {
  id: string;
  name: string;
  color: string;
  available: boolean;
}

interface ProductCardProps {
  product: {
    handle: string;
    title: string;
    featuredImage?: {
      url: string;
      altText?: string;
    };
    images?: {
      nodes: Array<{
        url: string;
        altText?: string;
      }>;
    };
    variants?: {
      nodes: Array<{
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        };
      }>;
    };
    productType?: string;
    tags?: string[];
  };
}

export function VariantProductCard({ product }: ProductCardProps) {
  const firstVariant = product.variants?.nodes[0];
  const image = product.featuredImage || product.images?.nodes?.[0];
  const [selectedColor, setSelectedColor] = useState<string>('white');
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [currentImage, setCurrentImage] = useState(image?.url || '');

  const isGolfBall = product.productType?.toLowerCase().includes('golf ball') || 
                    product.tags?.some(tag => tag.toLowerCase().includes('golf ball'));

  const colorOptions: ColorOption[] = [
    { id: 'white', name: 'White', color: 'bg-white border', available: true },
    { id: 'yellow', name: 'Yellow', color: 'bg-yellow-300', available: true },
    { id: 'green', name: 'Green', color: 'bg-green-500', available: true },
    { id: 'orange', name: 'Orange', color: 'bg-orange-400', available: true },
    { id: 'pink', name: 'Pink', color: 'bg-pink-400', available: true }
  ];

  const colorVariantImages = useMemo(() => {
    if (!product.images?.nodes) return [];
    
    return colorOptions
      .filter(color => color.available)
      .map(color => ({
        ...color,
        image: product.images?.nodes.find(img => 
          img.altText?.toLowerCase().includes(color.name.toLowerCase())
        ) || product.featuredImage
      }));
  }, [product.images, product.featuredImage, colorOptions]);

  const handlePreviewClick = (e: React.MouseEvent, imgUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage(imgUrl);
  };

  const rating = 4.5 + Math.random() * 0.5;
  const reviewCount = Math.floor(Math.random() * 50) + 10;

  const getOfferBadge = () => {
    if (isGolfBall) {
      return {
        text: '🏌️‍♂️ BLACK FRIDAY',
        bgColor: 'bg-black',
        textColor: 'text-white'
      };
    }
    return {
      text: '🏆 Bestseller',
      bgColor: 'bg-blue-600',
      textColor: 'text-gray-900'
    };
  };

  const offerBadge = getOfferBadge();

  return (
    <div className="block bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100/30 w-[320px] min-w-[320px] flex flex-col h-full relative group">
      <Link
        to={`/products/${product.handle}`}
        className="block relative"
        style={{ textDecoration: 'none' }}
      >
        <div className={`absolute left-3 top-3 ${offerBadge.bgColor} ${offerBadge.textColor} text-xs font-bold px-4 py-2 rounded-lg shadow-md z-20`}>
          {offerBadge.text}
        </div>

        <div 
          className="relative w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setHoveredColor(null);
          }}
        >
          <div className="w-full h-full">
            {image && (
              <Image
                src={currentImage || image.url}
                alt={image.altText || product.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                sizes="100%"
                width={320}
                height={320}
              />
            )}
          </div>
        </div>

       {isHovering && !isGolfBall && (
  <div className="absolute bottom-26 left-0 right-0 z-30 p-3 bg-white/90 backdrop-blur-sm shadow-lg"
    onClick={(e) => e.preventDefault()}  >
    <div className="grid grid-cols-5 gap-2 w-full">
      {colorVariantImages.slice(0, 5).map((c) => (
        <div
          key={c.id}
          className="aspect-square rounded-lg overflow-hidden ring-1 ring-gray-200 hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
          onClick={(e) => handlePreviewClick(e, c.image?.url || "")}
          onMouseEnter={() => setHoveredColor(c.id)}
          onMouseLeave={() => setHoveredColor(null)}
        >
          {c.image?.url ? (
            <Image
              src={c.image.url}
              alt={c.name}
              width={56}
              height={56}
              className="w-full h-full object-contain hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 bg-white/90 flex items-center justify-center">
              <span className="text-[10px] text-gray-400">No Image</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}

        {isGolfBall && (
          <div className="px-5 pt-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Color:</span>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedColor(color.id);
                    }}
                    onMouseEnter={() => setHoveredColor(color.id)}
                    onMouseLeave={() => setHoveredColor(null)}
                    disabled={!color.available}
                    className={`w-5 h-5 rounded-full ${color.color} flex items-center justify-center transition-all duration-200 transform 
                      ${selectedColor === color.id ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : ''}
                      ${!color.available ? 'opacity-50 cursor-not-allowed' : 'hover:ring-2 hover:ring-gray-300 hover:scale-110'}`}
                    title={`${color.name}${!color.available ? ' (Out of Stock)' : ''}`}
                  >
                    {!color.available && (
                      <span className="w-3 h-px bg-gray-500 absolute rotate-45" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 px-5 pb-5 pt-4 space-y-3">
          <div className="relative">
            <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[2.8rem]">
              {product.title}
            </h3>
          </div>

          <p className="text-sm text-gray-500 font-medium">
            {product.productType || 'Golf Equipment'}
          </p>

          <div className="flex items-center space-x-1.5 pt-1">
            <div className="flex items-center space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 flex-shrink-0 ${
                    i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-gray-200'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>

          {firstVariant && (
            <div className="flex items-center justify-between pt-1 mt-auto">
              <div className="flex items-center space-x-2">
                {firstVariant.compareAtPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {parseFloat(firstVariant.compareAtPrice.amount).toFixed(2)} {firstVariant.compareAtPrice.currencyCode}
                  </span>
                )}
                <span className="text-xl font-bold text-red-600">
                  {parseFloat(firstVariant.price.amount).toFixed(2)} {firstVariant.price.currencyCode}
                </span>
              </div>
              <span className="text-xs text-gray-400">from 6 dozen</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}