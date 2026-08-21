import { useState, useEffect } from 'react';
import { Form, useNavigation } from 'react-router';

interface SignupSectionProps {
  heading?: string;
  description?: string;
  prizeImage?: string;
  prizeImageMobile?: string;
  successTitle?: string;
  successText?: string;
  alreadyRegisteredTitle?: string;
  alreadyRegisteredText?: string;
  namePlaceholder?: string;
  inputPlaceholder?: string;
  inputBgColor?: string;
  inputTextColor?: string;
  buttonText?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  isLoggedIn?: boolean;
  isSubscribed?: boolean;
  customerEmail?: string;
  customerName?: string;
  actionData?: any;
}

function formatText(text: string) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');
}

export default function SignupSection({
  heading,
  description,
  prizeImage,
  prizeImageMobile,
  successTitle,
  successText,
  alreadyRegisteredTitle,
  alreadyRegisteredText,
  namePlaceholder,
  inputPlaceholder,
  inputBgColor,
  inputTextColor,
  buttonText,
  buttonBgColor,
  buttonTextColor,
  isLoggedIn = false,
  isSubscribed = false,
  customerEmail = '',
  customerName = '',
  actionData
}: SignupSectionProps) {
  const safeHeading = heading || '';
  const safeDescription = description || '';
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

  return (
    <section className="cp-signup">
      <p
        className="cp-signup__lead"
        dangerouslySetInnerHTML={{ __html: formatText(safeHeading) }}
      />

      {showAlreadySubscribed ? (
        <div className="cp-signup__state-box">
          <div className="cp-success-icon">✓</div>
          <h2 className="cp-success-title">
            {safeAlreadyRegisteredTitle}
          </h2>
          <p 
            className="cp-success-text"
            dangerouslySetInnerHTML={{ __html: formatText(safeAlreadyRegisteredText) }}
          />
        </div>
      ) : showSuccess ? (
        <div className="cp-signup__state-box">
          <div className="cp-success-icon">✓</div>
          <h2 className="cp-success-title">
            {safeSuccessTitle}
          </h2>
          <p 
            className="cp-success-text"
            dangerouslySetInnerHTML={{ __html: formatText(safeSuccessText) }}
          />
        </div>
      ) : (
        <div className="cp-signup__form-wrapper">
          {actionData?.error && <p className="cp-signup__error">{actionData.error}</p>}
          <Form method="post" className="cp-signup__form-col" noValidate>
            <input type="hidden" name="actionType" value="newsletter_signup" />
            <input
              id="campaign-name-top"
              name="name"
              type="text"
              placeholder={safeNamePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="cp-signup__input-field cp-signup__input-field--dark"
              autoComplete="name"
              style={{
                backgroundColor: inputBgColor,
                color: inputTextColor,
              }}
              required
            />
            <input
              id="campaign-email-top"
              name="email"
              type="email"
              placeholder={safeInputPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cp-signup__input-field cp-signup__input-field--dark"
              autoComplete="email"
              readOnly={isLoggedIn && !!customerEmail}
              style={{
                backgroundColor: inputBgColor,
                color: inputTextColor,
              }}
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

      <div className="cp-prize">
        <p
          className="cp-prize__text"
          dangerouslySetInnerHTML={{ __html: formatText(safeDescription) }}
        />
        <div className="cp-prize__gap"></div>
      </div>

      <div className="cp-prize__balls">
        {(prizeImage || prizeImageMobile) && (
          <picture>
            {prizeImageMobile && <source media="(max-width: 900px)" srcSet={prizeImageMobile} />}
            {prizeImage && <source media="(min-width: 901px)" srcSet={prizeImage} />}
            <img
              src={prizeImage || prizeImageMobile}
              alt="Campaign Prize"
              className="cp-prize__balls-img"
            />
          </picture>
        )}
      </div>
    </section>
  );
}
