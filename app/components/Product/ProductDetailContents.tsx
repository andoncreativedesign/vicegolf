// app/components/WhatsNew.tsx
import { useState } from 'react';
import type { ProductContent1Item, ProductContent2Section } from '~/lib/sanity/products';
import ProductDetailsContent1 from './ProductDetailsContent1';
import ProductDetailsContent2 from './ProductDetailsContent2';
import ProductAccordion2 from './ProductAccordion2';

interface ProductDetailContentsProps {
  content: ProductContent1Item[]
  content2: ProductContent2Section
}

export function ProductDetailContents({ content, content2 }: ProductDetailContentsProps) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };
  return (
    <section className="w-full py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* What's New Section */}

        {content.map((item, index) => (
          <ProductDetailsContent1
            key={index}
            content={item}
            showImageLeft={index % 2 === 0}
          />
        ))}

        {content2 && (
          <ProductDetailsContent2
            content={content2}
          />
        )}

        {/* New Card Section with Accordion and Image */}
        {/* <ProductAccordion2 /> */}

      </div>
    </section>
  );
}