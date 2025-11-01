import type {ProductFragment} from 'storefrontapi.generated';
import {WhatsNew} from '~/components/WhatsNew';
import {Youtube} from '~/components/Youtube';

type GolfBallProductProps = {
  product: ProductFragment;
};

export function GolfBallProduct({product}: GolfBallProductProps) {
  return (
    <>
      {/* Reusable What's New Section */}
      <WhatsNew />

      {/* Youtube Video Section */}
      <Youtube />
    </>
  );
}
