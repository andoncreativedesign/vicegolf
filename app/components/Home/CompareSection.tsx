import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {ArrowRight} from 'lucide-react';

export interface CompareItem {
  id: string;
  title: string;
  type: string;
  weight: string;
  strap: string;
  dividers: string;
  pockets: string;
  topDiameter: string;
  dimensions: string;
  handicap?: string;
  distanceLabel?: string;
  distancePercent?: number;
  forgivenessLabel?: string;
  forgivenessPercent?: number;
  lookFeel?: string;
  construction?: string;
  madeFor?: string;
  image: {
    url: string;
    altText?: string;
  };
  price: string;
  handle: string;
}

export function CompareSection({
  useDriverStyle = false,
}: {
  useDriverStyle?: boolean;
} = {}) {
  const compareItems: CompareItem[] = [
    {
      id: '1',
      title: 'VICE PRO PLUS',
      type: 'Golf Balls',
      weight: '45.5g',
      strap: 'Adjustable',
      dividers: '14-way',
      pockets: '5',
      topDiameter: '9.5"',
      dimensions: '12" x 7.5" x 7"',
      image: {
        url: 'https://cdn.shopify.com/s/files/1/0563/0227/2645/files/Vice_Pro-Junior_Dozen-Ball.png?v=1762200095&width=100&height=100&crop=center',
        altText: 'VICE PRO PLUS Golf Balls',
      },
      price: '$44.99',
      handle: 'vice-pro-plus-golf-balls',
    },
    {
      id: '2',
      title: 'VICE PRO',
      type: 'Golf Balls',
      weight: '45.5g',
      strap: 'Adjustable',
      dividers: '14-way',
      pockets: '5',
      topDiameter: '9.5"',
      dimensions: '12" x 7.5" x 7"',
      image: {
        url: 'https://cdn.shopify.com/s/files/1/0732/0505/5640/files/Vice_Golf_Next_Up_Big_OG_Polo_White-59_1.jpg?v=1766224447',
        altText: 'VICE PRO Golf Balls',
      },
      price: '$37.99',
      handle: 'vice-pro-golf-balls',
    },
    {
      id: '3',
      title: 'VICE TOUR',
      type: 'Golf Balls',
      weight: '45.5g',
      strap: 'Adjustable',
      dividers: '14-way',
      pockets: '5',
      topDiameter: '9.5"',
      dimensions: '12" x 7.5" x 7"',
      image: {
        url: 'https://cdn.shopify.com/s/files/1/0563/0227/2645/files/Vice_Pro-Junior_Dozen-Ball.png?v=1762200095&width=100&height=100&crop=center',
        altText: 'VICE TOUR Golf Balls',
      },
      price: '$29.99',
      handle: 'vice-tour-golf-balls',
    },
  ];

  const driverCompareItems: CompareItem[] = [
    {
      id: 'd1',
      title: 'VGD01+',
      type: 'Driver',
      weight: '—',
      strap: '—',
      dividers: '—',
      pockets: '—',
      topDiameter: '—',
      dimensions: '—',
      handicap: 'Low/Mid',
      distanceLabel: 'Longest',
      distancePercent: 100,
      forgivenessLabel: 'Mid/High',
      forgivenessPercent: 65,
      lookFeel:
        'Solid and fast. Sharp lines, explosive feel and stability that means business off the tee.',
      construction:
        'Multi-material design with forged carbon and titanium face. Low spin, high speed, and full adjustability for max distance.',
      madeFor:
        'Players chasing max distance, low spin and full control over launch. No tinkering, just bombs.',
      image: {
        url: 'https://cdn.shopify.com/s/files/1/0563/0227/2645/files/Vice_Pro-Junior_Dozen-Ball.png?v=1762200095&width=600',
        altText: 'VGD01+ Driver',
      },
      price: '$449.00',
      handle: 'vgd01-plus',
    },
    {
      id: 'd2',
      title: 'VGD01',
      type: 'Driver',
      weight: '—',
      strap: '—',
      dividers: '—',
      pockets: '—',
      topDiameter: '—',
      dimensions: '—',
      handicap: 'Mid/High',
      distanceLabel: 'Long',
      distancePercent: 80,
      forgivenessLabel: 'Highest',
      forgivenessPercent: 100,
      lookFeel:
        'Calm and confident. Lightweight in hand and solid at impact. Built to find fairways without fuss.',
      construction:
        'One-piece titanium body with a carbon crown and internal draw weighting. Built for forgiveness, high launch, and effortless speed.',
      madeFor:
        'Golfers who want effortless speed, high launch and max forgiveness without overthinking the swing.',
      image: {
        url: 'https://cdn.shopify.com/s/files/1/0732/0505/5640/files/Vice_Golf_Next_Up_Big_OG_Polo_White-59_1.jpg?v=1766224447',
        altText: 'VGD01 Driver',
      },
      price: '$349.00',
      handle: 'vgd01',
    },
  ];

  if (useDriverStyle) {
    return (
      <section className="py-16 ">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Compare Our Drivers</h2>
            <p className="text-gray-600 text-center max-w-full mx-auto">To see which one is best for your game</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {driverCompareItems.map((item) => (
              <div
                key={item.id}
                className=" rounded-xl shadow-md overflow-hidden border border-gray-100"
              >
                <div className="relative h-64 flex items-center justify-center p-6">
                  <Image
                    src={item.image.url}
                    alt={item.image.altText || item.title}
                    className="h-full w-auto object-contain"
                    width={360}
                    height={360}
                  />
                </div>

                <div className="px-6 pb-6">
                  <div className="text-center mb-5">
                    <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-900 font-semibold text-sm mt-1">{item.price}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-900 font-semibold">Handicap</span>
                      <span className="text-gray-700">{item.handicap}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-900 font-semibold">Distance</span>
                        <span className="text-gray-700">{item.distanceLabel}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{width: `${item.distancePercent ?? 0}%`}}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-900 font-semibold">Forgiveness</span>
                        <span className="text-gray-700">{item.forgivenessLabel}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{width: `${item.forgivenessPercent ?? 0}%`}}
                        />
                      </div>
                    </div>

                    <div className="text-xs">
                      <p className="text-gray-900 font-semibold mb-1">Look/Feel</p>
                      <p className="text-gray-700 leading-5">{item.lookFeel}</p>
                    </div>

                    <div className="text-xs">
                      <p className="text-gray-900 font-semibold mb-1">Construction</p>
                      <p className="text-gray-700 leading-5">{item.construction}</p>
                    </div>

                    <div className="text-xs">
                      <p className="text-gray-900 font-semibold mb-1">Made for</p>
                      <p className="text-gray-700 leading-5">{item.madeFor}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      to={`/products/${item.handle}`}
                      className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors"
                      style={{textDecoration: 'none', color: 'white'}}
                    >
                      Shop Now <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">COMPARE VICE GOLF BAGS</h2>
          <p className="text-gray-600 text-center max-w-full mx-auto">Choose the perfect golf ball for your game</p>
        </div>
        
        <div className="grid grid-cols-3  mx:grid-cols-3 gap-8  items-center">
          {compareItems.map((item) => (
            <div 
              key={item.id} 
              className=" rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="relative h-64  flex items-center justify-center p-6">
                <Image
                  src={item.image.url}
                  alt={item.image.altText || item.title}
                  className="h-full w-auto object-contain"
                  width={300}
                  height={300}
                />
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-vice-pink font-semibold text-lg mt-1">{item.price}</p>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <div className=" justify-between py-2">
                    <p className="text-gray-900">Type</p>
                    <p className="font-medium">{item.type}</p>
                  </div>
                  <div className=" justify-between py-2">
                    <p className="text-gray-900">Weight</p>
                    <p className="font-medium">{item.weight}</p>
                  </div>
                  <div className=" justify-between py-2">
                    <p className="text-gray-900">Strap</p>
                    <p className="font-medium">{item.strap}</p>
                  </div>
                  <div className=" justify-between py-2">
                    <p className="text-gray-900">Dividers</p>
                    <p className="font-medium">{item.dividers}</p>
                  </div>
                  <div className=" justify-between py-2">
                    <p className="text-gray-900">Pockets</p>
                    <p className="font-medium">{item.pockets}</p>
                  </div>
                  <div className=" justify-between py-2">
                    <p className="text-gray-900">Top Diameter</p>
                    <p className="font-medium">{item.topDiameter}</p>
                  </div>
                  <div className=" justify-between py-2">
                    <p className="text-gray-900">Dimensions</p>
                    <p className="font-medium">{item.dimensions}</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link
                    to={`/products/${item.handle}`}
                  className="w-full flex items-center justify-center gap-2 bg-vice-pink text-white px-6 py-3 bg-black rounded-full font-medium hover:bg-opacity-90 transition-colors"
                  style={{textDecoration:'none',color:'white'}}
                  >
                    Shop Now <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
