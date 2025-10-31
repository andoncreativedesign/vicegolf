// app/components/ShippingInfo.tsx
import { Truck, Clock } from 'lucide-react';

export function ShippingInfo() {
  return (
    <div className="w-full border border-gray-200 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex-shrink-0 w-10 h-10 bg-black rounded-full flex items-center justify-center">
        <Truck className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
      <div className="flex-1">
        <h6 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          Premium Shipping
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
            <Clock className="h-3 w-3" />
            Fast
          </span>
        </h6>
        <div className="space-y-1">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
            Ships within 2 business days
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
            Customized balls ship within 2 weeks
          </p>
        </div>
      </div>
    </div>
  );
}