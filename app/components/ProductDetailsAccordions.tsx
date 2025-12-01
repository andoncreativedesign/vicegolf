import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { AccordionItem } from '~/lib/sanity/products';

interface ProductDetailsAccordionsProps {
  accordions: AccordionItem[];
}

export function ProductDetailsAccordions({ accordions }: ProductDetailsAccordionsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Reusable bullet renderer
 const renderBulletLine = (bullet: { customBullet?: string; text: string }) => {
  const hasCustom = bullet.customBullet && bullet.customBullet.trim() !== '';

  return (
    <div className="flex items-start gap-3 text-sm leading-relaxed">
      <span
        className={`font-medium text-gray-900 shrink-0 ${
          hasCustom ? 'mt-0.5' : 'mt-1'
        }`}
        style={{ width: hasCustom ? 'auto' : '1em' }}
      >
        {hasCustom ? bullet.customBullet : '•'}
      </span>
      <span className="text-gray-700">{bullet.text}</span>
    </div>
  );
};

  const renderContent = (item: AccordionItem) => {
    const bulletPoints = item.bulletPoints ?? [];
    const inlinePoints = item.inlinePoints ?? [];
    const linkPoints = item.linkPoints ?? [];

    switch (item.type) {
      case 'basic':
        return item.description ? (
          <p className="text-sm text-gray-600 leading-relaxed tracking-wide">{item.description}</p>
        ) : null;

      case 'bulletPoints':
        if (bulletPoints.length === 0 && !item.description) return null;

        return (
          <div className="space-y-6">
            {item.description && (
              <p className="text-sm text-gray-600 leading-relaxed tracking-wide">{item.description}</p>
            )}

            {bulletPoints.map((group, i) => {
              const hasTitle = group.groupTitle?.trim();
              const items = group.items || [];
              if (items.length === 0) return null;

              return (
                <div key={i} className="space-y-4">
                  {hasTitle && (
                    <h4 className="font-semibold text-gray-900 text-sm pt-3 first:pt-0">
                      {group.groupTitle}
                    </h4>
                  )}
                  <div className={hasTitle ? 'mt-3 space-y-3' : 'space-y-3'}>
                    {items.map((bullet, j) => (
                      <div key={j}>{renderBulletLine(bullet)}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'inlinePoints':
        const hasContent = item.descriptionTitle || item.description || inlinePoints.length > 0;
        if (!hasContent) return null;

        return (
          <div className="space-y-5">
            {item.descriptionTitle && (
              <h4 className="font-bold text-gray-900 text-base leading-tight">
                {item.descriptionTitle}
              </h4>
            )}
            {item.description && (
              <p className="text-sm text-gray-600 leading-relaxed tracking-wide">{item.description}</p>
            )}
            {inlinePoints.length > 0 && (
              <div className="space-y-3 mt-4">
                {inlinePoints.map((p, i) => (
                  <p key={i} className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-gray-900">{p.title}:</strong> {p.description}
                  </p>
                ))}
              </div>
            )}
          </div>
        );

      case 'linkPoints':
        return linkPoints.length > 0 ? (
          <ul className="space-y-3">
            {linkPoints.map((link, i) => (
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
        ) : null;

      case 'descriptionSandwich':
        return (
          <div className="space-y-6">
            {item.description && (
              <p className="text-sm text-gray-600 leading-relaxed tracking-wide">{item.description}</p>
            )}

            {bulletPoints.map((group, i) => {
              const hasTitle = group.groupTitle?.trim();
              const items = group.items || [];
              if (items.length === 0) return null;

              return (
                <div key={i} className="space-y-4">
                  {hasTitle && (
                    <h4 className="font-semibold text-gray-900 text-sm pt-3 first:pt-0">
                      {group.groupTitle}
                    </h4>
                  )}
                  <div className={hasTitle ? 'mt-3 space-y-3' : 'space-y-3'}>
                    {items.map((bullet, j) => (
                      <div key={j}>{renderBulletLine(bullet)}</div>
                    ))}
                  </div>
                </div>
              );
            })}

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
                isOpen ? 'max-h-[2200px] pb-6' : 'max-h-0'
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