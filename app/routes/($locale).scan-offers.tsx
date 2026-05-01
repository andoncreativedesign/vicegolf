import type { Route } from './+types/($locale).scan-offers';
import { ScanOffers } from '~/components/ScanOffers/ScanOffers';
import { getScanOffersData } from '~/lib/sanity/scanOffers';
import { GET_CODE_DISCOUNT_QUERY } from '~/graphql/admin/DiscountQuery';
import { axiosShopifyAdmin } from '~/utils/axiosInsatances';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: data?.scanOffersData?.seo?.title || 'Scan Offers | Vice Golf' }];
};

export async function loader({ context }: Route.LoaderArgs) {
  const scanOffersData = await getScanOffersData();
  
  let discountValue = null;
  if (scanOffersData?.featuredProductDiscountCode) {
    try {
      const response = await axiosShopifyAdmin.post('', {
        query: GET_CODE_DISCOUNT_QUERY,
        variables: {
          query: `code:${scanOffersData.featuredProductDiscountCode}`
        }
      });
      
      const nodes = response.data?.data?.codeDiscountNodes?.nodes;
      if (nodes && nodes.length > 0) {
        discountValue = nodes[0].codeDiscount?.customerGets?.value;
      }
    } catch (error) {
      console.error('Error fetching discount code:', error);
    }
  }

  return { scanOffersData, discountValue };
}

export default function ScanOffersRoute({ loaderData }: Route.ComponentProps) {
  const { scanOffersData, discountValue } = loaderData;
  return (
    <div className="scan-offers-page">
      <ScanOffers data={scanOffersData} discountValue={discountValue} />
    </div>
  );
}