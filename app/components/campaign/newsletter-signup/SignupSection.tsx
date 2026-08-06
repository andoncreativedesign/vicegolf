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
          textAlign: 'center'
        }}>
          <div style={{
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
          <h2 style={{ 
            color: '#c0df16', 
            fontSize: '32px', 
            fontWeight: '900',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            margin: '0 0 12px 0'
          }}>
            Already Registered
          </h2>
          <p style={{
            color: '#b0b0b0',
            fontSize: '18px',
            fontWeight: '500',
            maxWidth: '400px',
            lineHeight: '1.5'
          }}>
            You are securely on the list for this giveaway. Keep an eye on your inbox!
          </p>
        </div>
      ) : showSuccess ? (
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '48px auto 64px',
          textAlign: 'center'
        }}>
          <div style={{
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
          <h2 style={{ 
            color: '#c0df16', 
            fontSize: '32px', 
            fontWeight: '900',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            margin: '0 0 12px 0'
          }}>
            Successfully Entered
          </h2>
          <p style={{
            color: '#b0b0b0',
            fontSize: '18px',
            fontWeight: '500',
            maxWidth: '400px',
            lineHeight: '1.5'
          }}>
            Thanks for signing up! We will contact the 5 lucky winners very soon.
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
              {loading ? 'ENTERING...' : buttonText}
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
