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
            <p className="font-semibold text-gray-900 mb-1">United Arab Emirates (UAE)</p>
            <p className="font-semibold text-gray-900 mb-4">VICE SPORTING GOODS</p>
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
<br />
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
  <br />
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Shopify</h4>
              <p className="mb-10">
                Our store is hosted by <strong> Shopify Inc.</strong> When you visit or make a purchase on our website, Shopify processes your personal data (including purchase data) to provide us with services and analytics, 
                and to improve products and services across the Shopify platform. This includes the use of your data together with data from other Shopify merchants to generate insights and power advanced features 
                (Shopify Network Intelligence).
               </p>
               <br />
                <p className="mb-4">
                  For more information on how Shopify handles your data, please refer to  
                  <a href="https://www.shopify.com/in/legal/privacy/consumers" className="text-blue-600 hover:text-blue-800 hover:underline"> Shopify's Consumer Privacy Policy.</a>
                 </p>
                 <br />
                 <p className="mb-4">
               You can also manage or opt out of Shopify's use of your data via 
                <a href="https://privacy.shopify.com/en" className="text-blue-600 hover:text-blue-800 hover:underline"> Shopify's Privacy Portal.</a>
              </p>
            </div>
  <br />
             <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Facebook</h4>
              <p className="mb-4">
                Our website also uses plug-ins for the social networking site facebook.com, which is operated by Facebook Inc., 1601 S. California Ave, Palo Alto, CA 94304, USA ("Facebook"). If you access one of our webpages that uses one of these plug-ins, a link is created to the Facebook servers and the plug- in is shown on the page as a result of this information being reported to your browser. As a result, the
               </p>
               <br />
                <p className="mb-4">
                 Facebook server is sent information regarding which of our webpages you visited. If you are currently logged into Facebook, Facebook allocates this information to your personal Facebook user account. When you use the plug-in functions (e.g. clicking the "Like" button or adding a comment), this information is also allocated to your Facebook account. You can prevent this by logging out of Facebook before using the plug-in. You can find further information about the way Facebook stores and uses your data, about your rights in relation to this and the options for protecting your private sphere in Facebook's data protection information.                 
                 </p>
            </div>
<br />
                <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Microsoft Clarity</h4>
              <p className="mb-4">
                 We partner with Microsoft Clarity and Microsoft Advertising to capture how you use and interact with our website through behavioral metrics, heatmaps, and session replay to improve and market our products/services. Website usage data is captured using first and third-party cookies and other tracking technologies to determine the popularity of products/services and online activity. Additionally, we use this information for site optimization, fraud/security purposes, and advertising. For more information about how Microsoft collects and uses your data, visit the
                 <a href="https://www.microsoft.com/en-us/privacy/privacystatement" className="text-blue-600 hover:text-blue-800 hover:underline"> Microsoft Privacy Statement. </a>
               </p>
            </div>
<br />
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Klaviyo</h4>
              <p className="mb-4">
                We use Klaviyo to manage and deliver our email and SMS marketing campaigns. Klaviyo helps us send newsletters, product updates, promotional offers, and personalized messages based on your interactions with our website and your stated preferences. For this purpose, your contact information (such as email address or phone number) and related usage data may be processed to ensure that communications are relevant and timely.&nbsp;You can opt out of receiving marketing emails at any time by clicking the unsubscribe link in our emails or contacting customer support. To stop receiving SMS messages, you may reply “STOP” to any message or contact customer support. For more information, please visit the
                <a href="https://privacy.klaviyo.com/policies/en/" className="text-blue-600 hover:text-blue-800 hover:underline"> Klaviyo Privacy Policy.</a>
               </p>
            </div>
<br />
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">E-mail policy</h4>
              <p className="mb-4">
                We collect the e-mail addresses of those who communicate with us via e-mail and those who voluntarily include their e-mail addresses when ordering online. We may also collect your e-mail address if you provide it in the process of completing survey information or registering for online contests. We can’t obtain your e-mail address unless you voluntarily provide it to us, or we obtain it from a service company that has confirmed your willingness to distribute it.               
                </p>     
                <br /> 
               <p className="mb-4">
                  Other than the exceptions noted above, we will not sell, share or otherwise distribute your e-mail address. Any e-mail address supplied directly to us with respect to online orders, catalog requests, and requests for other information will remain in the sole possession of Vice Sporting Goods, Inc.&nbsp;If you do not want to receive promotional e-mail from us in the future, please let us know by contacting us by email (info@vgmesportstrading.com)&nbsp;and telling us that you do not want to receive promotional e-mail from us. Supplied e-mail addresses on our customer registration form will be used for order confirmation and alerts relating to an order.
                 </p>
                 <br />
                 <p>
                  If you supply us with your postal address online, you may receive periodic mailings from us with information on new products and services or upcoming events. If you do not wish to receive such mailings, please contact us by email (info@vgmesportstrading.com) or by calling us at the above telephone numbers.
                 </p>
            </div>
<br />
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Text Message Policy</h4>
              <p className="mb-4">
                 With your consent, we may send you text messages marketing our products and services to the cell phone number you have provided to us. We use the so-called double opt-in procedure for sending marketing text messages. This means that we will not send you marketing text messages, unless you have expressly consented that you agree to the sending of the marketing text messages. We will then send you a confirmation text asking you to confirm that you wish to receive future text messages by clicking a link or responding to the confirmation text message. By doing so, you give us your consent to the use of your personal data including in accordance with Art.6(1) point a GDPR. If you would no longer like to receive text messages you may type “stop” in response to a text message or by contacting customer support.
               </p>
               <br />
                <p className="mb-4">
                 We will not share your Text message opt-in or consent status with any third party for purposes unrelated to providing the messaging service. We may share this data with vendors who help us deliver text messages, including platform providers and phone companies.
                 </p>
            </div>
<br />
            {/* section added for google oauth verification*/}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Google OAuth Authentication</h4>
              <p>
                Our application uses Google OAuth to enable secure user sign-in.
                During this process, we access only the user’s email address and publicly available profile information.
                This data is used exclusively for authentication and account management purposes and is not used for advertising, marketing, or profiling.
              </p>
            </div>
<br />
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Sharing</h4>
              <p>
                Personal data is shared only with trusted service providers when required to operate the service or comply with legal obligations.
              </p>
            </div>
<br />           
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Security and Retention</h4>
              <p>
                We apply appropriate security measures to protect user data.
                Information is retained only as long as necessary to provide our services or as required by law.
              </p>
            </div>
<br />            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">User Rights</h4>
              <p>
                Users may request access to, correction of,
                or deletion of their personal data by contacting us.
              </p>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
