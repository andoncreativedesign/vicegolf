import { Link } from 'react-router';
import { Image, Money, Pagination } from '@shopify/hydrogen';
import { urlWithTrackingParams, type RegularSearchReturn } from '~/lib/search';
import AedIcon from './ui/AedIcon';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & { term: string }) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({ ...result.items, term });
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Articles</h2>
      <div>
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          }); 

          return (
            <div className="search-results-item" key={article.id}>
              <Link prefetch="intent" to={articleUrl}>
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsPages({ term, pages }: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Pages</h2>
      <div>
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={page.id}>
              <Link prefetch="intent" to={pageUrl}>
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="search-results-container 2xl:flex 2xl:justify-center">
      <div className="2xl:w-1/2">
        <h2>Products</h2>
        <Pagination connection={products}>
          {({ nodes, isLoading, NextLink, PreviousLink }) => {
            const ItemsMarkup = nodes.map((product) => {
              const productUrl = urlWithTrackingParams({
                baseUrl: `/products/${product.handle}`,
                trackingParams: product.trackingParameters,
                term,
              });

              const price = product?.selectedOrFirstAvailableVariant?.price;
              const image = product?.selectedOrFirstAvailableVariant?.image;
              const compareAtPrice = product?.selectedOrFirstAvailableVariant?.compareAtPrice;
              const isOnSale = compareAtPrice?.amount &&
                parseFloat(compareAtPrice.amount) > parseFloat(price?.amount || '0');

              return (
                <div className="group block bg-white rounded-lg overflow-hidden border border-gray-100/30 w-full h-full" key={product.id}>
                  <Link
                    prefetch="intent"
                    to={productUrl}
                    className="block h-full"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="relative w-full h-80 bg-[#fcfcfc] overflow-hidden">
                      {image && (
                        <Image
                          data={image}
                          alt={product.title}
                          className="w-full h-full object-contain"
                          width={300}
                          height={300}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center',
                            padding: 0,
                            margin: 0,
                            aspectRatio: '1/1'
                          }}
                        />
                      )}
                      {isOnSale && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          Sale
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 px-5 pb-5 pt-4 space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[2.8rem] flex items-start">
                        {product.title}
                      </h3>

                      <p className="text-sm text-gray-500 font-medium tracking-wide">
                        {product.productType || 'Golf Equipment'}
                      </p>

                      <div className="flex items-center justify-between pt-1 mt-auto">
                        <div className="flex items-center space-x-2">
                          {isOnSale && compareAtPrice && (
                            <div className="flex items-center text-sm text-gray-400 line-through font-medium tracking-wide">
                              {/* <span className="mr-0.5">AED</span> */}
                              <AedIcon />
                              <span>{parseFloat(compareAtPrice.amount).toFixed(2)}</span>
                            </div>
                          )}
                          {price && (
                            <div className="flex items-center">
                              {/* <span className="mr-1">AED</span> */}
                              <AedIcon />
                              <span className="text-xl font-bold text-red-600 tracking-tight">
                                {parseFloat(price.amount).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );

            });

            return (
              <div className="search-results">
                <div className="pagination-controls">
                  <PreviousLink className="pagination-button">
                    {isLoading ? 'Loading...' : <span>← Previous</span>}
                  </PreviousLink>
                </div>
                <div className="products-grid">
                  {ItemsMarkup}
                </div>
                <div className="pagination-controls">
                  <NextLink className="pagination-button">
                    {isLoading ? 'Loading...' : <span>Next →</span>}
                  </NextLink>
                </div>
              </div>
            );
          }}
        </Pagination>
      </div>
    </div>
  );
}

function SearchResultsEmpty() {
  return <p>No results, try a different search.</p>;
}
