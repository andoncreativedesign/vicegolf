import type { Route } from './+types/terms-of-service';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Terms of Service | Vice Golf' }];
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[91rem] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TERMS OF SERVICE</h1>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          <div className="space-y">
            <section >
              <p className="mb-6 " >
              VGME Sports Trading LLC provides international shipping services in partnership with ASYAD Express and other authorized logistics providers. By placing an international order on our website, you agree to the terms outlined below.
              </p>
            </section>

            <section>
              <h3 className="text-[1.2rem] font-semibold text-gray-900 mb-4">1. Shipping Services</h3>
              <p className="mb-4">
                We offer door-to-door international delivery from the GCC to selected global destinations. All shipments include tracking. Transit times are estimates only and measured in business days.
              </p>
            </section>

            <section>
              <h3 className="text-[1.2rem] font-semibold text-gray-900 mb-4">2. Customer Responsibilities</h3>
              <p className="mb-4">
                Customers must:
                <ol>
                    <li>- Provide accurate shipping details</li>
                    <li>- Ensure items comply with import regulations</li>
                    <li>- Submit documents required for customs</li>
                    <li>- Pay duties, VAT, and any governmental charges</li>
                </ol>
              </p>
            </section>

            <section>
              <h3 className="text-[1.2rem] font-semibold text-gray-900 mb-4">3. Shipping Rates</h3>
              <p className="mb-4">
                Shipping fees are based on weight, volumetric weight, and destination. Estimated Duties and taxes are included.
              </p>
            </section>

            <section>
              <h3 className="text-[1.2rem] font-semibold text-gray-900 mb-4">4. Customs, Duties & Taxes</h3>
              <p className="mb-4">
                All duties, VAT, and customs charges are paid by the customer. These costs are set by the destination country.
              </p>
            </section>

            <section>
              <h3 className="text-[1.2rem] font-semibold text-gray-900 mb-4">5. Shipping Insurance</h3>
              <p className="mb-4">
               Optional insurance is available. If not purchased, liability is limited to:
               <ol>
                <li>- USD 25 (GCC shipments)</li>
                <li>- USD 100 (international shipments)</li>
               </ol>
              </p>
            </section>

            <section>
              <h3 className="text-[1.2rem] font-semibold text-gray-900 mb-4">6. Prohibited or Restricted Items</h3>
              <p className="mb-4">
              Customers must ensure items meet destination import rules.            
               </p>
            </section>

            <section>
              <h3 className="text-[1.2rem] font-semibold text-gray-900 mb-4">7. Failed Deliveries & Return to Sender</h3>
              <p className="mb-4">
                Return shipping fees equal the original outbound fee and apply when deliveries fail due to customer-related issues.             
              </p>
            </section>

            <section>
              <h3 className="text-[1.2rem] font-semibold text-gray-900 mb-4">8. Force Majeure</h3>
              <p className="mb-4">
               Gateway is not liable for delays outside its control, including customs delays, weather, strikes, or regulatory actions.           
               </p>
             </section>
             <section>
              <h3 className="text-[1.2rem] font-semibold text-gray-900 mb-4">9. Governing Law</h3>
              <p className="mb-4">
              This policy is governed by UAE law. For ASYAD shipments, applicable international conventions may apply.           
           </p>
            </section>
             <section>
              <h3 className="text-[1.2rem]  font-semibold text-gray-900 mb-4"> 10. Amendments</h3>
              <p className="mb-4">
               The online version at the time of purchase applies. Gateway may update terms at any time.       
         </p>
         </section>
          </div>
        </div>
      </div>
    </div>
  );
}
