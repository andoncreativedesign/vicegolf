import { Image } from '@shopify/hydrogen';
import { useFetcher, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import type { ViceLookSectionData } from '~/lib/sanity/home';

export function ViceLookSection({ data }: { data?: ViceLookSectionData }) {
    const navigate = useNavigate()
    const fetcher = useFetcher()
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

    const title = data?.title || "GET THE VICE LOOK";
    const items = data?.items || [];

    if (items.length === 0) return null;

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>, item: any) => {
        e.preventDefault();

        // Handle collection navigation
        if (item.collectionHandle) {
            fetcher.submit(
                { handle: item.collectionHandle },
                { method: 'POST', action: '/api/collection' }
            );
            return;
        }

        // Handle product navigation
        const handle = item.product?.store?.slug?.current;
        if (handle) {
            navigate(`/products/${encodeURIComponent(handle)}/`);
        }
    }

    // Helper to format price
    // Helper to format price
    const formatPrice = (priceRange: any) => {
        const amount = priceRange?.minVariantPrice;
        if (!amount) return '';
        // Returning just the amount, symbol handled in JSX
        return `${amount}`;
    };

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

    return (
        <section className="w-full">
            <div className="w-full">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight mb-6 lg:mb-10 uppercase" style={{ fontSize: '1.375rem', fontWeight: '800' }}>{title}</h2>
                <div className="w-full overflow-x-auto scrollbar-hide md:overflow-visible">
                    <div className="flex md:grid md:grid-cols-3 gap-6 w-max md:w-auto">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="group block overflow-visible w-80 flex-shrink-0 md:w-full"
                            >
                                <div
                                    className="relative overflow-visible lg:w-auto group"
                                    onMouseLeave={() => setActiveTooltip(null)}
                                >
                                    {item.image && (
                                        <Image
                                            data={{
                                                url: item.image,
                                                altText: item.title,
                                                width: 1200,
                                                height: 1600,
                                            }}
                                            className="w-full h-auto object-cover"
                                            loading="lazy"
                                        />
                                    )}

                                    {item.tooltips?.map((tooltip) => (
                                        <div
                                            key={tooltip._key}
                                            className="absolute"
                                            style={{
                                                top: `${tooltip.y}%`,
                                                left: `${tooltip.x}%`,
                                                transform: 'translate(-50%, -50%)',
                                                zIndex: 10
                                            }}
                                        >
                                            <div
                                                className="relative group"
                                                onMouseEnter={() => {
                                                    if (hideTimeout) {
                                                        clearTimeout(hideTimeout);
                                                        setHideTimeout(null);
                                                    }
                                                    setActiveTooltip(tooltip._key);
                                                }}
                                                onMouseLeave={() => {
                                                    const timeout = setTimeout(() => {
                                                        setActiveTooltip(null);
                                                    }, 300); // 300ms delay before hiding
                                                    setHideTimeout(timeout);
                                                }}
                                            >
                                                {/* Hotspot Dot */}
                                                <div className={`rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-transform duration-200 ${activeTooltip === tooltip._key ? 'scale-110' : ''} bg-black`}>
                                                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                                </div>

                                                {activeTooltip === tooltip._key && (
                                                    <button
                                                        className="absolute cursor-pointer left-full top-1/2 transform -translate-y-1/2 ml-3 bg-white p-4 rounded-md shadow-xl w-64 z-20 text-left transition-all duration-200"
                                                        // Adjust positioning logic if needed for mobile or edge cases via CSS or logic, 
                                                        // currently 'left-full ml-3' places it to the right of the dot.
                                                        // If it goes off screen on the right, we might need logic, but for now we stick to this or center it if mobile.
                                                        style={{ minWidth: '250px' }}
                                                        onMouseEnter={(e) => {
                                                            e.stopPropagation();
                                                            setActiveTooltip(tooltip._key);
                                                        }}
                                                        onMouseLeave={() => setActiveTooltip(null)}
                                                        onClick={(e) => handleClick(e, tooltip)}
                                                    >
                                                        <div className="flex justify-between items-center w-full">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="font-bold text-gray-900 text-sm leading-tight">
                                                                    {tooltip.title || tooltip.linkTitle || "Shop Now"}
                                                                </span>
                                                                <span className="text-xs text-gray-500 font-medium tracking-wide">
                                                                    {tooltip.collectionHandle ? 'Collection' : (tooltip.product?.store?.productType || 'Product')}
                                                                </span>
                                                                {tooltip.product?.store?.priceRange && (
                                                                    <div className="flex items-center gap-1 mt-0.5">
                                                                        <img src="/uae-dirham-symbol.svg" alt="AED" className="h-3 w-auto" />
                                                                        <span className="text-gray-900 font-bold text-sm leading-none">{formatPrice(tooltip.product.store.priceRange)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="pl-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </button>
                                                )}

                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
