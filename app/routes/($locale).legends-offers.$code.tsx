import type { Route } from './+types/($locale).legends-offers.$code';
import { ScanOffers } from '~/components/ScanOffers/ScanOffers';
import { getScanOffersData } from '~/lib/sanity/scanOffers';
import { GET_CODE_DISCOUNT_QUERY } from '~/graphql/admin/DiscountQuery';
import { axiosShopifyAdmin } from '~/utils/axiosInsatances';
import { redirect } from 'react-router';

export const meta: Route.MetaFunction = ({ data }: any) => {
  return [{ title: data?.scanOffersData?.seo?.title || 'Scan Offers | Vice Golf' }];
};

export async function loader({ params, context }: Route.LoaderArgs) {
  const { code } = params;
  
  if (!code) {
    return redirect('/');
  }

  const scanOffersData = await getScanOffersData();
  const featuredProductCode = scanOffersData?.featuredProductDiscountCode;

  let discountValue = null;
  try {
    const response = await axiosShopifyAdmin.post('', {
      query: GET_CODE_DISCOUNT_QUERY,
      variables: {
        code: code
      }
    });
    
    const node = response.data?.data?.codeDiscountNodeByCode;
    
    if (!node) {
      console.log(`Discount code ${code} not found, redirecting to home.`);
      return redirect('/');
    }
    
    discountValue = node.codeDiscount?.customerGets?.value;
  } catch (error) {
    console.error('Error fetching discount code:', error);
    return redirect('/');
  }

  return { scanOffersData, discountValue, code };
}

export default function ScanOffersRoute({ loaderData }: Route.ComponentProps) {
  const { scanOffersData, discountValue, code } = loaderData;
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