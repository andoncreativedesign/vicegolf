import type { Route } from './+types/return-policy';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Return Policy | Vice Golf' }];
};

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[91rem] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">RETURN POLICY</h1>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          <div className="space-y">
            <section>
              <h3 className="text-[1.2rem]  font-bold text-gray-900 mb-4">1. Non-Deliverable Shipments</h3>
              <p className="mb-4">
                A shipment may be non-deliverable if:
                <ol>
                  <li>- Address is incorrect</li>
                  <li>- Customer unavailable</li>
                  <li>- Duties/taxes unpaid</li>
                  <li>- Items prohibited by destination customs</li>
                </ol>
             </p>
            </section>
             <section>
              <h3 className="text-[1.2rem]  font-bold text-gray-900 mb-4">2. Return Shipping Fees</h3>
              <p className="mb-4">
                Return shipping fees equal the original outbound fee and are deducted from any refund.             
                 </p>
            </section>
             <section>
              <h3 className="text-[1.2rem]  font-bold text-gray-900 mb-4">3. Customs Charges on Returns</h3>
              <p className="mb-4">
                Some countries charge duties or VAT even on returns; these are non-refundable.
              </p>
            </section>

            <section>
              <h3 className="text-[1.2rem]  font-bold text-gray-900 mb-4">4. Refund Eligibility</h3>
             <p>Refunds apply only when:</p>
              <ol className="list-decimal pl-6 space-y-">
                <li>- Product is returned in original condition</li>
                <li>- Failure is not due to customer refusal, incorrect address, or unpaid duties</li>
              </ol>
              <p>Refunds do NOT apply if customs destroys or refuses the shipment.</p>
            </section>

            <section>
              <h3 className="text-[1.2rem]  font-bold text-gray-900 mb-4">5. Delivery Delays</h3>
              <p className="mb-4">
                 Delays caused by customs, inspections, weather, or other uncontrollable factors do not qualify for shipping refunds
               </p>
            </section>

            <section>
              <h3 className="text-[1.2rem]  font-bold text-gray-900 mb-4">6. Lost or Damaged Shipments</h3>
              <p className="mb-4">
            Without insurance:
            <ol>
              <li>- Compensation capped at USD 25 (GCC) and USD 100 (international)</li>
              </ol>
              </p>
              <p>
             With insurance:
              <ol>
                <li>- Claims will be processed per declared value.</li>
              </ol>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
