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
      <div className="flex items-start gap-2">
        <span
          className={`font-medium text-gray-900 flex-shrink-0 ${hasCustom ? 'text-sm mt-0.5' : 'text-sm'}`}
          style={{ width: hasCustom ? 'auto' : '0.5em' }}
          aria-hidden="true"
        >
          {hasCustom ? bullet.customBullet : '•'}
        </span>
        <span className="text-gray-700 text-sm leading-normal tracking-wide font-light">
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
          <div className="pt-0.5">
            <p className="text-gray-700 text-sm leading-normal tracking-wide font-light">
              {item.description}
            </p>
          </div>
        ) : null;

      case 'bulletPoints':
        if (bulletPoints.length === 0 && !item.description) return null;
        return (
          <div className="space-y-3">
            {item.description && (
              <div className="pb-1.5">
                <p className="text-gray-700 text-sm leading-normal tracking-wide font-light">
                  {item.description}
                </p>
              </div>
            )}
            <div className="space-y-2">
              {bulletPoints.map((group, i) => {
                const hasTitle = group.groupTitle?.trim();
                const items = group.items || [];
                if (items.length === 0) return null;
                return (
                  <div key={i} className="space-y-1.5">
                    {hasTitle && (
                      <h4 className="font-semibold text-gray-900 text-[16px] tracking-tight">
                        {group.groupTitle}
                      </h4>
                    )}
                    <div className={`space-y-1 ${hasTitle ? 'pl-0.5' : ''}`}>
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
          <div className="space-y-3">
            {item.descriptionTitle && (
              <h4 className="font-semibold text-gray-900 text-[16px] tracking-tight mb-2">
                {item.descriptionTitle}
              </h4>
            )}
            {item.description && (
              <div className="pb-1">
                <p className="text-gray-700 text-sm leading-normal tracking-wide font-light">
                  {item.description}
                </p>
              </div>
            )}
            {inlinePoints.length > 0 && (
              <div className="space-y-4 pt-1">
                {inlinePoints.map((p, i) => (
                  <div key={i} className="text-sm leading-normal -ml-0.5">
                    <strong className="text-gray-900 font-semibold block mb-1.5 tracking-tight text-[16px]">
                      {p.title}
                    </strong>
                    <p className="text-gray-700 font-light tracking-wide pl-0.5">
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
          <div className="space-y-3">
            {item.descriptionTitle && (
              <h4 className="font-semibold text-gray-900 text-[16px] tracking-tight mb-2">
                {item.descriptionTitle}
              </h4>
            )}
            {item.description && (
              <div className="pb-1.5">
                <p className="text-gray-700 text-sm leading-normal tracking-wide font-light">
                  {item.description}
                </p>
              </div>
            )}
            <div className="space-y-4">
              {stackedPoints.map((point, i) => (
                <div key={i} className="flex gap-3 -ml-0.5">
                  <span className="text-gray-900 mt-1.5 flex-shrink-0 text-sm">•</span>
                  <div className="flex-1">
                    {point.title && (
                      <h5 className="font-semibold text-gray-900 text-[16px] mb-1.5 tracking-tight">
                        {point.title}
                      </h5>
                    )}
                    <p className="text-sm leading-normal tracking-wide font-light text-gray-700">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'linkPoints':
        return linkPoints.length > 0 ? (
          <div className="space-y-2.5 pt-1">
            {linkPoints.map((link, i) => (
              <div key={i} className="flex items-start gap-3 py-1 -ml-0.5">
                <span className="text-gray-900 mt-1.5 flex-shrink-0 text-sm">•</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 text-sm leading-normal tracking-wide font-light underline underline-offset-3 decoration-gray-300 hover:decoration-gray-500 transition-colors duration-200"
                >
                  {link.text}
                </a>
              </div>
            ))}
          </div>
        ) : null;

      case 'descriptionSandwich':
        return (
          <div className="space-y-3">
            {item.description && (
              <div className="pb-1">
                <p className="text-gray-700 text-sm leading-normal tracking-wide font-light">
                  {item.description}
                </p>
              </div>
            )}
            {bulletPoints.map((group, i) => {
              const hasTitle = group.groupTitle?.trim();
              const items = group.items || [];
              if (items.length === 0) return null;
              return (
                <div key={i} className="space-y-1.5">
                  {hasTitle && (
                    <h4 className="font-semibold text-gray-900 text-[16px] tracking-tight">
                      {group.groupTitle}
                    </h4>
                  )}
                  <div className={`space-y-1 ${hasTitle ? 'pl-0.5' : ''}`}>
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
              <div className="pt-2 border-t border-gray-100 mt-2">
                <p className="text-gray-700 text-sm leading-normal tracking-wide font-light pt-1.5">
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
          <div key={item._key ?? index} className="border-b border-gray-200 last:border-b-0 transition-colors duration-200">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between py-3 text-left transition-all duration-200 group px-4 md:px-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 rounded-sm"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item._key ?? index}`}
              id={`accordion-header-${item._key ?? index}`}
            >
              <span className="text-[16px] font-semibold text-gray-900 tracking-tight">
                {item.title}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-gray-700' : ''}`}
                aria-hidden="true"
              />
            </button>
            <div
              id={`accordion-content-${item._key ?? index}`}
              role="region"
              aria-labelledby={`accordion-header-${item._key ?? index}`}
              className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="px-4 md:px-0 pb-4 pt-0.5">
                {renderContent(item)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}