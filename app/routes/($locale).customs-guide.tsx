import type { Route } from './+types/shipping-guide';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Customs Guide | Vice Golf' }];
};

export default function CustomsGuide() {
  return (
   <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[91rem] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CUSTOMS GUIDE</h1>
        </div>
        <div className=" mb-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">DUTIES & TAXES CUSTOMS GUIDE</h1>
        </div>
        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          <div className="spacex-y">
            <section>
              <p className="mb-4">
              International shipments may be subject to duties and taxes charged by the destination country.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Duties & Taxes?</h2>
              <p className="mb-4">
                These may include:
                <ol>
                    <li>- Customs duties</li>
                    <li>- VAT / GST</li>
                    <li>- Clearance fees</li>
                    <li>- Regulatory charges</li>        
                </ol>
              </p>
            </section>

            {/* <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Who Pays These Charges?</h2>
              <p className="mb-4">
               The customer/sender pays these charges, usually at check out..
              </p>          
            </section> */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How Are Charges Calculated?</h2>
              <p className="mb-4">
                Based on:
                <ol>
                    <li>- Declared value</li>
                    <li>- Product type</li>
                    <li>- Destination-country tax rules</li>
                    <li>- Local customs frameworks</li>        
                </ol>
              </p>
            </section>
              <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Can VGME Predict These Costs?</h2>
              <p className="mb-4">
             Yes, with a high degree of certainty, as every country has different regulations. Estimates will be provided where possible.              </p>        
            </section>
              <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Customs Clearance Delays</h2>
              <p className="mb-4">
               Customs may require inspections, documents, or value verification. These delays are outside VGME’s control.
              </p>
            </section>
              <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Rejected Shipments</h2>
              <p className="mb-4">
               If duties are not paid or items are prohibited, shipments may be returned or seized. Return shipping costs apply and may not be refundable.              </p>       
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}