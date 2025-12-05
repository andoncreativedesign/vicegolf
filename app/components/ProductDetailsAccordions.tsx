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
      <div className="flex items-start gap-3 py-1.5">
        <span
          className={`font-medium text-gray-900 flex-shrink-0 mt-[3px] ${hasCustom ? 'text-sm' : 'text-base'}`}
          style={{ width: hasCustom ? 'auto' : '0.75em' }}
        >
          {hasCustom ? bullet.customBullet : '•'}
        </span>
        <span className="text-gray-700 text-sm leading-relaxed tracking-wide font-light">
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
            <p className="text-gray-700 text-sm leading-relaxed tracking-wide font-light">
              {item.description}
            </p>
          </div>
        ) : null;

      case 'bulletPoints':
        if (bulletPoints.length === 0 && !item.description) return null;
        return (
          <div className="space-y-7">
            {item.description && (
              <div className="pb-2">
                <p className="text-gray-700 text-sm leading-relaxed tracking-wide font-light">
                  {item.description}
                </p>
              </div>
            )}
            {bulletPoints.map((group, i) => {
              const hasTitle = group.groupTitle?.trim();
              const items = group.items || [];
              if (items.length === 0) return null;
              return (
                <div key={i} className="space-y-4">
                  {hasTitle && (
                    <h4 className="font-semibold text-gray-900 text-sm tracking-tight pb-1">
                      {group.groupTitle}
                    </h4>
                  )}
                  <div className={`space-y-1 ${hasTitle ? 'pt-1' : ''}`}>
                    {items.map((b, j) => (
                      <div key={j}>{renderBulletLine(b)}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'inlinePoints':
        const hasInline = item.descriptionTitle || item.description || inlinePoints.length > 0;
        if (!hasInline) return null;
        return (
          <div className="space-y-6">
            {item.descriptionTitle && (
              <h4 className="font-bold text-gray-900 text-base tracking-tight">
                {item.descriptionTitle}
              </h4>
            )}
            {item.description && (
              <div className="pb-2">
                <p className="text-gray-700 text-sm leading-relaxed tracking-wide font-light">
                  {item.description}
                </p>
              </div>
            )}
            {inlinePoints.length > 0 && (
              <div className="space-y-4 pt-2">
                {inlinePoints.map((p, i) => (
                  <div key={i} className="text-sm leading-relaxed">
                    <strong className="text-gray-900 font-semibold block mb-1.5 tracking-tight">
                      {p.title}
                    </strong>
                    <p className="text-gray-700 font-light tracking-wide pl-1">
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
          <div className="space-y-7">
            {item.descriptionTitle && (
              <h4 className="font-bold text-gray-900 text-base tracking-tight">
                {item.descriptionTitle}
              </h4>
            )}
            {item.description && (
              <div className="pb-3">
                <p className="text-gray-700 text-sm leading-relaxed tracking-wide font-light">
                  {item.description}
                </p>
              </div>
            )}
            <div className="space-y-5">
              {stackedPoints.map((point, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-gray-900 mt-1 flex-shrink-0">•</span>
                  <div className="flex-1">
                    {point.title && (
                      <h5 className="font-semibold text-gray-900 text-sm mb-1.5 tracking-tight">
                        {point.title}
                      </h5>
                    )}
                    <p className={`text-sm leading-relaxed tracking-wide font-light ${point.title ? 'text-gray-700' : 'text-gray-700'}`}>
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
          <div className="space-y-3 pt-1">
            {linkPoints.map((link, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <span className="text-gray-900 mt-0.5 flex-shrink-0">•</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 text-sm leading-relaxed tracking-wide font-light underline underline-offset-2 decoration-gray-300 hover:decoration-black-700 transition-colors"
                >
                  {link.text}
                </a>
              </div>
            ))}
          </div>
        ) : null;

      case 'descriptionSandwich':
        return (
          <div className="space-y-7">
            {item.description && (
              <div className="pb-3">
                <p className="text-gray-700 text-sm leading-relaxed tracking-wide font-light">
                  {item.description}
                </p>
              </div>
            )}
            {bulletPoints.map((group, i) => {
              const hasTitle = group.groupTitle?.trim();
              const items = group.items || [];
              if (items.length === 0) return null;
              return (
                <div key={i} className="space-y-4">
                  {hasTitle && (
                    <h4 className="font-semibold text-gray-900 text-sm tracking-tight pb-1">
                      {group.groupTitle}
                    </h4>
                  )}
                  <div className={`space-y-1 ${hasTitle ? 'pt-1' : ''}`}>
                    {items.map((b, j) => (
                      <div key={j}>{renderBulletLine(b)}</div>
                    ))}
                  </div>
                </div>
              );
            })}
            {item.secondaryDescription && (
              <div className="pt-3 border-t border-gray-100 mt-5">
                <p className="text-gray-700 text-sm leading-relaxed tracking-wide font-light">
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
          <div key={item._key ?? index} className="border-b border-gray-200 last:border-b-0">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between py-6 text-left hover:bg-gray-50/50 transition-all duration-200 group px-4 md:px-0"
            >
              <span className="text-[15px] font-semibold text-gray-00 tracking-tight leading-tight">
                {item.title}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-all duration-300 flex-shrink-0 group-hover:text-gray-600 ${
                  isOpen ? 'rotate-180 text-gray-900' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
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