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

        // Use custom link if provided
        if (item.link) {
            navigate(item.link);
            return;
        }

        const handle = item.product?.store?.slug?.current;
        if (!handle) return;

        navigate(`/products/${encodeURIComponent(handle)}/`);
    }

    // Helper to format price
    const formatPrice = (priceRange: any) => {
        const amount = priceRange?.minVariantPrice;
        if (!amount) return '';
        // Assuming simple formatting or pass currency code if available
        return `$${amount}`;
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
                                                <div className="bg-black rounded-full w-8 h-8 flex items-center justify-center shadow-lg cursor-pointer">
                                                    <span className="text-white font-bold">+</span>
                                                </div>

                                                {activeTooltip === tooltip._key && (
                                                    <button
                                                        className="absolute cursor-pointer left-1/2 transform -translate-x-1/2 top-full mt-2 bg-white p-4 rounded-lg shadow-lg w-61 z-20"
                                                        onMouseEnter={(e) => {
                                                            e.stopPropagation();
                                                            setActiveTooltip(tooltip._key);
                                                        }}
                                                        onMouseLeave={() => setActiveTooltip(null)}
                                                        onClick={(e) => handleClick(e, tooltip)}
                                                    >
                                                        <div className="flex flex-col text-left">
                                                            <span className="font-bold text-gray-900 leading-tight">
                                                                {tooltip.title || tooltip.linkTitle || "Shop Now"}
                                                            </span>
                                                            <div className="flex justify-between items-center mt-2">
                                                                <span className="text-sm text-gray-600">{tooltip.product?.store?.productType || ''}</span>
                                                                {tooltip.product?.store?.priceRange && (
                                                                    <span className="text-gray-900 font-medium">{formatPrice(tooltip.product.store.priceRange)}</span>
                                                                )}
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
