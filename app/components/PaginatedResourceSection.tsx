import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';
import {useEffect, useRef, useCallback, useState} from 'react';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
}) {
  const loadMoreRef = useRef<HTMLButtonElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoadingMore) {
        setIsLoadingMore(true);
        // Immediate execution for fastest possible loading
        if (loadMoreRef.current) {
          loadMoreRef.current.click();
        }
      }
    }, [hasMore, isLoadingMore]);

    useEffect(() => {
      const element = loadMoreRef.current;
      if (!element) return;

      const observer = new IntersectionObserver(handleObserver, {
        root: null,
        rootMargin: '900px', 
        threshold: 0.01,    
      });

      observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleObserver]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
  }, [hasMore, isLoadingMore]);
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink, hasNextPage}) => {
        React.useEffect(() => {
          setHasMore(hasNextPage);
          if (!isLoading) {
            setIsLoadingMore(false);
          }
        }, [hasNextPage, isLoading]);

        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}

            {hasMore && (
              <div className="relative">
                <NextLink 
                  ref={loadMoreRef}
                  onClick={handleLoadMore}
                  className={`w-full block text-center px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors mt-4 ${isLoadingMore ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{textDecoration: 'none'}}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? 'Loading...' : 'Load more products'}
                </NextLink>
                
              </div>
            )}
          </div>  
        );
      }}
    </Pagination>
  );
}
