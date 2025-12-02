// app/components/Product/ProductAccordion2.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Accordion2 } from '~/lib/sanity/products';

interface ProductAccordion2Props {
  accordion2?: Accordion2;
}

const ProductAccordion2 = ({ accordion2 }: ProductAccordion2Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!accordion2 || accordion2.items.length === 0) return null;

  const imageUrl = accordion2.sectionImage?.asset.url;
  const lqip = accordion2.sectionImage?.asset.metadata.lqip;

  return (
    <>
      <div className="text-center mb-10 mt-20">
        <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
          {accordion2.sectionTitle}
        </h3>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-20 border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Accordion */}
          <div className="p-8 lg:p-12">
            <div className="border-t border-gray-100">
              {accordion2.items.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <div key={index} className="border-b border-gray-100">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between py-6 text-left transition-all hover:bg-gray-50 px-3 -mx-3 rounded-lg"
                    >
                      <span className="text-[15px] font-semibold text-gray-900 tracking-tight pr-4">
                        {item.title}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-gray-900' : ''
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isOpen ? 'max-h-96 pb-6' : 'max-h-0'
                      }`}
                    >
                      <div className="px-3">
                        <p className="text-sm text-gray-600 leading-relaxed tracking-wide">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Image + Optional Description */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center p-8 lg:p-12">
            {imageUrl ? (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={accordion2.sectionTitle}
                  className="w-full max-w-md mx-auto object-contain drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }}
                />
                {lqip && (
                  <div
                    className="absolute inset-0 -z-10 blur-2xl opacity-60"
                    style={{
                      backgroundImage: `url(${lqip})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
            )}

            {accordion2.description && (
              <p className="mt-8 text-center text-gray-600 text-sm leading-relaxed max-w-lg mx-auto">
                {accordion2.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductAccordion2;