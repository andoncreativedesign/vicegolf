import type { Route } from './+types/($locale).scan-offers';
import { ScanOffers } from '~/components/ScanOffers/ScanOffers';
import { getScanOffersData } from '~/lib/sanity/scanOffers';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: data?.scanOffersData?.seo?.title || 'Scan Offers | Vice Golf' }];
};

export async function loader({ context }: Route.LoaderArgs) {
  const scanOffersData = await getScanOffersData();
  return { scanOffersData };
}

export default function ScanOffersRoute({ loaderData }: Route.ComponentProps) {
  const { scanOffersData } = loaderData;
  return (
    <div className="scan-offers-page">
      <ScanOffers data={scanOffersData} />
    </div>
  );
}