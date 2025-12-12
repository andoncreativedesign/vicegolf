import type { Route } from './+types/privacy-policy';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Privacy Policy | Vice Golf' }];
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[91rem] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PRIVACY POLICY</h1>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section >
          <h6 className="text-4xl  font-bold text-gray-900 mb-4">Personal Details</h6>
          </section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy Policy</h3>

          <div className="mb-6">
            <p className="font-semibold text-gray-900 mb-1">USA / CANADA</p>
            <p className="font-semibold text-gray-900 mb-4">VICE SPORTING GOODS, INC. (08-28-2023)</p>
          </div>

          <div className="space-y text-gray-700 leading-relaxed">
            <p>
              When recording, processing and making use of your personal details, we adhere strictly to statutory regulations. 
              We record, store and process your details for the overall processing of your purchase, including the provision of 
              any warranties, for our service provision and technical administration and for our own marketing purposes. Your 
              details are only passed on or shared with third parties if this is necessary for processing your order or for 
              billing, or if you have given your prior consent. For example, service providers that we use will also receive 
              the data which is necessary for processing your order. The data passed on in this way may only be used by our 
              service providers to fulfil their function. Any other use of the information is not permitted. Your personal 
              details are deleted, providing this is not prevented by any statutory obligations to retain such data, if you 
              request it to be deleted, if there is no longer any requirement for it to be stored or if storing it is not 
              permitted for other legal reasons.
            </p>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Google Analytics</h4>
              <p>
                Our website uses Google Analytics, a web analysis service from Google LLC ("Google"). Google Analytics uses 
                "cookies" which are text files that are stored in your browser and which enable an analysis to be carried out 
                on your use of the website. The information about your visit to the website recorded by the cookie (including 
                your IP address) is sent to a Google server in the USA. The anonymizing function "-anonymizeIp()" is used for 
                the IP address on the website so that the IP address is stored and processed by Google only in an abbreviated 
                form using the last 8 digits. Google will use the information recorded to evaluate your visit to the website, 
                to compile reports about your browsing activity for the website administrators and to provide other services 
                associated with the use of the website and the internet. Google will also share this information with third 
                parties as necessary, if this is prescribed by law or where third parties process this data on Google's behalf. 
                Google will never link your IP address with other Google data. You can prevent the installation of cookies by 
                changing the settings in your browser. Data recording and storage by Google Analytics in general can be prevented 
                at any time using a browser extension available at{' '}
                <a href="http://tools.google.com/dlpage/gaoptout?hl=de" className="text-blue-600 hover:underline">
                  http://tools.google.com/dlpage/gaoptout?hl=de
                </a>
                , which will remain effective for the future. By using this website, you declare your agreement to Google 
                processing data obtained about you in the manner described above and for the purpose specified. If you would 
                not like information about your visit to this website to be sent to Google Analytics, you can download an 
                extension for your internet browser here{' '}
                <a href="http://tools.google.com/dlpage/gaoptout?hl=de" className="text-blue-600 hover:underline">
                  http://tools.google.com/dlpage/gaoptout?hl=de
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
