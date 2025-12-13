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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 items-center justify-items-center">
          {brands.map((brand, index) => (
            <div key={index} className="flex items-center justify-center">
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
    </section>
  );
};

export default ClientLogos;