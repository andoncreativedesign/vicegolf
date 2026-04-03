import { StoreContactCard } from './StoreContactCard';
import type { DemoFittingData } from '~/lib/sanity/demoFitting';
import { Image } from '@shopify/hydrogen';

const DEFAULT_STORES = [
  {
    name: 'The Pro Shop',
    phone: '+971 4 835 7901',
    email: 'retail@theproshopdubai.com',
  },
  {
    name: 'Green Golf',
    phone: '+971 55 208 9557',
    email: 'dubaigreensports@gmail.com',
  }
];

export function DemoFitting({ data }: { data?: DemoFittingData | null }) {
  // Mapping with home-page UI styles extracted from HeroSection.tsx
  const heroTitle = data?.hero?.title?.text || 'TRY BEFORE YOU BUY';
  const heroTitleColor = data?.hero?.title?.color || '#FFFFFF';

  const heroSecondary = data?.hero?.secondaryText?.text;
  const heroSecondaryColor = data?.hero?.secondaryText?.color || '#FFFFFF';

  const heroBgImage = data?.hero?.backgroundImage || 'https://cdn.shopify.com/s/files/1/0886/0611/4060/files/placeholder-golf-hero.jpg';
  const mobileBgImage = data?.hero?.mobileBackgroundImage || heroBgImage;

  const bookingTitle = data?.booking?.title || 'Book your demo or fitting';
  const bookingSubtitle = data?.booking?.subtitle || 'Select one of our authorized retail partners below to schedule your personalized session.';
  const stores = data?.booking?.stores || DEFAULT_STORES;
  const whatsappMessage = data?.booking?.whatsappMessage;
  const emailSubject = data?.booking?.emailSubject;
  const emailBody = data?.booking?.emailBody;

  const paragraphs = data?.descriptionSection?.paragraphs || [
    'Choosing new clubs should be easy.',
    'With our club demos and fittings, you can get hands-on with Vice gear, test different options, and see what truly works for your game before making a decision.',
    'Whether you are upgrading your setup or trying Vice for the first time, our retail partners offer the chance to test, compare, and get expert guidance.',
    'Take your time, try the gear, and find the setup that suits you best.'
  ];

  return (
    <div className="w-full bg-white font-sans selection:bg-[#caff00] selection:text-black">
      {/* Hero Section - Exact Home Page UI Parity */}
      <section className="relative w-full h-[74vh] min-h-[490px] max-h-[740px] mx-auto overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 767px)" srcSet={mobileBgImage} />
            <Image
              data={{ url: heroBgImage, altText: heroTitle }}
              className="absolute inset-0 w-full h-full object-cover object-center"
              sizes="100vw"
              loading="eager"
            />
          </picture>
          <div className="absolute inset-0 bg-black/25 z-10" />
        </div>

        {/* Content Layer - Aligned exactly like HeroSection.tsx */}
        <div className="absolute inset-0 z-20 flex px-[clamp(1rem,4vw,3rem)] items-end justify-center md:justify-start pb-12 md:pb-6">
          <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl py-10 md:py-14 text-center md:text-left" style={{ width: '90vw', maxWidth: '1200px' }}>

            {/* Title (Matched with Home's Secondary Text style for impact) */}
            {heroTitle && (
              <h2
                className="!text-3xl md:!text-4xl lg:!text-5xl xl:!text-5xl uppercase tracking-tight leading-none mb-1 font-normal animate-fade-in"
                style={{ color: heroTitleColor }}
              >
                {heroTitle}
              </h2>
            )}

            {/* Secondary Text (Matched with Home's Description style) */}
            {heroSecondary && (
              <p
                className="!text-lg md:!text-xl lg:!text-2xl xl:!text-2xl font-thin mb-6 leading-tight animate-fade-in"
                style={{ color: heroSecondaryColor, animationDelay: '200ms' }}
              >
                {heroSecondary}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Description Content Section */}
      <div className="relative py-24 md:py-32 overflow-hidden bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="relative flex flex-col items-center">
            <div className="w-full space-y-6 md:space-y-8">
              {paragraphs.map((para, index) => (
                <div
                  key={index}
                  className="text-lg md:text-l text-gray-700 font-normal leading-relaxed text-center animate-fade-up"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  {para}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div id="booking-section" className="bg-[#f6f6f6] py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16 relative z-10">
          <div className="flex flex-col items-center text-center mb-16 px-6">
            <h2
              className="font-bold text-gray-800 mb-2 tracking-tight text-center"
              style={{ fontSize: '1.875rem' }}
            >
              {bookingTitle}
            </h2>
            <div className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto font-medium text-center leading-relaxed">
              {bookingSubtitle}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {stores.map((store, index) => (
              <StoreContactCard
                key={store.name || index}
                {...store}
                whatsappMessage={whatsappMessage}
                emailSubject={emailSubject}
                emailBody={emailBody}
              />
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-fade-up {
          animation: fadeUp 0.8s ease-out forwards;
        }
      ` }} />
    </div>
  );
}