import { redirect, useLoaderData, Link } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import type { Route } from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import { ProductGallery } from '~/components/ProductGallery';
import { ProductForm } from '~/components/ProductForm';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { GolfBallProduct } from '~/components/GolfBallProduct';
import { GolfClubSetProduct } from '~/components/GolfClubSetProduct';
import { ShoesProduct } from '~/components/ShoesProduct';
import { PoloProduct } from '~/components/PoloProduct';
import { GolfBagProduct } from '~/components/GolfBagProduct';
import { RangefinderProduct } from '~/components/RangefinderProduct';
import { CustomerReviews } from '~/components/CustomerReviews';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import { TeeProduct } from '~/components/TeesProduct';
import { PRODUCTS_BY_FAMILY_QUERY } from '~/lib/shopify/product-queries';

type ProductImageType = {
  id: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: `Hydrogen | ${data?.product.title ?? ''}` },
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}

async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  redirectIfHandleIsLocalized(request, { handle, data: product });

  // Fetch color variants if product has family metafield
  let colorVariants = [];
  if (product.metafield?.value) {
    try {
      const variantsResponse = await storefront.query(PRODUCTS_BY_FAMILY_QUERY, {
        variables: { searchQuery: `metafield:custom.family:'${product.metafield.value}'` },
      });
      colorVariants = variantsResponse?.products?.nodes || [];
      // Filter out the current product from variants
      colorVariants = colorVariants.filter((variant: any) => variant.id !== product.id);

      console.log('\n\ncolor variants')
      colorVariants.map((item: any) => {
        if(item.metafield?.value === product.metafield?.value) {
          console.log('item title',item.title)
        }
        return item
      })

    } catch (error) {
      console.error('Error fetching color variants:', error);
    }
  }

  return { product, colorVariants };
}

function loadDeferredData({ context, params }: Route.LoaderArgs) {
  return {};
}

export default function Product() {
  const { product, colorVariants } = useLoaderData<typeof loader>();

  useEffect(() => {
    console.log('product details from shopify',product)
    console.log('color variants from shopify',colorVariants)
  }, [colorVariants,product])

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, descriptionHtml, images } = product;
  // Memoize the image selection to prevent unnecessary re-renders
  const [selectedImage, setSelectedImage] = useState<ProductImageType | null>(null);
  
  // Initialize selected image when component mounts or variant changes
  useEffect(() => {
    const newSelectedImage = selectedVariant?.image || (images?.nodes?.[0] as ProductImageType) || null;
    setSelectedImage(prev => {
      // Only update if the image ID is different to prevent unnecessary re-renders
      if (!prev || !newSelectedImage || prev.id !== newSelectedImage.id) {
        return newSelectedImage;
      }
      return prev;
    });
  }, [selectedVariant, images]);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);

  // Handle image selection with proper object reference
  const handleImageSelect = useCallback((image: ProductImageType) => {
    setSelectedImage(prev => {
      // Only update if the image ID is different to prevent unnecessary re-renders
      if (!prev || prev.id !== image.id) {
        return { ...image }; // Return a new object to ensure state update
      }
      return prev;
    });
  }, []);

  // Fetch product details when product changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      const productDetails = await getProductDetails(product.id);
      setProductDetails(productDetails);
      console.log('productDetails ', productDetails);
      
      // Reset selected image when product changes
      if (product.images?.nodes?.[0]) {
        setSelectedImage(product.images.nodes[0] as ProductImageType);
      }
    };

    fetchProductDetails();
  }, [product.id]);

  return (
    <div className="product-page-container w-full max-w-7xl mx-auto px-0 sm:px-1 lg:px-2 py-3 md:py-4">
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="w-full lg:w-[55%]">
          {images?.nodes?.length > 0 ? (
            <ProductGallery
              images={images.nodes as ProductImageType[]}
              selectedImage={selectedImage}
              onImageSelect={handleImageSelect}
            />
          ) : (
            <div className="bg-gray-100 aspect-square flex items-center justify-center rounded-lg">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        <div className="w-full lg:w-[45%]">
          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
            title={title}
            description={descriptionHtml}
            productType={product.productType}
            productAccordions={productDetails?.accordionItems || []}
            colorVariants={colorVariants}
          />
        </div>
      </div>

      {/* Product-specific sections */}
      {(() => {

        const productType = product.productType?.toLowerCase();

        switch (productType) {
          case 'polo':
          case 'polos':
          case 'shoes':
          case 'headwear':
            return <PoloProduct product={product} productDetails={productDetails} />;
          case 'golf club set':
            return <GolfClubSetProduct productDetails={productDetails} />;
          case 'tees':
            return <TeeProduct productDetails={productDetails} />
          case 'rangefinder':
            return <RangefinderProduct productDetails={productDetails} />;
          default:
            return <GolfBallProduct productDetails={productDetails} />;
        }


        // ! working code below
        //   switch(productType) {
        //     case 'golf balls':
        //       return <GolfBallProduct product={product} />;
        //     case 'golf club set':
        //       return <GolfClubSetProduct product={product} />;
        //     case 'golf bag':
        //     case 'golf bags':
        //       return <GolfBagProduct product={product} selectedVariant={selectedVariant} />;
        //     case 'shoes':
        //       return <ShoesProduct product={product} />;
        //     case 'polo':
        //     case 'polos':
        //       return <PoloProduct product={product} />;
        //     default:
        //       return null;
        //   }
      })()}

      {/* Customer Reviews Section (common for all products) */}
      <CustomerReviews />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    productType
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    metafield(namespace: "custom", key: "family") {
      id
      namespace
      key
      type
      value
    }
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
