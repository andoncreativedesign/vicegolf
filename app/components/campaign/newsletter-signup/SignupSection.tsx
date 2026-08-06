import { useState, useEffect } from 'react';
import { Form, useNavigation } from 'react-router';

interface SignupSectionProps {
  heading?: string;
  description?: string;
  inputPlaceholder?: string;
  inputBgColor?: string;
  inputTextColor?: string;
  buttonText?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  isLoggedIn?: boolean;
  isSubscribed?: boolean;
  customerEmail?: string;
  actionData?: any;
}

export default function SignupSection({
  heading = "Sign up to the Vice Golf UAE newsletter\nfor your chance to be one of 5 lucky winners.",
  description = "Each winner will receive one box of\n12 Vice golf balls every month for a year.",
  inputPlaceholder = "YOUR MAIL ID HERE",
  inputBgColor,
  inputTextColor,
  buttonText = "ENTER NOW",
  buttonBgColor,
  buttonTextColor,
  isLoggedIn = false,
  isSubscribed = false,
  customerEmail = '',
  actionData
}: SignupSectionProps) {
  const [email, setEmail] = useState(customerEmail || '');
  const navigation = useNavigation();
  const loading = navigation.state === 'submitting';

  useEffect(() => {
    if (customerEmail && !email) {
      setEmail(customerEmail);
    }
  }, [customerEmail, email]);

  const showAlreadySubscribed = isLoggedIn && isSubscribed && !actionData?.success;
  const showSuccess = actionData?.success;

  return (
    <section className="cp-signup">
      <p
        className="cp-signup__lead"
        dangerouslySetInnerHTML={{ __html: heading.replace(/\n/g, '<br />') }}
      />

      {showAlreadySubscribed ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '48px auto 64px',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <div 
            className="cp-success-icon"
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            backgroundColor: '#c0df16',
            color: '#000',
            borderRadius: '50%',
            fontWeight: '900',
            fontSize: '28px',
            marginBottom: '20px',
            boxShadow: '0 0 20px rgba(192, 223, 22, 0.4)'
          }}>✓</div>
          <h2 
            className="cp-success-title"
            style={{
            color: '#c0df16',
            fontSize: 'clamp(24px, 7vw, 32px)',
            fontWeight: '900',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            margin: '0 0 12px 0'
          }}>
            You're on the list.
          </h2>
          <p 
            className="cp-success-text"
            style={{
            color: '#b0b0b0',
            fontSize: 'clamp(15px, 4vw, 18px)',
            fontWeight: '500',
            maxWidth: '400px',
            lineHeight: '1.5'
          }}>
            Your spot is already secured. We'll be drawing the 5 lucky winners soon—keep a close eye on your inbox!
          </p>
        </div>
      ) : showSuccess ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '48px auto 64px',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <div 
            className="cp-success-icon"
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            backgroundColor: '#c0df16',
            color: '#000',
            borderRadius: '50%',
            fontWeight: '900',
            fontSize: '28px',
            marginBottom: '20px',
            boxShadow: '0 0 20px rgba(192, 223, 22, 0.4)'
          }}>✓</div>
          <h2 
            className="cp-success-title"
            style={{
            color: '#c0df16',
            fontSize: 'clamp(24px, 7vw, 32px)',
            fontWeight: '900',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            margin: '0 0 12px 0'
          }}>
            Entry Confirmed!
          </h2>
          <p 
            className="cp-success-text"
            style={{
            color: '#b0b0b0',
            fontSize: 'clamp(15px, 4vw, 18px)',
            fontWeight: '500',
            maxWidth: '400px',
            lineHeight: '1.5'
          }}>
            You're officially in the draw. Keep a close eye on your inbox—we'll be notifying the 5 lucky winners very soon. Good luck!
          </p>
        </div>
      ) : (
        <>
          {actionData?.error && <p className="cp-signup__error">{actionData.error}</p>}
          <Form method="post" className="cp-signup__form" noValidate>
            <input type="hidden" name="actionType" value="newsletter_signup" />
            <input
              id="campaign-email"
              name="email"
              type="email"
              placeholder={inputPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cp-signup__input"
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
              className="cp-signup__btn"
              disabled={loading}
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor,
              }}
            >
              {loading ? <div className="cp-spinner"></div> : buttonText}
            </button>
          </Form>
        </>
      )}

      <div className="cp-prize">
        <p
          className="cp-prize__text"
          dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br />') }}
        />
      </div>

      <div className="cp-prize__balls">
        <img
          src="/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA Balls-01.jpg"
          alt="12 Vice Golf Balls"
          className="cp-prize__balls-img"
        />
      </div>
    </section>
  );
}
