// app/components/ShippingInfo.tsx
import { Truck } from 'lucide-react';

export function ShippingInfo() {
  return (
    <div className="w-full max-w-lg border border-gray-200 bg-white rounded-xl p-4 flex items-start gap-3 shadow-sm">
      <div className="mt-1 text-gray-700 flex-shrink-0">
        <Truck className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <div>
        <h6 className="text-sm font-semibold text-gray-900">Shipping</h6>
        <p className="text-sm text-gray-600">Ships within 2 business days</p>
        <p className="text-sm text-gray-600">Customized balls ship within 2 weeks</p>
      </div>
    </div>
  );
}
