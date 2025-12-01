import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { AccordionItem } from '~/lib/sanity/products';

interface ProductDetailsAccordionsProps {
  accordions: AccordionItem[];
}

export function ProductDetailsAccordions({ accordions }: ProductDetailsAccordionsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const renderAccordionContent = (section: AccordionItem) => {
    switch (section.type) {
      case 'basic':
        return (
          <p className="text-sm text-gray-600 leading-relaxed tracking-wide px-1">
            {section.description}
          </p>
        );
      case 'bulletPoints':
        return (
          <div className="px-1">
            <p className="text-sm text-gray-600 leading-relaxed tracking-wide mb-4">
              {section.description}
            </p>
            <ul className="list-disc pl-5 space-y-2">
              {section.bulletPoints?.map((point, idx) => (
                <li key={idx} className="text-sm text-gray-600">
                  <strong>{point.title}:</strong> {point.description}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'inlinePoints':
        return (
          <div className="px-1">
            <p className="text-sm text-gray-600 leading-relaxed tracking-wide mb-4">
              {section.description}
            </p>
            <ul className="space-y-2">
              {section.inlinePoints?.map((point, idx) => (
                <li key={idx} className="text-sm text-gray-600">
                  <span className="font-semibold">{point.title}:</span> {point.description}
                </li>
              ))}
            </ul>
          </div>
        );
    case 'linkPoints':
  return (
    <ul className="space-y-3">
      {section.linkPoints?.map((point, idx) => (
        <li key={idx} className="flex items-center gap-3">
          <span className="text-gray-900">•</span>
          <a
            href={point.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-700 hover:text-gray-900 underline underline-offset-4 decoration-1 hover:decoration-2 transition-all"
          >
            {point.text}
          </a>
        </li>
      ))}
    </ul>
  );
      case 'descriptionSandwich':
        return (
          <div className="px-1">
            <p className="text-sm text-gray-600 leading-relaxed tracking-wide mb-4">
              {section.description}
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              {section.bulletPoints?.map((point, idx) => (
                <li key={idx} className="text-sm text-gray-600">
                  <strong>{point.title}:</strong> {point.description}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed tracking-wide">
              {section.secondaryDescription}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full border-t border-gray-100">
      {accordions.map((section, index) => {
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
                className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gray-900' : ''
                  }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[600px] pb-5' : 'max-h-0'
                }`}
            >
              {renderAccordionContent(section)}
            </div>
          </div>
        );
      })}
    </div>
  );
}