import React from 'react';

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
  disclaimerText?: string;
}

const DEFAULT_FEATURES = [
  { icon: "/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-04.svg", title: "First access to new\nproduct drops" },
  { icon: "/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-05.svg", title: "Honest product\nreviews and gear\nrecommendations" },
  { icon: "/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-06.svg", title: "Exclusive\nsubscriber-only offers" },
  { icon: "/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-07.svg", title: "Early access to sales\nand limited releases" },
  { icon: "/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-03.svg", title: "Heads-up on local golf\nevents and activations" },
  { icon: "/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-02.svg", title: "Tips, tricks and picks to\nhelp you play smarter" },
  { icon: "/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-01.svg", title: "Competitions\n& giveaways throughout\nthe year" }
];

export default function BenefitsSection({
  heading = "SUBSCRIBE TO THE NEWSLETTER FOR",
  features,
  disclaimerText = "A year's supply of golf balls includes one box of 12 golf balls per month for 12 months, worth AED 3,000. Winners may choose any available box of Vice golf balls each month. Subject to availability. T&Cs apply."
}: BenefitsSectionProps) {
  
  const activeFeatures = features && features.length > 0 ? features.map(f => ({
    icon: f.icon?.asset?.url || '',
    title: f.title || ''
  })) : DEFAULT_FEATURES;

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
      <p className="cp-benefits__disclaimer">
        {disclaimerText}
      </p>
    </section>
  );
}
