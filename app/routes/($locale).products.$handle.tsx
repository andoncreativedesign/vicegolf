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
import { DivotToolProduct } from '~/components/DivotToolProduct';
import { TracerProduct } from '~/components/TracerProduct';
import { CustomerReviews } from '~/components/CustomerReviews';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import { TeeProduct } from '~/components/TeesProduct';
import { TowelProduct } from '~/components/TowelProduct';
import { TowelJuniorProduct } from '~/components/TowelJuniorProduct';
import { DivotJuniorProduct } from '~/components/DivotJuniorProduct';
import { JuniorGolfBallProduct } from '~/components/JuniorGolfBallProduct';
import { ADMIN_PRODUCTS_BY_FAMILY, PRODUCTS_BY_FAMILY_QUERY, type UIColorVariant } from '~/lib/shopify/product-queries';
import { axiosShopifyAdmin } from '~/utils/axiosInsatances';
import { RECOMMENDED_PRODUCTS_QUERY } from '~/lib/shopify/product-queries';
import { getHomePageData, getShippingDetails } from '~/lib/sanity/home';

type ProductImageType = {
  id: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: `Vice Golf | ${data?.product.title ?? ''}` },
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = await loadDeferredData(args);
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
  let colorVariants: UIColorVariant[] = [];
  if (product.metafield?.value) {
    try {

      const FAMILY = product.metafield.value.trim();
      // const FAMILY = 'vice_pro'
      const response = await axiosShopifyAdmin.post("", {
        query: ADMIN_PRODUCTS_BY_FAMILY,
        variables: {
          searchQuery: `metafields.custom.family:"${FAMILY}"`,
        },
      });


      // colorVariants = response.data?.data.products?.nodes || [];
      // const colorVariantsRes = response.data.data.products.edges || []
      if (response.data.errors) {
        throw new Error(JSON.stringify(response?.data?.errors))
      }

      const colorVariantsRes = response.data.data.products.edges
      console.log('\n\ncolor variants')
      console.log(JSON.stringify(colorVariantsRes))
      console.log('\n\ncolor variants end')

      function mapColorVariants(edges: any[]): UIColorVariant[] {
        return edges.map((edge) => {
          const node = edge.node;

          // Extract variant_image metafield reference (MediaImage)
          const variantMetaImage = node.variantImage?.reference?.image || null;
          // Determine best image
          const finalImage = variantMetaImage
            ? {
              url: variantMetaImage.url,
              altText: variantMetaImage.altText,
            }
            : node.featuredImage
              ? {
                url: node.featuredImage.url,
                altText: node.featuredImage.altText,
              }
              : null;

          return {
            id: node.id,
            title: node.title,
            handle: node.handle,
            featuredImage: finalImage,
          };
        });
      }


      colorVariants = mapColorVariants(colorVariantsRes)

      // Include all variants, we'll handle the current product styling in the UI
      // The current product will be identified by matching the handle

    } catch (error) {
      console.error('Error fetching color variants:', error);
    }
  }

  return { product, colorVariants };
}

async function loadDeferredData({ context, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const recommendedCursor = url.searchParams.get('recommendedCursor');

  const recommendedProducts = await context.storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {
      first: 15,
      after: recommendedCursor || undefined,
    },
  }).catch(() => null);
  const shippingDetails = await getShippingDetails();

  return { recommendedProducts, shippingDetails };
}

export default function Product() {
  const { product, colorVariants, recommendedProducts, shippingDetails } = useLoaderData<typeof loader>();

  // useEffect(() => {
  //   if (!data) return 
  //   console.log("data.homePageData ", data.homePageData)
  // },[data])

  useEffect(() => {
    // console.log('product details from shopify', product)
    // console.log('product metafields:', product.metafields)
    // console.log('color variants from shopify', colorVariants)

    // Debug metafields for Tracer product
    const isTracer = product.metafields?.some(
      (field: { key?: string; value?: string }) =>
        field?.key === 'category_variant' && field?.value === 'tracer'
    );
    console.log('Is Tracer product:', isTracer);
  }, [colorVariants, product])

  // const { product, recommendedProducts } = useLoaderData<typeof loader>();
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

  // Format product type for display and URL
  const formatProductType = (type: string) => {
    if (!type) return { display: '', url: '' };

    // Handle special cases and formatting
    const formatted = type
      .split(/[\s_]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    // Create URL-friendly version
    const urlFriendly = type.toLowerCase().replace(/\s+/g, '-');

    return {
      display: formatted,
      url: urlFriendly
    };
  };

  const productType = formatProductType(product.productType || '');

  return (
    <div className="product-page-container w-full max-w-full mx-auto px-0 py-3 md:py-4">
      {/* Breadcrumbs */}
      <div className='flex justify-center'>
        <div className="text-[18px] font-normal w-screen 2xl:w-[80%] px-4 sm:px-6 md:px-2 lg:px-20 pt-10 text-sm text-gray-900">
          <div className="flex items-center flex-wrap gap-1">
            <span className="mx-1"></span>
            {productType.display ? (
              <>
                <Link
                  to={`/collections/${productType}`}
                  className="hover:text-gray-600 transition-colors"
                >
                  {productType.display}
                </Link>
                <span className="mx-1 text-gray-400">&gt;</span>
              </>
            ) : null}
            <span className="font-semibold text-gray-900 font-medium line-clamp-1" title={title}>
              {title}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-1 w-full p-10 justify-center items-center xl:items-start">
        <div className="">
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
        <div className="">
          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
            title={title}
            description={descriptionHtml}
            productType={product.productType}
            productAccordions={productDetails?.accordionItems || []}
            colorVariants={colorVariants}
            shippingDetails={shippingDetails}
          />
        </div>
      </div>
      {/* Product-specific sections */}
      {(() => {
        const productType = product.productType?.toLowerCase();

        // Check for Tracer product using metafield
        const isTracerProduct = product.metafields?.some(
          (field: { key?: string; value?: string }) =>
            field?.key === 'category_variant' && field?.value === 'tracer'
        );

        // Check for Towel Junior product using metafield
        const isTowelJuniorProduct = product.metafields?.some(
          (field: { key?: string; value?: string }) =>
            field?.key === 'category_variant' && field?.value === 'Towel Junior'
        );

        // Check for Divot Junior product using metafield
        const isDivotJuniorProduct = product.metafields?.some(
          (field: { key?: string; value?: string }) =>
            field?.key === 'category_variant' && field?.value === 'Divot Junior'
        );

        // Check for Junior Golf Ball product using metafield
        const isJuniorGolfBallProduct = product.metafields?.some(
          (field: { key?: string; value?: string }) =>
            field?.key === 'category_variant' && field?.value === 'Junior Ball'
        );

        if (isTracerProduct) {
          return (
            <TracerProduct
              product={product}
              productDetails={productDetails}
              initialRecommended={recommendedProducts}
              showBestSellers={true}
            />
          );
        }

        if (isTowelJuniorProduct) {
          return (
            <TowelJuniorProduct
              product={product}
              productDetails={productDetails}
            />
          );
        }

        if (isDivotJuniorProduct) {
          return (
            <DivotJuniorProduct
              product={product}
              productDetails={productDetails}
              initialRecommended={recommendedProducts}
              showBestSellers={true}
            />
          );
        }

        if (isJuniorGolfBallProduct) {
          return (
            <JuniorGolfBallProduct
              product={product}
              productDetails={productDetails}
              initialRecommended={recommendedProducts}
            />
          );
        }

        switch (productType) {
          /** 👇 Clothing category */
          case "polo":
          case "polos":
            return (
              <PoloProduct
                product={product}
                productDetails={productDetails}
                initialRecommended={recommendedProducts}
                showBestSellers={true}
              />
            );

          case "shoes":
          case "headwear":
          case "glove":
          case "gloves":
          case "gloves men":
          case "gloves women":
          case "longsleeve":
            return (
              <PoloProduct
                product={product}
                productDetails={productDetails}
                initialRecommended={recommendedProducts}
                showBestSellers={false}
              />
            );

          /** 👇 Golf club sets */
          case "golf club set":
            return <GolfClubSetProduct productDetails={productDetails} />;

          /** 👇 Golf bags */
          case "golf bag":
          case "golf bags":
            return (
              <GolfBagProduct
                product={product}
                productDetails={productDetails}
                initialRecommended={recommendedProducts}
                showBestSellers={true}
              />
            );

          /** 👇 Caps */
          case "cap":
          case "caps":
            return (
              <GolfBallProduct
                productDetails={productDetails}
                initialRecommended={recommendedProducts}
                showBestSellers={true}
                isGolfBallProduct={false}
              />
            );

          /** 👇 Tees */
          case "tees":
            return <TeeProduct productDetails={productDetails} />;

          /** 👇 Rangefinder */
          case "rangefinder":
            return <RangefinderProduct productDetails={productDetails} />;

          /** 👇 Divot Tool */
          case "divot tool":
          case "divot tools":
            return (
              <DivotToolProduct
                product={product}
                productDetails={productDetails}
                initialRecommended={recommendedProducts}
                showBestSellers={true}
              />
            );

          /** 👇 Towels */
          case "towel":
          case "towels":
            return (
              <TowelProduct
                product={product}
                productDetails={productDetails}
              />
            );

          /** 👇 Golf balls (main category) */
          case "golf balls":
            return (
              <GolfBallProduct
                productDetails={productDetails}
                initialRecommended={recommendedProducts}
                showBestSellers={false}
                isGolfBallProduct={true}
              />
            );

          /** 👇 Default — fallback to golf balls layout */
          default:
            return (
              <GolfBallProduct
                productDetails={productDetails}
                initialRecommended={recommendedProducts}
                showBestSellers={false}
                isGolfBallProduct={false}
              />
            );
        }
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
      {/* <CustomerReviews /> */}
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
    metafields(identifiers: [
      {namespace: "custom", key: "family"}
      {namespace: "custom", key: "category_variant"}
    ]) {
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