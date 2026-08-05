interface HeroSectionProps {
  heroImageDesktop?: string;
  heroImageMobile?: string;
}

export default function HeroSection({ heroImageDesktop, heroImageMobile }: HeroSectionProps) {
  return (
    <section className="cp-hero">
      <picture>
        {heroImageMobile && <source media="(max-width: 900px)" srcSet={heroImageMobile} />}
        {heroImageDesktop && <source media="(min-width: 901px)" srcSet={heroImageDesktop} />}
        <img
          src={heroImageDesktop || "/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-01.jpg"}
          alt="Win a Years Supply of Golf Balls"
          className="cp-hero__img"
        />
      </picture>
    </section>
  );
}
