import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { AccordionItem } from '~/lib/sanity/products';

interface ProductDetailsAccordionsProps {
  accordions: AccordionItem[];
}

export function ProductDetailsAccordions({ accordions }: ProductDetailsAccordionsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const renderContent = (item: AccordionItem) => {
    switch (item.type) {
      case 'basic':
        return (
          <p className="text-sm text-gray-600 leading-relaxed tracking-wide">
            {item.description}
          </p>
        );

      case 'bulletPoints':
        return (
          <div className="space-y-5">
            {item.description && (
              <p className="text-sm text-gray-600 leading-relaxed tracking-wide">
                {item.description}
              </p>
            )}
            <ul className="space-y-3">
              {item.bulletPoints?.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className="text-gray-900 mt-0.5">•</span>
                  <span>{point.description}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'inlinePoints':
        return (
          <div className="space-y-4">
            {item.description && (
              <p className="text-sm text-gray-600 leading-relaxed tracking-wide mb-4">
                {item.description}
              </p>
            )}
            <div className="space-y-3">
              {item.inlinePoints?.map((p, i) => (
                <p key={i} className="text-sm text-gray-700 leading-relaxed">
                  <strong>{p.title}:</strong> {p.description}
                </p>
              ))}
            </div>
          </div>
        );

      case 'linkPoints':
        return (
          <ul className="space-y-3">
            {item.linkPoints?.map((link, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-gray-900 mt-0.5">•</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline underline-offset-4 transition-colors"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        );

      case 'descriptionSandwich':
        return (
          <div className="space-y-5">
            {item.description && (
              <p className="text-sm text-gray-600 leading-relaxed tracking-wide">
                {item.description}
              </p>
            )}
            <ul className="space-y-3">
              {item.bulletPoints?.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className="text-gray-900 mt-0.5">•</span>
                  <span>{point.description}</span>
                </li>
              ))}
            </ul>
            {item.secondaryDescription && (
              <p className="text-sm text-gray-600 leading-relaxed tracking-wide pt-4">
                {item.secondaryDescription}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full border-t border-gray-100">
      {accordions.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item._key ?? index} className="border-b border-gray-100">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between py-5 text-left transition-all duration-300 hover:bg-gray-50 px-1"
            >
              <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
                {item.title}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-gray-900' : ''
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 px-1 ${
                isOpen ? 'max-h-[1200px] pb-6' : 'max-h-0'
              }`}
            >
              {renderContent(item)}
            </div>
          </div>
        );
      })}
    </div>
  );
}