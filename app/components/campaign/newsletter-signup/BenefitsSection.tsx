import React from 'react';
import { PortableText } from '@portabletext/react';

const disclaimerTextComponents = {
  block: {
    normal: ({ children }: any) => <span className="inline">{children}</span>,
  },
  marks: {
    linkExternal: ({ children, value }: any) => (
      <a href={value?.url || value?.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-black font-semibold">
        {children}
      </a>
    ),
    linkEmail: ({ children, value }: any) => (
      <a href={`mailto:${value?.email}`} className="underline hover:text-black font-semibold">
        {children}
      </a>
    ),
    linkInternal: ({ children, value }: any) => (
      <a href={value?.slug?.current || value?.href || '#'} className="underline hover:text-black font-semibold">
        {children}
      </a>
    ),
    link: ({ children, value }: any) => (
      <a href={value?.href} target={value?.newWindow ? "_blank" : undefined} rel={value?.newWindow ? "noopener noreferrer" : undefined} className="underline hover:text-black font-semibold">
        {children}
      </a>
    ),
  },
};

interface BenefitItemProps {
  iconSrc: string;
  text: React.ReactNode;
}

function BenefitItem({ iconSrc, text }: BenefitItemProps) {
  return (
    <div className="cp-benefits__item">
      <span className="cp-benefits__icon">
        <img src={iconSrc} alt="" />
      </span>
      <p>{text}</p>
    </div>
  );
}

interface Feature {
  icon?: { asset?: { url?: string } };
  title?: string;
}

interface BenefitsSectionProps {
  heading?: string;
  features?: Feature[];
  disclaimerText?: any[];
}

export default function BenefitsSection({
  heading,
  features,
  disclaimerText
}: BenefitsSectionProps) {
  const activeFeatures = features && features.length > 0 ? features.map(f => ({
    icon: f.icon?.asset?.url || '',
    title: f.title || ''
  })) : [];

  // The original layout had 4 items in the top row, and 3 items in the bottom row centered.
  const row1 = activeFeatures.slice(0, 4);
  const row2 = activeFeatures.slice(4);

  return (
    <section className="cp-benefits">
      <h2 className="cp-benefits__title">{heading}</h2>

      <div className="cp-benefits__row">
        {row1.map((feature, idx) => (
          <BenefitItem
            key={idx}
            iconSrc={feature.icon}
            text={<span dangerouslySetInnerHTML={{ __html: feature.title.replace(/\n/g, '<br />') }} />}
          />
        ))}
      </div>

      {row2.length > 0 && (
        <div className="cp-benefits__row cp-benefits__row--center">
          {row2.map((feature, idx) => (
            <BenefitItem
              key={idx}
              iconSrc={feature.icon}
              text={<span dangerouslySetInnerHTML={{ __html: feature.title.replace(/\n/g, '<br />') }} />}
            />
          ))}
        </div>
      )}

      <hr className="cp-benefits__divider" />
      <div className="cp-benefits__disclaimer">
        {disclaimerText ? (
          <PortableText value={disclaimerText} components={disclaimerTextComponents} />
        ) : null}
      </div>
    </section>
  );
}
