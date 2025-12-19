import type { Route } from './+types/shipping-guide';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Customs Guide | Vice Golf' }];
};

export default function CustomsGuide() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[91rem] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CUSTOMS GUIDE</h1>
          <p className="text-lg text-gray-600">
            {/* Everything you need to know about shipping, delivery times, and order tracking */}
          </p>
        </div>

        {/* Content */}
        {/* <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          <section>
            <p className="mb-6">
              VGME Sports Trading LLC provides reliable shipping services to ensure your Vice Golf products reach you safely and on time. Below you'll find all the information you need about our shipping policies and procedures.
            </p>
          </section>

          <section>
            <h3 className="text-[1.2rem] font-bold text-gray-900 mb-4">1. Shipping Options & Delivery Times</h3>
            <p className="mb-4">
              We offer multiple shipping options to meet your needs:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Standard Shipping:</strong> 5-7 business days</li>
              <li><strong>Express Shipping:</strong> 2-3 business days</li>
              <li><strong>International Shipping:</strong> 7-14 business days (varies by destination)</li>
            </ul>
            <p>
              *Processing time: 1-2 business days for order verification and preparation.
            </p>
          </section>
          <section>
            <h3 className="text-[1.2rem] font-bold text-gray-900 mb-4">3. Shipping Rates</h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Region</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Standard</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Express</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3">UAE</td>
                    <td className="px-4 py-3">Free</td>
                    <td className="px-4 py-3">AED 30</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3">GCC</td>
                    <td className="px-4 py-3">AED 50</td>
                    <td className="px-4 py-3">AED 100</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">International</td>
                    <td className="px-4 py-3">AED 100</td>
                    <td className="px-4 py-3">AED 200</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-[1.2rem] font-bold text-gray-900 mb-4">4. International Shipping</h3>
            <p className="mb-4">
              For international orders, please note:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Customs fees and import duties may apply and are the responsibility of the recipient</li>
              <li>Delivery times may vary based on customs processing in your country</li>
              <li>All international shipments include tracking</li>
              <li>Some restrictions may apply to certain products in specific countries</li>
            </ul>
          </section>
          <section className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-[1.2rem] font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="mb-4">
              Our customer service team is here to help with any shipping-related questions or concerns.
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> <a href="mailto:support@vicegolf.com" className="text-blue-600 hover:underline">support@vicegolf.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:+97112345678" className="text-blue-600 hover:underline">+971 12 345 678</a></p>
              <p><strong>Hours:</strong> Sunday - Thursday, 9:00 AM - 6:00 PM (GST)</p>
            </div>
          </section>
        </div> */}
      </div>
    </div>
  );
}
