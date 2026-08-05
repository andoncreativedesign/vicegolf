import HeroSection from '~/components/campaign/newsletter-signup/HeroSection';
import SignupSection from '~/components/campaign/newsletter-signup/SignupSection';
import BenefitsSection from '~/components/campaign/newsletter-signup/BenefitsSection';

export const meta = () => {
  return [
    { title: "Win a Year's Supply of Golf Balls | Vice Golf UAE" },
    {
      name: 'description',
      content:
        "Sign up to the Vice Golf UAE newsletter for your chance to win a year's supply of golf balls. 5 lucky winners will each receive one box of 12 Vice golf balls every month for a year.",
    },
  ];
};

export default function CampaignNewsletterSignup() {
  return (
    <div className="cp">
      <HeroSection />
      <SignupSection />
      <BenefitsSection />

      <style dangerouslySetInnerHTML={{ __html: campaignStyles }} />
    </div>
  );
}

const campaignStyles = `
  .cp *, .cp *::before, .cp *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .cp {
    color: #000;
    background: #f7f7f7;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ── HERO ── */
  .cp-hero {
    width: 100%;
    line-height: 0;
    overflow: hidden;
  }
  .cp-hero__img {
    width: 100%;
    height: auto;
    display: block;
  }

  /* ── SIGNUP SECTION ── */
  .cp-signup {
    background: #000000;
    padding: 56px 20px 72px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cp-signup__lead {
    font-size: 38px;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
    line-height: 1.4;
    margin-bottom: 48px;
    max-width: 900px;
  }

  .cp-signup__error {
    color: #f87171;
    font-size: 14px;
    margin-bottom: 12px;
    text-align: center;
  }

  /* Form */
  .cp-signup__form {
    display: flex;
    width: 100%;
    max-width: 820px;
    height: 60px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 72px;
  }

  .cp-signup__input {
    flex: 1;
    background: #ffffff;
    border: none;
    border-radius: 0 !important;
    -webkit-appearance: none;
    appearance: none;
    padding: 0 32px;
    font-size: 20px;
    font-weight: 400;
    font-family: inherit;
    letter-spacing: 0.04em;
    color: #111;
    outline: none;
    min-width: 0;
  }
  .cp-signup__input::placeholder {
    color: #c5c5c5;
    letter-spacing: 0.08em;
    font-size: 20px;
    font-weight: 300;
  }

  .cp-signup__btn {
    background: #c0df16;
    color: #000;
    border: none;
    border-radius: 0 !important;
    -webkit-appearance: none;
    appearance: none;
    padding: 0 48px;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: uppercase;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    transition: background 0.15s ease;
  }
  .cp-signup__btn:hover:not(:disabled) {
    background: #d4f02a;
  }
  .cp-signup__btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Prize SVG and Overlay Text */
  .cp-prize {
    position: relative;
    width: 100%;
    max-width: 1017px;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cp-prize__svg {
    width: 100%;
    height: auto;
    display: block;
  }
  .cp-prize__text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    font-size: 38px;
    font-weight: 400;
    line-height: 1.4;
    margin: 0;
    text-align: center;
    width: 100%;
    padding: 0 40px;
    pointer-events: none;
  }

  .cp-prize__balls {
    width: 100%;
    max-width: 380px;
    margin: -48px auto 0;
    position: relative;
    z-index: 2;
  }
  .cp-prize__balls-img {
    width: 100%;
    height: auto;
    display: block;
  }

  /* Success state */
  .cp-success {
    text-align: center;
    padding: 40px 20px;
    color: #fff;
  }
  .cp-success__icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #c0df16;
    color: #000;
    font-size: 28px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }
  .cp-success h2 {
    color: #c0df16;
    font-size: 26px;
    margin-bottom: 12px;
  }
  .cp-success p {
    color: #bbbbbb;
    font-size: 16px;
    line-height: 1.6;
  }

  /* ── BENEFITS SECTION ── */
  .cp-benefits {
    background: #f7f7f7;
    padding: 64px 24px 0;
  }

  .cp-benefits__title {
    text-align: center;
    font-size: 29px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #000;
    margin-bottom: 56px;
  }

  .cp-benefits__row {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 48px 100px;
    max-width: 1160px;
    margin: 0 auto 48px;
  }
  .cp-benefits__row--center {
    margin-bottom: 0;
  }

  .cp-benefits__item {
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
  }

  .cp-benefits__icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cp-benefits__icon img {
    width: 72px;
    height: 72px;
    object-fit: contain;
  }

  .cp-benefits__item p {
    font-size: 18px;
    line-height: 1.4;
    color: #111;
    font-weight: 400;
  }

  .cp-benefits__divider {
    border: none;
    border-top: 1px solid #d0d0d0;
    max-width: 1100px;
    margin: 24px auto 32px;
  }

  .cp-benefits__disclaimer {
    max-width: 1100px;
    margin: 0 auto;
    padding-bottom: 32px;
    font-size: 15px;
    line-height: 1.6;
    color: #7a7a7a;
    text-align: left;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1100px) {
    .cp-benefits__row {
      gap: 40px 64px;
    }
  }

  @media (max-width: 900px) {
    .cp-signup__lead {
      font-size: 32px;
      margin-bottom: 32px;
    }
    .cp-prize__text {
      font-size: 32px;
    }
    .cp-signup__form {
      max-width: 100%;
    }
    .cp-benefits__row {
      gap: 32px 48px;
    }
  }

  @media (max-width: 700px) {
    .cp-signup__lead {
      font-size: 24px;
    }
    .cp-prize__text {
      font-size: 24px;
    }
    .cp-benefits__item {
      width: 160px;
    }
  }

  @media (max-width: 520px) {
    .cp-signup {
      padding: 40px 16px 56px;
    }
    .cp-signup__form {
      flex-direction: column;
      height: auto;
      border-radius: 8px;
      margin-bottom: 40px;
    }
    .cp-signup__input {
      height: 48px;
      font-size: 16px;
      padding: 0 16px;
    }
    .cp-signup__btn {
      height: 48px;
      width: 100%;
      font-size: 16px;
      padding: 0;
    }
    .cp-prize {
      max-width: 100%;
    }
    .cp-prize__text {
      font-size: 16px;
      padding: 0 16px;
    }
    .cp-prize__balls {
      margin: -32px auto 0;
    }
    .cp-benefits__title {
      font-size: 20px;
      letter-spacing: 0.08em;
      margin-bottom: 40px;
    }
    .cp-benefits__item {
      width: 140px;
    }
    .cp-benefits__disclaimer {
      font-size: 11.5px;
      margin-top: 40px;
    }
  }
`;
