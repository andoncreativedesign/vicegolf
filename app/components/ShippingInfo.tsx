import type { ShippingDetails } from "~/lib/sanity/home";

type ShippingInfoProps = {
  shippingDetails: ShippingDetails;
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

        {/* Description as plain text */}
        {shippingDetails.description && (
          <p className="text-sm text-gray-600 mb-2">
            {shippingDetails.description}
          </p>
        )}

        {/* Points with dots */}
        {shippingDetails.points && shippingDetails.points.length > 0 && (
          <div className="space-y-1 text-sm text-gray-600">
            {shippingDetails.points.map((point) => (
              <div key={point._key} className="flex items-start gap-2">
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>{point.point}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}