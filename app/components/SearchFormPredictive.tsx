import { useNavigate, type FormProps, type Fetcher } from 'react-router';
import React, { useRef, useEffect, useState } from 'react';
import type { PredictiveSearchReturn } from '~/lib/search';
import { useAside } from './Aside';

type SearchFormPredictiveChildren = (args: {
  fetchResults: (event: React.ChangeEvent<HTMLInputElement>) => void;
  goToSearch: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  fetcher: Fetcher<PredictiveSearchReturn>;
  showNoResults: boolean;
}) => React.ReactNode;

type SearchFormPredictiveProps = Omit<FormProps, 'children'> & {
  children: SearchFormPredictiveChildren | null;
  /** Single fetcher owned by SearchAside — never created inside this component */
  fetcher: Fetcher<PredictiveSearchReturn>;
  /** Fires on every keystroke so the parent can show a spinner immediately */
  onTermChange: (term: string) => void;
  /** Fires after the delay when no results are found */
  onNoResultsChange?: (show: boolean) => void;
};

export const SEARCH_ENDPOINT = '/search';

export function SearchFormPredictive({
  children,
  className = 'predictive-search-form',
  fetcher,
  onTermChange,
  onNoResultsChange,
  ...props
}: SearchFormPredictiveProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spaceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const aside = useAside();
  const [showNoResults, setShowNoResults] = useState(false);
  const TIME_SPACE = 3005;

  useEffect(() => {
    if (fetcher.state === 'loading') {
      setShowNoResults(false);
      onNoResultsChange?.(false);
    } else if (fetcher.state === 'idle' && fetcher.data?.result?.total === 0 && fetcher.data?.term) {
      const timer = setTimeout(() => {
        setShowNoResults(true);
        onNoResultsChange?.(true);
      }, TIME_SPACE);
      return () => clearTimeout(timer);
    } else {
      setShowNoResults(false);
      onNoResultsChange?.(false);
    }
  }, [fetcher.state, fetcher.data]);

  function resetInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (inputRef?.current?.value) inputRef.current.blur();
  }

  function goToSearch() {
    const term = inputRef?.current?.value;
    void navigate(SEARCH_ENDPOINT + (term ? `?q=${term}` : ''));
    aside.close();
  }

  function fetchResults(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    // Notify parent immediately on every keystroke — drives the spinner UI.
    onTermChange(value);

    // Cancel any pending debounce from the previous keystroke.
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // FIX: if the input is cleared, submit immediately (no debounce needed)
    // so the results panel clears right away rather than waiting 300 ms.
    if (!value) {
      void fetcher.submit(
        { q: '', limit: 5, predictive: true },
        { method: 'GET', action: SEARCH_ENDPOINT },
      );
      return;
    }

    const shouldTrackPixel = value.length > 2;

    // Debounce non-empty input so we don't fire on every single keystroke.
    debounceTimer.current = setTimeout(() => {
      debounceTimer.current = null;
      // Imperative submit on the passed-in fetcher.
      // We use a plain <form> (not fetcher.Form) because fetcher.Form binds to
      // the useFetcher() that created it — passing a fetcher as a prop and using
      // fetcher.Form causes React Router to route responses to a different internal
      // fetcher instance, so fetcher.data never updates on the owner.
      void fetcher.submit(
        { q: value, limit: 5, predictive: true },
        { method: 'GET', action: SEARCH_ENDPOINT },
      );

      if (shouldTrackPixel && typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Search', { search_string: value });
      }
    }, 300);

    // After 5s of inactivity, add a space to the input.
    if (spaceTimer.current) clearTimeout(spaceTimer.current);
    if (value) {
      spaceTimer.current = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.value += ' ';
          // Sync state and trigger search for the new term (with space)
          const newValue = inputRef.current.value;
          onTermChange(newValue);
          void fetcher.submit(
            { q: newValue, limit: 5, predictive: true },
            { method: 'GET', action: SEARCH_ENDPOINT },
          );
        }
      }, TIME_SPACE);
    }
  }

  useEffect(() => {
    if (aside.type !== 'search' && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [aside.type]);

  useEffect(() => {
    inputRef?.current?.setAttribute('type', 'search');
    return () => {
      if (spaceTimer.current) clearTimeout(spaceTimer.current);
    };
  }, []);

  if (typeof children !== 'function') return null;

  // Plain <form> — submission is fully imperative via fetcher.submit().
  return (
    <form {...(props as any)} className={className} onSubmit={resetInput}>
      {children({ inputRef, fetcher, fetchResults, goToSearch, showNoResults })}
    </form>
  );
}