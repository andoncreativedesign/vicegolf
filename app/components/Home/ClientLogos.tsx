import React, { useEffect } from 'react';
import { Image } from '@shopify/hydrogen-react';
import type { BrandItemTransformed } from '~/lib/sanity/home';

const ClientLogos: React.FC<{brands: BrandItemTransformed[]}> = ({brands}) => {

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="px-4 mx-0 sm:px-6 lg:px-8 text-center">
        <h2 className="text-lg sm:text-xl text-gray-600 font-medium mb-8 lg:mb-12">
          As Seen In
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 items-center justify-items-center">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group cursor-pointer"
            >
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-gray-200">
                <div className="w-28 h-16 rounded-lg flex items-center justify-center mb-3 overflow-hidden bg-gray-50">
                  <Image
                    data={{
                      url: brand.logo,
                      altText: `${brand.name} logo`,
                      width: 120,
                      height: 60
                    }}
                    sizes="120px"
                    loading="lazy"
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                {/* <p className="text-xs text-gray-500 text-center group-hover:text-gray-700 transition-colors">
                  {brand.description}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;