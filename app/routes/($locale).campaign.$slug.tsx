import { useLoaderData, isRouteErrorResponse, useRouteError, Link, useNavigation, type LoaderFunctionArgs, type ActionFunctionArgs, useActionData } from 'react-router';
import HeroSection from '~/components/campaign/newsletter-signup/HeroSection';
import SignupSection from '~/components/campaign/newsletter-signup/SignupSection';
import BenefitsSection from '~/components/campaign/newsletter-signup/BenefitsSection';
import { getCampaignDataBySlug } from '~/lib/sanity/campaign';
import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';
import { getCustomerSubscriptionStatus, processNewsletterSignup } from '~/lib/shopify/newsletter.server';

export async function loader({ params, context }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response('Not Found', { status: 404 });
  }

  const campaign = await getCampaignDataBySlug(slug, context.env);
  
  if (!campaign) {
    throw new Response('Campaign Not Found', { status: 404 });
  }

  let isLoggedIn = false;
  let customerEmail = '';
  let isSubscribed = false;

  try {
    isLoggedIn = await context.customerAccount.isLoggedIn();
    if (isLoggedIn) {
      const { data } = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY, {
        variables: { language: context.customerAccount.i18n.language },
      });
      if (data?.customer?.emailAddress?.emailAddress) {
        customerEmail = data.customer.emailAddress.emailAddress;
        
        // Check Admin API for marketing consent and tags
        const subStatus = await getCustomerSubscriptionStatus(customerEmail, slug, context.env);
        isSubscribed = subStatus.isSubscribed && subStatus.hasTag;
      }
    }
  } catch (error) {
    console.error("Error fetching customer context:", error);
  }

  return { campaign, isLoggedIn, customerEmail, isSubscribed };
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const slug = params.slug;
  if (!slug) return Response.json({ error: 'Missing campaign slug' }, { status: 400 });

  const formData = await request.formData();
  const email = formData.get('email') as string;

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Please enter a valid email address' }, { status: 400 });
  }

  const result = await processNewsletterSignup(email, slug, context.env);

  if (result.success) {
    return Response.json({ success: true, message: 'You have successfully entered the giveaway!' });
  } else {
    return Response.json({ error: result.error || 'Failed to process signup' }, { status: 500 });
  }
}

export const meta = ({ data }: any) => {
  return [
    { title: data?.campaign?.title || "Vice Golf Campaign" },
    {
      name: 'description',
      content: data?.campaign?.newsletterHeading?.replace(/\n/g, ' ') || "Join the Vice Golf campaign.",
    },
  ];
};

export default function CampaignNewsletterSignup() {
  const { campaign, isLoggedIn, customerEmail, isSubscribed } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="cp">
      <HeroSection 
        heroImageDesktop={campaign.heroImageDesktop?.asset?.url}
        heroImageMobile={campaign.heroImageMobile?.asset?.url}
        heroAltText={campaign.heroAltText}
      />
      <SignupSection 
        heading={campaign.newsletterHeading}
        description={campaign.newsletterDescription}
        prizeImage={campaign.prizeImage?.asset?.url}
        successTitle={campaign.successTitle}
        successText={campaign.successText}
        alreadyRegisteredTitle={campaign.alreadyRegisteredTitle}
        alreadyRegisteredText={campaign.alreadyRegisteredText}
        inputPlaceholder={campaign.inputPlaceholder}
        inputBgColor={campaign.inputBgColor?.hex}
        inputTextColor={campaign.inputTextColor?.hex}
        buttonText={campaign.buttonText}
        buttonBgColor={campaign.buttonBgColor?.hex}
        buttonTextColor={campaign.buttonTextColor?.hex}
        isLoggedIn={isLoggedIn}
        isSubscribed={isSubscribed}
        customerEmail={customerEmail}
        actionData={actionData}
      />
      <BenefitsSection 
        heading={campaign.benefitsHeading}
        features={campaign.features}
        disclaimerText={campaign.disclaimerText}
      />

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
    border-radius: 0 !important;
  }
  .cp-hero picture {
    display: block;
    width: 100%;
    border-radius: 0 !important;
  }
  .cp-hero__img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 0 !important;
  }

  /* ── SIGNUP SECTION ── */
  .cp-signup {
    background: #000000;
    padding: 72px 20px 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cp-signup__lead {
    font-size: 38px;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
    line-height: 1.35;
    letter-spacing: -0.01em;
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
    margin-bottom: 80px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .cp-signup__input {
    flex: 1;
    background: #ffffff;
    color: #111111;
    border: none;
    border-radius: 0 !important;
    -webkit-appearance: none;
    appearance: none;
    padding: 0 28px;
    font-size: 17px;
    font-weight: 500;
    letter-spacing: 0.05em;
    outline: none;
  }
  .cp-signup__input::placeholder {
    color: #aaaaaa;
    font-weight: 500;
    letter-spacing: 0.08em;
  }

  .cp-signup__btn {
    background: #c0df16;
    color: #000000;
    border: none;
    border-radius: 0 !important;
    -webkit-appearance: none;
    appearance: none;
    padding: 0 52px;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    transition: background 0.15s ease, transform 0.15s ease;
  }
  .cp-signup__btn:hover:not(:disabled) {
    background: #d4f02a;
  }
  .cp-signup__btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @keyframes cp-spin {
    to { transform: rotate(360deg); }
  }
  .cp-spinner {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 3px solid rgba(0,0,0,0.3);
    border-radius: 50%;
    border-top-color: #000;
    animation: cp-spin 0.8s linear infinite;
    vertical-align: middle;
  }

  @keyframes cp-success-pop {
    0% { transform: scale(0.5); opacity: 0; }
    70% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes cp-success-fade-up {
    0% { transform: translateY(15px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  .cp-success-icon {
    animation: cp-success-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  .cp-success-title {
    opacity: 0;
    animation: cp-success-fade-up 0.5s ease forwards 0.2s;
  }
  .cp-success-text {
    opacity: 0;
    animation: cp-success-fade-up 0.5s ease forwards 0.35s;
  }

  /* Prize Overlay Text Box */
  .cp-prize {
    position: relative;
    width: 100%;
    max-width: 1017px;
    margin: 0 auto 0;
    border: 2px solid #c0df16;
    border-radius: 16px;
    padding: 64px 40px;
  }
  .cp-prize__gap {
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: clamp(240px, 55%, 460px);
    max-width: calc(100% - 40px);
    height: 4px;
    background: #000000;
    z-index: 1;
  }
  .cp-prize__text {
    position: static;
    color: #ffffff;
    font-size: 38px;
    font-weight: 400;
    line-height: 1.4;
    margin: 0;
    text-align: center;
    width: 100%;
  }
  .cp-prize__gap::before, .cp-prize__gap::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    background: #c0df16;
    border-radius: 50%;
    z-index: 2;
  }
  .cp-prize__gap::before { left: -5px; }
  .cp-prize__gap::after { right: -5px; }

  .cp-prize__balls {
    width: 45%;
    max-width: 420px;
    min-width: min(220px, 100%);
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
    margin: 40px auto 32px;
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
    .cp-prize {
      padding: 48px 32px;
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
    .cp-prize {
      padding: 40px 24px;
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
      border-radius: 0;
      margin-bottom: 40px;
      background: transparent;
      gap: 12px;
    }
    .cp-signup__input {
      flex: none;
      height: 52px;
      font-size: 16px;
      padding: 0 16px;
      border-radius: 8px !important;
      width: 100%;
      text-align: center;
    }
    .cp-signup__input::placeholder {
      font-size: 14px;
      text-align: center;
      letter-spacing: 0.08em;
    }
    .cp-signup__btn {
      flex: none;
      height: 52px;
      width: 100%;
      font-size: 16px;
      padding: 0;
      border-radius: 8px !important;
      margin: 0;
    }
    .cp-prize {
      padding: 32px 16px 24px;
    }
    .cp-prize__text {
      font-size: 16px;
    }
    .cp-prize__balls {
      margin: 0 auto;
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

export function ErrorBoundary() {
  const error = useRouteError();
  const navigation = useNavigation();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  const isNavigatingToHome = navigation.state === 'loading' && navigation.location?.pathname === '/';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 24px',
      minHeight: '65vh',
      textAlign: 'center',
      backgroundColor: '#ffffff',
      fontFamily: 'inherit'
    }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: '#f5f5f5',
        color: '#000',
        marginBottom: '24px'
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <h1 style={{ 
        fontSize: '42px', 
        fontWeight: '800', 
        marginBottom: '16px', 
        color: '#000',
        letterSpacing: '-0.02em',
        lineHeight: '1.2',
        textTransform: 'uppercase'
      }}>
        {isNotFound ? "Looks like a lost ball" : "Something Went Wrong"}
      </h1>
      
      <p style={{ 
        fontSize: '16px', 
        color: '#555', 
        maxWidth: '440px', 
        marginBottom: '36px', 
        lineHeight: '1.6' 
      }}>
        {isNotFound 
          ? "The campaign you're looking for has ended, but your game doesn't have to stop here. Explore our premium golf balls, clubs, and apparel designed to lower your score."
          : "An unexpected error occurred while loading this campaign. Please try again later."}
      </p>
      
      <Link 
        to="/" 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          color: '#fff',
          padding: '0 32px',
          height: '48px',
          borderRadius: '24px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          minWidth: '220px',
          transition: 'all 0.2s ease',
          opacity: isNavigatingToHome ? 0.8 : 1,
          pointerEvents: isNavigatingToHome ? 'none' : 'auto'
        }}
        onMouseEnter={(e) => {
           if(!isNavigatingToHome) e.currentTarget.style.backgroundColor = '#333';
        }}
        onMouseLeave={(e) => {
           if(!isNavigatingToHome) e.currentTarget.style.backgroundColor = '#000';
        }}
      >
        {isNavigatingToHome ? (
          <>
            <svg 
              style={{ 
                marginRight: '12px', 
                width: '18px', 
                height: '18px', 
                animation: 'spin 1s linear infinite' 
              }} 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            RETURNING...
          </>
        ) : (
          'SHOP VICE GOLF'
        )}
      </Link>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
