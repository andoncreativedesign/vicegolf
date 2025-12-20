import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { AccordionItem } from '~/lib/sanity/products';

interface ProductDetailsAccordionsProps {
  accordions: AccordionItem[];
}

export function ProductDetailsAccordions({ accordions }: ProductDetailsAccordionsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const renderBulletLine = (bullet: { customBullet?: string; text: string }) => {
    const hasCustom = bullet.customBullet?.trim();
    return (
      <div className="flex items-baseline gap-3">
        <span
          className={`font-medium text-gray-900 flex-shrink-0 ${hasCustom ? 'text-[15px]' : 'text-[16px] w-2 text-center'}`}
          aria-hidden="true"
        >
          {hasCustom ? bullet.customBullet : '•'}
        </span>
        <span className="text-gray-700 text-[15px] leading-relaxed tracking-wide font-light flex-1">
          {bullet.text}
        </span>
      </div>
    );
  };

  const renderContent = (item: AccordionItem) => {
    const bulletPoints = item.bulletPoints ?? [];
    const inlinePoints = item.inlinePoints ?? [];
    const linkPoints = item.linkPoints ?? [];
    const stackedPoints = item.stackedPoints ?? [];

    switch (item.type) {
      case 'basic':
        return item.description ? (
          <div className="pt-1">
            <p className="text-gray-700 text-[15px] leading-relaxed tracking-wide font-light">
              {item.description}
            </p>
          </div>
        ) : null;

      case 'bulletPoints':
        if (bulletPoints.length === 0 && !item.description) return null;
        return (
          <div className="space-y-4">
            {item.description && (
              <div className="pb-2">
                <p className="text-gray-700 text-[15px] leading-relaxed tracking-wide font-light">
                  {item.description}
                </p>
              </div>
            )}
            <div className="space-y-3">
              {bulletPoints.map((group, i) => {
                const hasTitle = group.groupTitle?.trim();
                const items = group.items || [];
                if (items.length === 0) return null;
                return (
                  <div key={i} className="space-y-2">
                    {hasTitle && (
                      <h4 className="font-semibold text-gray-900 text-[17px] tracking-tight mb-1">
                        {group.groupTitle}
                      </h4>
                    )}
                    <div className={`space-y-2 ${hasTitle ? 'ml-1' : ''}`}>
                      {items.map((b, j) => (
                        <div key={j}>
                          {renderBulletLine(b)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'inlinePoints':
        const hasInline = item.descriptionTitle || item.description || inlinePoints.length > 0;
        if (!hasInline) return null;
        return (
          <div className="space-y-4">
            {item.descriptionTitle && (
              <h4 className="font-semibold text-gray-900 text-[17px] tracking-tight mb-3">
                {item.descriptionTitle}
              </h4>
            )}
            {item.description && (
              <div className="pb-2">
                <p className="text-gray-700 text-[15px] leading-relaxed tracking-wide font-light">
                  {item.description}
                </p>
              </div>
            )}
            {inlinePoints.length > 0 && (
              <div className="space-y-5 pt-1">
                {inlinePoints.map((p, i) => (
                  <div key={i} className="leading-relaxed">
                    <strong className="text-gray-900 font-semibold block mb-2 tracking-tight text-[16px]">
                      {p.title}
                    </strong>
                    <p className="text-gray-700 text-[15px] font-light tracking-wide">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'stackedPoints':
        if (stackedPoints.length === 0 && !item.description) return null;
        return (
          <div className="space-y-4">
            {item.descriptionTitle && (
              <h4 className="font-semibold text-gray-900 text-[17px] tracking-tight mb-3">
                {item.descriptionTitle}
              </h4>
            )}
            {item.description && (
              <div className="pb-2">
                <p className="text-gray-700 text-[15px] leading-relaxed tracking-wide font-light">
                  {item.description}
                </p>
              </div>
            )}
            <div className="space-y-4">
              {stackedPoints.map((point, i) => (
                <div key={i} className="flex flex-col">
                  {point.title ? (
                    <h5 className="font-semibold text-gray-900 text-[16px] mb-2 tracking-tight">
                      {point.title}
                    </h5>
                  ) : null}
                  {point.description && (
                    <div className="flex items-baseline gap-3">
                      <span className="font-medium text-gray-900 flex-shrink-0 text-[16px] w-2 text-center" aria-hidden="true">
                        •
                      </span>
                      <span className="text-gray-700 text-[15px] leading-relaxed tracking-wide font-light flex-1">
                        {point.description}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'linkPoints':
        return linkPoints.length > 0 ? (
          <div className="space-y-2 pt-1">
            {linkPoints.map((link, i) => (
              <div key={i} className="flex items-start gap-3 py-0.5">
                <span className="text-gray-900 mt-[1px] flex-shrink-0 text-[16px] w-2 text-center">•</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 text-[15px] leading-relaxed tracking-wide font-light underline underline-offset-3 decoration-gray-300 hover:decoration-gray-500 transition-colors duration-200 pt-[1px]"
                >
                  {link.text}
                </a>
              </div>
            ))}
          </div>
        ) : null;

      case 'descriptionSandwich':
        return (
          <div className="space-y-4">
            {item.description && (
              <div className="pb-2">
                <p className="text-gray-700 text-[15px] leading-relaxed tracking-wide font-light">
                  {item.description}
                </p>
              </div>
            )}
            {bulletPoints.map((group, i) => {
              const hasTitle = group.groupTitle?.trim();
              const items = group.items || [];
              if (items.length === 0) return null;
              return (
                <div key={i} className="space-y-2">
                  {hasTitle && (
                    <h4 className="font-semibold text-gray-900 text-[17px] tracking-tight mb-1">
                      {group.groupTitle}
                    </h4>
                  )}
                  <div className={`space-y-2 ${hasTitle ? 'ml-1' : ''}`}>
                    {items.map((b, j) => (
                      <div key={j}>
                        {renderBulletLine(b)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {item.secondaryDescription && (
              <div className="pt-3 border-t border-gray-100 mt-3">
                <p className="text-gray-700 text-[15px] leading-relaxed tracking-wide font-light pt-2">
                  {item.secondaryDescription}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {accordions.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item._key ?? index}
            className="border-b border-gray-200 last:border-b-0 transition-colors duration-200"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between py-4 text-left transition-all duration-200 group px-4 md:px-0 hover:bg-gray-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:bg-gray-50 rounded-sm"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item._key ?? index}`}
              id={`accordion-header-${item._key ?? index}`}
            >
              <span className="text-[19px] font-semibold text-gray-900 tracking-tight leading-tight">
                {item.title}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-all duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-gray-700' : ''} group-hover:text-gray-700`}
                aria-hidden="true"
              />
            </button>
            <div
              id={`accordion-content-${item._key ?? index}`}
              role="region"
              aria-labelledby={`accordion-header-${item._key ?? index}`}
              className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="px-4 md:px-0 pb-6 pt-1">
                {renderContent(item)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}