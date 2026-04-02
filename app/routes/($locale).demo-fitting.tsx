import type { Route } from './+types/($locale).demo-fitting';
import { DemoFitting } from '~/components/DemoFitting/DemoFitting';
import { getDemoFittingData } from '~/lib/sanity/demoFitting';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: data?.demoFittingData?.seo?.title || 'Demo & Fitting | Vice Golf' }];
};

export async function loader({ context }: Route.LoaderArgs) {
  const demoFittingData = await getDemoFittingData();
  return { demoFittingData };
}

export default function DemoFittingRoute({ loaderData }: Route.ComponentProps) {
  const { demoFittingData } = loaderData;
  return (
    <div className="demo-fitting-page">
      <DemoFitting data={demoFittingData} />
    </div>
  );
}