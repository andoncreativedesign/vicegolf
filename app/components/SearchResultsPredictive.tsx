import { useRef } from 'react';
import { useAside } from './Aside';
import type { Fetcher } from 'react-router';
import type { PredictiveSearchReturn } from '~/lib/search';

export type NormalizedItems = {
  articles: any[];
  collections: any[];
  pages: any[];
  products: any[];
  queries: any[];
};

export const EMPTY_ITEMS: NormalizedItems = {
  articles: [],
  collections: [],
  pages: [],
  products: [],
  queries: [],
};

type CachedData = { items: NormalizedItems; total: number; term: string };
const EMPTY_CACHE: CachedData = { items: EMPTY_ITEMS, total: 0, term: '' };

type SearchResultsPredictiveProps = {
  fetcher: Fetcher<PredictiveSearchReturn>;
  pendingTerm: string;
  children: (args: {
    items: NormalizedItems;
    total: number;
    term: string;
    state: Fetcher['state'];
    closeSearch: () => void;
  }) => React.ReactNode;
};

/**
 * HOW THIS WORKS
 * ──────────────
 * fetcher lives in SearchAside (parent). When fetcher.data changes, React
 * re-renders SearchAside, which re-renders SearchResultsPredictive with the
 * new fetcher prop. So by the time this render function runs, fetcher.data
 * is already the fresh value — we just read it inline, no effects needed.
 *
 * The lastGood ref provides stale-while-revalidate: while a new request is
 * in flight fetcher.data hasn't changed yet, so we pass the previous cached
 * items to children (no blank flicker). The moment the response arrives,
 * fetcher.data is a new object, the block below runs, and children receive
 * fresh items on this same render.
 */
export function SearchResultsPredictive({
  fetcher,
  pendingTerm,
  children,
}: SearchResultsPredictiveProps) {
  const { close } = useAside();

  const lastGood = useRef<CachedData>(EMPTY_CACHE);
  const lastSeenData = useRef<unknown>(undefined);

  const fetcherData = fetcher.data as any;

  // Inline during render — runs on the same render that React schedules when
  // SearchAside re-renders due to fetcher.data changing.
  if (fetcherData !== lastSeenData.current) {
    lastSeenData.current = fetcherData;

    if (fetcherData?.result?.items) {
      // Skip abort/empty responses so we never wipe good cached results.
      // Loader sets aborted:true on abort; fallback: term==='' with active input.
      const isAbort =
        fetcherData.aborted === true ||
        (fetcherData.term === '' && !!pendingTerm);

      if (!isAbort) {
        const raw = fetcherData.result.items;
        lastGood.current = {
          term: fetcherData.term ?? '',
          total: fetcherData.result.total ?? 0,
          items: {
            articles: raw.articles ?? [],
            collections: raw.collections ?? [],
            pages: raw.pages ?? [],
            products: raw.products ?? [],
            queries: raw.queries ?? [],
          },
        };
      }
    }
  }

  const { items, total, term } = lastGood.current;

  return (
    <>
      {children({
        items,
        total,
        term,
        state: fetcher.state,
        closeSearch: close,
      })}
    </>
  );
}