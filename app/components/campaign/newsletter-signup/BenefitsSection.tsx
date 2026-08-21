import React, { useState, useEffect } from 'react';
import { Form, useNavigation } from 'react-router';
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
  successTitle?: string;
  successText?: string;
  alreadyRegisteredTitle?: string;
  alreadyRegisteredText?: string;
  namePlaceholder?: string;
  inputPlaceholder?: string;
  buttonText?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  isLoggedIn?: boolean;
  isSubscribed?: boolean;
  customerEmail?: string;
  customerName?: string;
  actionData?: any;
}

export default function BenefitsSection({
  heading,
  features,
  disclaimerText,
  successTitle,
  successText,
  alreadyRegisteredTitle,
  alreadyRegisteredText,
  namePlaceholder,
  inputPlaceholder,
  buttonText,
  buttonBgColor,
  buttonTextColor,
  isLoggedIn = false,
  isSubscribed = false,
  customerEmail = '',
  customerName = '',
  actionData,
}: BenefitsSectionProps) {
  const safeSuccessTitle = successTitle || '';
  const safeSuccessText = successText || '';
  const safeAlreadyRegisteredTitle = alreadyRegisteredTitle || '';
  const safeAlreadyRegisteredText = alreadyRegisteredText || '';
  const safeNamePlaceholder = namePlaceholder || '';
  const safeInputPlaceholder = inputPlaceholder || '';
  const safeButtonText = buttonText || '';

  const [name, setName] = useState(customerName || '');
  const [email, setEmail] = useState(customerEmail || '');
  const navigation = useNavigation();
  const loading = navigation.state === 'submitting';

  useEffect(() => {
    if (customerEmail && !email) {
      setEmail(customerEmail);
    }
    if (customerName && !name) {
      setName(customerName);
    }
  }, [customerEmail, customerName, email, name]);

  const showAlreadySubscribed = isLoggedIn && isSubscribed && !actionData?.success;
  const showSuccess = actionData?.success;

  const activeFeatures = features && features.length > 0 ? features.map(f => ({
    icon: f.icon?.asset?.url || '',
    title: f.title || ''
  })) : [];

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

      {/* Secondary Bottom Signup Form */}
      <div className="cp-benefits__form-container">
        {showAlreadySubscribed ? (
          <div className="cp-benefits__state-box">
            <div className="cp-success-icon">✓</div>
            <h3 className="cp-benefits__state-title">{safeAlreadyRegisteredTitle}</h3>
            <p className="cp-benefits__state-text">{safeAlreadyRegisteredText}</p>
          </div>
        ) : showSuccess ? (
          <div className="cp-benefits__state-box">
            <div className="cp-success-icon">✓</div>
            <h3 className="cp-benefits__state-title">{safeSuccessTitle}</h3>
            <p className="cp-benefits__state-text">{safeSuccessText}</p>
          </div>
        ) : (
          <div className="cp-signup__form-wrapper">
            {actionData?.error && <p className="cp-signup__error">{actionData.error}</p>}
            <Form method="post" className="cp-signup__form-col" noValidate>
              <input type="hidden" name="actionType" value="newsletter_signup" />
              <input
                id="campaign-name-bottom"
                name="name"
                type="text"
                placeholder={safeNamePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="cp-signup__input-field cp-signup__input-field--light"
                autoComplete="name"
                required
              />
              <input
                id="campaign-email-bottom"
                name="email"
                type="email"
                placeholder={safeInputPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cp-signup__input-field cp-signup__input-field--light"
                autoComplete="email"
                readOnly={isLoggedIn && !!customerEmail}
                required
              />
              <button
                type="submit"
                className="cp-signup__btn-standalone"
                disabled={loading}
                style={{
                  backgroundColor: buttonBgColor,
                  color: buttonTextColor,
                }}
              >
                {loading ? <div className="cp-spinner"></div> : safeButtonText}
              </button>
            </Form>
          </div>
        )}
      </div>

      <hr className="cp-benefits__divider" />
      <div className="cp-benefits__disclaimer">
        {disclaimerText ? (
          <PortableText value={disclaimerText} components={disclaimerTextComponents} />
        ) : null}
      </div>
    </section>
  );
}
