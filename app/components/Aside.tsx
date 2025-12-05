import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};
/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 * <input type="search" />
 * ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
  className,
  ...rest
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
  className?: string; // added to allow custom classes to be forwarded
}) {
  const { type: activeType, close } = useAside();
  const expanded = type === activeType;
  useEffect(() => {
    const abortController = new AbortController();
    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        { signal: abortController.signal },
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);
  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'expanded' : ''}`}
      style={{ zIndex: 9999 }}
      role="dialog"
    >
      <button className="close-outside" onClick={close} />
      <aside
        style={{ zIndex: 9999 }}
        className={[
          type === 'search' ? 'search-aside' : '',
          type === 'mobile' ? 'mobile-menu' : '',
          /* existing classes */
        ]
          .concat(className || [])
          .join(' ')}
        data-type={type}
        {...rest}
      >
        <header className="relative w-full flex items-center min-h-[60px]">
          {heading && <h3 className="text-2xl font-bold text-gray-900">{heading}</h3>}
          <button
            className="close reset absolute p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={close}
            aria-label="Close panel"
            style={{ top: '1rem', right: '2rem' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              className="w-5 h-5 text-gray-800"
              aria-hidden="true"
            >
              <title>Close</title>
              <line x1="4.44194" y1="4.30806" x2="15.7556" y2="15.6218" strokeWidth="1.25" />
              <line y1="-0.625" x2="16" y2="-0.625" transform="matrix(-0.707107 0.707107 0.707107 0.707107 16 4.75)" strokeWidth="1.25" />
            </svg>
          </button>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}
const AsideContext = createContext<AsideContextValue | null>(null);
Aside.Provider = function AsideProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<AsideType>('closed');
  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};
export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
