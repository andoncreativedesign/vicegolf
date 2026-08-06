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
      {showAlreadySubscribed ? (
        <div className="cp-success" style={{ marginTop: '20px' }}>
          <div className="cp-success__icon" style={{ borderColor: '#c0df16', color: '#c0df16' }}>✓</div>
          <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Already Subscribed</h2>
          <p style={{ color: '#c5c5c5', fontSize: '18px' }}>
            You are already subscribed to the newsletter.<br />Good luck in the giveaway!
          </p>
        </div>
      ) : !showSuccess ? (
        <>
          <p 
            className="cp-signup__lead"
            dangerouslySetInnerHTML={{ __html: heading.replace(/\n/g, '<br />') }}
          />

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
        </>
      ) : (
        <div className="cp-success">
          <div className="cp-success__icon">✓</div>
          <h2>You are in!</h2>
          <p>
            Thanks for signing up. Good luck — we will contact the 5 winners
            via email soon.
          </p>
        </div>
      )}
    </section>
  );
}
