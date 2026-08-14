interface HeroSectionProps {
  heroImageDesktop?: string;
  heroImageMobile?: string;
  heroAltText?: string;
}

export default function HeroSection({ heroImageDesktop, heroImageMobile, heroAltText }: HeroSectionProps) {
  return (
    <section className="cp-hero">
      <picture>
        {heroImageMobile && <source media="(max-width: 900px)" srcSet={heroImageMobile} />}
        {heroImageDesktop && <source media="(min-width: 901px)" srcSet={heroImageDesktop} />}
        <img
          src={heroImageDesktop}
          alt={heroAltText || ""}
          className="cp-hero__img"
        />
      </picture>
    </section>
  );
}
