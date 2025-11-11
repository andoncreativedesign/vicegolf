// app/components/ShippingInfo.tsx
export function ShippingInfo() {
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
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">Free shipping</span>
          <span className="text-[10px] font-medium text-white bg-blue-600 rounded-full px-1.5 py-0.5 leading-none">
            Free
          </span>
        </div>
        <div className="mt-1.5 space-y-1.5">
          <p className="text-xs text-gray-600 flex items-start gap-1.5">
            <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
            <span>Standard: Ships within 2 business days</span>
          </p>
          <p className="text-xs text-gray-600 flex items-start gap-1.5">
            <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
            <span>Customized balls: Ships within 2 weeks</span>
          </p>
        </div>
      </div>
    </div>
  );
}