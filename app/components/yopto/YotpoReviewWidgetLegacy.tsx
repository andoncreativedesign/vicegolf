import { useEffect } from 'react';

type YotpoReviewWidgetProps = {
  product: any;
  url?: string;
  price?: string;
  currency?: string;
};

export function YotpoReviewWidgetLegacy({
  product,
  url,
  price,
  currency,
}: YotpoReviewWidgetProps) {
  const productId =
    product?.id?.split('/').pop() || product?.id;

  const yotpoUrl =
    url ||
    `https://vice-golf-development.myshopify.com/products/${product.handle}`;

  const yotpoPrice =
    price ||
    product?.selectedOrFirstAvailableVariant?.price?.amount ||
    product?.variants?.nodes?.[0]?.price?.amount ||
    '0';

  const yotpoCurrency =
    currency ||
    product?.selectedOrFirstAvailableVariant?.price?.currencyCode ||
    product?.variants?.nodes?.[0]?.price?.currencyCode ||
    'USD';

  
  useEffect(() => {
    const loadYotpo = () => {
      // remove old widgets
      const oldWidgets = document.querySelectorAll(
        '.yotpo.yotpo-main-widget'
      );

      oldWidgets.forEach((widget) => {
        widget.innerHTML = '';
      });

      // remove old script
      const oldScript = document.querySelector(
        'script[src*="staticw2.yotpo.com"]'
      );

      if (oldScript) {
        oldScript.remove();
      }

      // remove old yotpo globals
      if (typeof window !== 'undefined') {
        (window as any).yotpo = undefined;
        (window as any).Yotpo = undefined;
      }

      // inject fresh script
      const script = document.createElement('script');

      script.src =
        'https://staticw2.yotpo.com/1EU1bXsXSLoWFlPOIvXu2rVvbKELtHN0e8xPiPQb/widget.js';

      script.async = true;

      script.onload = () => {
        setTimeout(() => {
          if ((window as any).yotpo) {
            console.log('Fresh Yotpo init');

            (window as any).yotpo.initWidgets();
          }
        }, 1200);
      };

      document.body.appendChild(script);
    };

    loadYotpo();
  }, [product.id]);

  return (
    <div
      key={productId}
      className="yotpo yotpo-main-widget"
      data-product-id={productId}
      data-name={product.title}
      data-url={yotpoUrl}
      data-image-url={product.featuredImage?.url || ''}
      data-description={
        product.descriptionHtml ||
        product.description ||
        ''
      }
      data-price={yotpoPrice}
      data-currency={yotpoCurrency}
      style={{ minHeight: '500px' }}
    />
  );
}