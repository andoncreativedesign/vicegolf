import { useEffect } from 'react';
import { useRouteLoaderData } from 'react-router';

export function YotpoReviewWidget({
  product,
  url,
  price,
  currency,
}: {
  product: any;
  url?: string;
  price?: string;
  currency?: string;
}) {
  const rootData = useRouteLoaderData<any>('root');
  const appKey = rootData?.publicYotpoAppKey || '';

  useEffect(() => {
    console.log("url from yotpo", url)
    const existingScript = document.querySelector(
      'script[src*="cdn-widgetsrepository.yotpo.com"]'
    );

    const initialize = () => {
      if (typeof window !== 'undefined' && (window as any).yotpoWidgetsContainer) {
        (window as any).yotpoWidgetsContainer?.initWidgets();
      }
    };

    if (!existingScript && appKey) {
      const script = document.createElement('script');

      script.src =
        `https://cdn-widgetsrepository.yotpo.com/v1/loader/${appKey}`;

      script.async = true;

      script.onload = initialize;

      document.body.appendChild(script);
    } else {
      initialize();
    }
  }, [product.id, appKey]);

  const yotpoUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const yotpoPrice =
    price ||
    product.selectedOrFirstAvailableVariant?.price?.amount ||
    product.variants?.nodes?.[0]?.price?.amount ||
    '0';
  const yotpoCurrency =
    currency ||
    product.selectedOrFirstAvailableVariant?.price?.currencyCode ||
    product.variants?.nodes?.[0]?.price?.currencyCode ||
    'USD';

  return (
    <div
      className="yotpo-widget-instance"
      data-yotpo-instance-id="1329554"
      data-yotpo-product-id={product.id?.split('/').pop() || product.id}
      data-yotpo-external-id={product.id?.split('/').pop() || product.id}
      data-yotpo-name={product.title}
      data-yotpo-url={yotpoUrl}
      data-yotpo-image-url={product.featuredImage?.url || ''}
      data-yotpo-price={yotpoPrice}
      data-yotpo-currency={yotpoCurrency}
      data-yotpo-description={product.descriptionHtml || product.description || ''}
    />
  );
}