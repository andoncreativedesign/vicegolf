// app/components/ProductDetailsAccordions.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function ProductDetailsAccordions() {
  const sections = [
    {
      title: 'Spin & Distance',
      content: 'The Vice Pro Plus generates the highest backspin in our lineup. Short-sided yourself? Pin on a slope? Fast greens? The high spin rates, especially greenside, ensure perfect control. Additionally, its high-energy speed core delivers explosive distance off the tee. The perfect blend of power and precision.',
    },
    {
      title: 'Swing Speed',
      content: 'High ball speeds & ultimate control.',
    },
    {
      title: 'Feel',
      content: 'New & Match.',
    },
    {
      title: 'New Mix & Match',
      content: 'Mix and match your favorite colors and designs.',
    },
    {
      title: 'Shipping & Customization',
      content: 'Standard shipping within 2 business days. Customizations take up to 2 weeks.',
    },
    {
      title: 'Return Policy',
      content: '30-day returns on unopened products. Custom items non-returnable.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full border-t border-gray-100">
      {sections.map((section, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border-b border-gray-100">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between py-5 text-left transition-all duration-300 hover:bg-gray-50 px-1 rounded-lg"
            >
              <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
                {section.title}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-gray-900' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                isOpen ? 'max-h-96 pb-5' : 'max-h-0'
              }`}
            >
              <p className="text-sm text-gray-600 leading-relaxed tracking-wide px-1">
                {section.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}