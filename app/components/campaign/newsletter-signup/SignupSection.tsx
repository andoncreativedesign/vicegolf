import { useState } from 'react';

export default function SignupSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    // TODO: Replace with real API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section className="cp-signup">
      {!submitted ? (
        <>
          <p className="cp-signup__lead">
            Sign up to the Vice Golf UAE newsletter
            <br />
            for your chance to be one of 5 lucky winners.
          </p>

          {error && <p className="cp-signup__error">{error}</p>}

          <form className="cp-signup__form" onSubmit={handleSubmit} noValidate>
            <input
              id="campaign-email"
              type="email"
              placeholder="YOUR MAIL ID HERE"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cp-signup__input"
              autoComplete="email"
              required
            />
            <button
              type="submit"
              className="cp-signup__btn"
              disabled={loading}
            >
              {loading ? 'ENTERING...' : 'ENTER NOW'}
            </button>
          </form>

          {/* Prize graphic – using the SVG instead of CSS box */}
          <div className="cp-prize">
            <img
              src="/campaign/4205_VGME_LandingPage_NewsletterSignUp_SummerOffer_v2_FA-08.svg"
              alt="Prize Outline"
              className="cp-prize__svg"
            />
            <p className="cp-prize__text">
              Each winner will receive one box of<br />
              12 Vice golf balls every month for a year.
            </p>
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
