import type { Route } from './+types/($locale).legends-offers.$code';
import { ScanOffers } from '~/components/ScanOffers/ScanOffers';
import { getScanOffersData, getScanBookingData } from '~/lib/sanity/scanOffers';
import { getDiscount } from '~/utils/discounts.server';
import { redirect } from 'react-router';
import { useEffect } from 'react';

export const meta: Route.MetaFunction = ({ data }: any) => {
  return [{ title: data?.scanOffersData?.seo?.title || 'Legends Offers | Vice Golf' }];
};

export async function loader({ params, context }: Route.LoaderArgs) {
  const { code } = params;

  if (!code) {
    return redirect('/');
  }

  const [scanOffersData, bookingData] = await Promise.all([
    getScanOffersData(),
    getScanBookingData()
  ]);

  if (scanOffersData && bookingData) {
    scanOffersData.booking = bookingData
  }

  const verificationCode = scanOffersData?.verificationCode?.trim();
  const featuredProductCode = scanOffersData?.featuredProductDiscountCode;


  if (code?.trim() !== verificationCode || !verificationCode) {
    console.log(`Code mismatch - URL code: ${code}, Sanity code: ${verificationCode}`);
    return redirect('/');
  }

  const { env } = context;
  const discount = await getDiscount(featuredProductCode || '', env);

  if (!discount) {
    console.log(`Featured product discount code ${featuredProductCode} not found or inactive, redirecting to home.`);
    return redirect('/');
  }

  const discountValue = discount.percentage > 0 
    ? { percentage: discount.percentage } 
    : { amount: discount.amount };

  return { scanOffersData, discountValue, code: featuredProductCode, discount };
}

export default function ScanOffersRoute({ loaderData }: Route.ComponentProps) {
  const { scanOffersData, discountValue, code, discount } = loaderData;

  useEffect(() => {
    console.log("Code from loader", code);
    console.log("Discount from loader", discount);
    if (code) {
      localStorage.setItem('featuredDiscountCode', code);
      if (discount) {
        localStorage.setItem('featuredDiscountData', JSON.stringify(discount));
      }
    }
  }, [code, discount]);

  return (
    <div className="scan-offers-page">
      <ScanOffers
        data={scanOffersData}
        discountValue={discountValue}
        overrideCode={code}
      />
    </div>
  );
}