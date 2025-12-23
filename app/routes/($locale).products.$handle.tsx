import { redirect, useLoaderData, Link, useNavigate, useFetcher } from 'react-router';
import { useCallback, useEffect, useState, useRef } from 'react';
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
import { JuniorCapProduct } from '~/components/JuniorCapProduct';
import { PoloProduct } from '~/components/PoloProduct';
import { GolfBagProduct } from '~/components/GolfBagProduct';
import { RangefinderProduct } from '~/components/RangefinderProduct';
import { DivotToolProduct } from '~/components/DivotToolProduct';
import { TracerProduct } from '~/components/TracerProduct';
import { BagProProduct } from '~/components/BagProProduct';
import { CustomerReviews } from '~/components/CustomerReviews';
import { BeaniesProduct } from '~/components/BeaniesProduct';
import { PuttersProduct } from '~/components/PuttersProduct';
import { CapProduct } from '~/components/CapProduct';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import { TeeProduct } from '~/components/TeesProduct';
import { TowelProduct } from '~/components/TowelProduct';
import { TowelJuniorProduct } from '~/components/TowelJuniorProduct';
import { ADMIN_PRODUCTS_BY_FAMILY, PRODUCT_QUERY, PRODUCTS_BY_FAMILY_QUERY, type UIColorVariant } from '~/lib/shopify/product-queries';
import { DivotJuniorProduct } from '~/components/DivotJuniorProduct';
import { JuniorGolfBallProduct } from '~/components/JuniorGolfBallProduct';
import { axiosShopifyAdmin } from '~/utils/axiosInsatances';
import { RECOMMENDED_PRODUCTS_QUERY } from '~/lib/shopify/product-queries';
import { getHomePageData, getShippingDetails } from '~/lib/sanity/home';
import { ChevronRight } from 'lucide-react';
import { DriversProduct } from '~/components/Product/DriversProduct';

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
  const navigate = useNavigate()
  const fetcher = useFetcher()
  // useEffect(() => {
  //   if (!data) return 
  //   console.log("data.homePageData ", data.homePageData)
  // },[data])

  useEffect(() => {
    console.log('product details from shopify', product)
    console.log('product metafields:', product.metafields)
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

  const handleBreadCrumbClick = () => {
    const handle = product?.metafields?.find((item: any) => item?.key === 'primary_collection_handle')
    if (!handle?.value) navigate(-1)
    try {
      fetcher.submit(
        { handle: handle.value },
        { method: "post", action: "/api/collection" }
      );
    } catch (error) {
      navigate(-1)
    }
  }

  useEffect(() => {
    if (
      fetcher.state === "idle"
      && fetcher.data?.collection?.id
      && fetcher.data?.collection?.title
    ) {
      const { id, title } = fetcher.data.collection
      navigate(`/collections/${encodeURIComponent(JSON.stringify([id]))}/${encodeURIComponent(title)}`);
    }
  }, [fetcher.state, fetcher.data, navigate]);

  const formRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    let isScrolling = false;
    let scrollAnimationFrame: number | null = null;
    let lastScrollTime = 0;
    const SCROLL_THROTTLE = 8; // ~120fps for smoother scrolling
    const SCROLL_FACTOR = 0.5; // Reduce scroll speed for better control

    const handleWheel = (e: WheelEvent) => {
      // Only for desktop view
      if (window.innerWidth < 1280) return;

      const { scrollTop, scrollHeight, clientHeight } = form;
      const canScrollDown = e.deltaY > 0 && scrollTop < scrollHeight - clientHeight - 1;
      const canScrollUp = e.deltaY < 0 && scrollTop > 1;

      // If we can't scroll further in this direction, allow default behavior
      if ((!canScrollDown && e.deltaY > 0) || (!canScrollUp && e.deltaY < 0)) {
        return;
      }

      // If we can scroll, prevent default and handle it ourselves
      e.preventDefault();

      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime;

      // Skip if we're already handling a scroll or it's too soon
      if (isScrolling || timeSinceLastScroll < SCROLL_THROTTLE) {
        return;
      }

      isScrolling = true;
      lastScrollTime = now;

      // Cancel any pending animation frame to prevent jank
      if (scrollAnimationFrame) {
        cancelAnimationFrame(scrollAnimationFrame);
      }

      // Use requestAnimationFrame for smooth scrolling
      scrollAnimationFrame = requestAnimationFrame(() => {
        const scrollAmount = e.deltaY * SCROLL_FACTOR;

        // Use smooth scrolling for better visual feedback
        form.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
        });

        // Reset after the scroll is complete
        setTimeout(() => {
          isScrolling = false;
        }, 100); // Slight delay to prevent rapid successive scrolls
      });
    };

    // Attach to document for global scroll handling
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
      if (scrollAnimationFrame) {
        cancelAnimationFrame(scrollAnimationFrame);
      }
    };
  }, []);

  return (
    <div className="home w-full max-w-[2560px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-12 2xl:px-16 3xl:px-24 4xl:px-32 pt-6">
      {/* Breadcrumbs - Moved outside the main container */}
      <div className="w-full max-w-[1600px] 2xl:max-w-[1800px] 3xl:max-w-[2000px] 4xl:max-w-[2200px] mx-auto mb-4 px-4 md:px-10">
        <div className="flex items-center text-gray-600">
          {productType.display && (
            <>
              <button
                onClick={handleBreadCrumbClick}
                className="cursor-pointer transition-colors text-gray-600"
              >
                {productType.display}
              </button>
              <ChevronRight className="text-gray-600" size={20} />
            </>
          )}
          <span className="text-gray-900 font-semibold line-clamp-1" title={title}>
            {title}
          </span>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 2xl:gap-16 w-full pb-10 px-4 md:px-10 pt-2 justify-center items-center xl:items-start relative">
        <div ref={galleryRef} className="xl:sticky xl:top-24">

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
        <div className="flex flex-col items-start">
          <ProductForm
            ref={formRef}
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

      {/* Spacer */}
      <div className="h-8"></div>

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

        const isJuniorCapProduct = product.metafields?.some(
          (field: { key?: string; value?: string }) =>
            field?.key === 'category_variant' && field?.value === 'Junior Cap'
        );
        const isBagProProduct = product.metafields?.some(
          (field: { key?: string; value?: string }) =>
            field?.key === 'category_variant' && field?.value === 'Bag Pro'
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

        if (isJuniorCapProduct) {
          return (
            <JuniorCapProduct
              product={product}
              productDetails={productDetails}
              initialRecommended={recommendedProducts}
              showBestSellers={true} // or false, depending on your design
            />
          );
        }
        if (isBagProProduct) {
          return (
            <BagProProduct
              product={product}
              productDetails={productDetails}
              initialRecommended={recommendedProducts}
              showBestSellers={true} // adjust as needed
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
          case "golf clubs":
             case "wedge":
          case "wedges":
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
              <CapProduct
                product={product}
                productDetails={productDetails}
                initialRecommended={recommendedProducts}
                showBestSellers={true}
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

          case "beanie":
          case "beanies":
            return (
              <BeaniesProduct
                product={product}
                productDetails={productDetails}
                initialRecommended={recommendedProducts}
                showBestSellers={true}
              />
            );

          case "putter":
          case "putters":
            return (
              <PuttersProduct
                product={product}
                productDetails={productDetails}
                initialRecommended={recommendedProducts}
                showBestSellers={true}
              />
            );

          case "drivers":
            return (
              <DriversProduct
                productDetails={productDetails}
              />
            )

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
