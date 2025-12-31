import type { ShippingDetails } from "~/lib/sanity/home";

type ShippingInfoProps = {
  shippingDetails: ShippingDetails;
};

type ShippingPoint = {
  _key: string;
  pointType: 'simple' | 'detailed';
  simplePoint?: string;
  pointTitle?: string;
  pointDescription?: string;
  showBullet?: boolean;
};

export function ShippingInfo({ shippingDetails }: ShippingInfoProps) {
  if (!shippingDetails) return null;

  return (
    <div className="w-full flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
      <div className="flex-shrink-0 mt-0.5">
        <img
          src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/icon-delivery.svg?v=1721740613&width=200&crop=center"
          alt="Delivery"
          className="w-5 h-5 text-gray-600"
          width={20}
          height={20}
          loading="lazy"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 mb-1">
          {shippingDetails.title || 'Shipping Information'}
        </h3>

        {shippingDetails.description && (
          <p className="text-sm text-gray-600 mb-2">
            {shippingDetails.description}
          </p>
        )}

        {shippingDetails.points && shippingDetails.points.length > 0 && (
          <div className="space-y-2 text-sm text-gray-600">
            {(shippingDetails.points as unknown as ShippingPoint[]).map((point) => (
              <div key={point._key} className="space-y-1">
                {point.pointType === 'simple' ? (
                  <div className="flex items-start gap-2">
                    <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2.5 flex-shrink-0" />
                    <span>{point.simplePoint}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      {point.showBullet && (
                        <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">{point.pointTitle}</p>
                        {point.pointDescription && (
                          <p className="text-gray-600">{point.pointDescription}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}