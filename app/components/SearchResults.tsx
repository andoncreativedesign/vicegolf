import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
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

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
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
    <div className="search-results-container">
      <h2>Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
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
              <div className="product-card" key={product.id}>
                <Link prefetch="intent" to={productUrl} className="product-card__link">
                  <div className="product-card__image-container">
                    {image && (
                      <Image 
                        data={image} 
                        alt={product.title} 
                        className="product-card__image"
                        width={300}
                        height={300}
                        loading="lazy"
                      />
                    )}
                    {isOnSale && (
                      <div className="product-card__sale-badge">Sale</div>
                    )}
                  </div>
                  <div className="product-card__info">
                    <h3 className="product-card__title">{product.title}</h3>
                    <div className="product-card__price">
                      {isOnSale ? (
                        <>
                          <span className="product-card__price--sale">
                            <Money data={price} />
                          </span>
                          <span className="product-card__price--compare">
                            <Money data={compareAtPrice} />
                          </span>
                        </>
                      ) : (
                        <Money data={price} />
                      )}
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
  );
}

function SearchResultsEmpty() {
  return <p>No results, try a different search.</p>;
}
