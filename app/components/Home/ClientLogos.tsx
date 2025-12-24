import React, { useEffect } from 'react';
import { Image } from '@shopify/hydrogen-react';
import type { BrandItemTransformed } from '~/lib/sanity/home';

const ClientLogos: React.FC<{ brands: BrandItemTransformed[] }> = ({ brands }) => {

  return (
    <section className="py-12 lg:py-16">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-medium mb-8 lg:mb-12" style={{ fontSize: '2rem' }}>
          As Seen In
        </h2>

        <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex items-center justify-between w-full min-w-max">
            {brands.map((brand, index) => (
              <div key={index} className="flex-shrink-0 px-4">
                <Image
                  data={{
                    url: brand.logo,
                    altText: `${brand.name} logo`,
                    width: 160,
                    height: 80
                  }}
                  sizes="160px"
                  loading="lazy"
                  className="w-40 h-20 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;