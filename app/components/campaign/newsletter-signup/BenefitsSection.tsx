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

export default function BenefitsSection() {
  return (
    <section className="cp-benefits">
      <h2 className="cp-benefits__title">SUBSCRIBE TO THE NEWSLETTER FOR</h2>

      {/* Row 1 – 4 items */}
      <div className="cp-benefits__row">
        <BenefitItem
          iconSrc="/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-04.svg"
          text={
            <>
              First access to new<br />product drops
            </>
          }
        />
        <BenefitItem
          iconSrc="/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-05.svg"
          text={
            <>
              Honest product<br />reviews and gear<br />recommendations
            </>
          }
        />
        <BenefitItem
          iconSrc="/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-06.svg"
          text={
            <>
              Exclusive<br />subscriber-only offers
            </>
          }
        />
        <BenefitItem
          iconSrc="/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-07.svg"
          text={
            <>
              Early access to sales<br />and limited releases
            </>
          }
        />
      </div>

      {/* Row 2 – 3 items centered */}
      <div className="cp-benefits__row cp-benefits__row--center">
        <BenefitItem
          iconSrc="/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-03.svg"
          text={
            <>
              Heads-up on local golf<br />events and activations
            </>
          }
        />
        <BenefitItem
          iconSrc="/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-02.svg"
          text={
            <>
              Tips, tricks and picks to<br />help you play smarter
            </>
          }
        />
        <BenefitItem
          iconSrc="/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-01.svg"
          text={
            <>
              Competitions<br />&amp; giveaways throughout<br />the year
            </>
          }
        />
      </div>

      <hr className="cp-benefits__divider" />
      <p className="cp-benefits__disclaimer">
        A year&apos;s supply of golf balls includes one box of 12 golf balls
        per month for 12 months, worth AED 3,000. Winners may choose any
        available box of Vice golf balls each month. Subject to availability.
        T&amp;Cs apply.
      </p>
    </section>
  );
}
