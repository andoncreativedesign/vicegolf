import { Image } from '@shopify/hydrogen';
import { Link, useFetcher, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import Collection from '~/routes/($locale).collections.$ids.$handle';

interface ProductTooltip {
    id: string;
    title: string;
    category: string;
    price: string;
    position: {
        top: string;
        left: string;
    };
    handle: string
    type:'product'|'collection';
}

interface ViceLookItem {
    id: string;
    title: string;
    image: {
        url: string;
        altText?: string;
    };
    url: string;
    tooltips: ProductTooltip[];
}

export function ViceLookSection() {
    const items: ViceLookItem[] = [
        {
            id: '1',
            title: 'VICE GOLF BALLS',
            image: {
                url: 'https://cdn.shopify.com/s/files/1/0732/0505/5640/files/Vice_Golf_Next_Up_Big_OG_Polo_White-59_1.jpg?v=1766224447',
                altText: 'VICE Golf Balls',
            },
            url: '/',
            tooltips: [
                {
                    id: '1-1',
                    title: 'vice-solid-polo-white',
                    category: 'Polo',
                    price: '$49.99',
                    position: { top: '33%', left: '50%' },
                    handle: 'vice-solid-polo-white-2025',
                     type:'product'

                },
                // {
                //     id: '1-2',
                //     title: 'Vice Golf Performance Tees',
                //     category: 'Tees',
                //     price: '$59.99',
                //     position: { top: '60%', left: '60%' },
                //     handle: 'tees'
                // },
                {
                    id: '1-3',
                    title: 'vice-verve-white',
                    category: 'Shoes',
                    price: '$59.99',
                    position: { top: '92%', left: '40%' },
                    handle: 'vice-verve-white',
                   type:'product'

                }
            ]
        },
        {
            id: '2',
            title: 'VICE GOLF APPAREL',
            image: {
                url: 'https://cdn.shopify.com/s/files/1/0835/8445/0850/files/vice-golf-homepage-get-the-look-3.jpg?v=1718636826',
                altText: 'VICE Golf Apparel',
            },
            url: '/',
            tooltips: [
                {
                    id: '2-1',
                    title: 'Vice Long Sleeve',
                    category: 'Long Sleeve',
                    price: '$59.99',
                    position: { top: '30%', left: '50%' },
                    handle: 'vice-longsleeve-navy-2025',
                   type:'collection'
                },
                // {
                //     id: '2-2',
                //     title: 'Vice Golf Performance Shorts',
                //     category: 'Shorts',
                //     price: '$49.99',
                //     position: { top: '60%', left: '60%' },
                //     handle: 'vice-shorts'
                // },
                {
                    id: '2-3',
                    title: 'Vice Verve Black',
                    category: 'Shoes',
                    price: '$59.99',
                    position: { top: '92%', left: '40%' },
                    handle: 'verve-black',
                    type:'collection'

                }
            ]
        },
        {
            id: '3',
            title: 'VICE GOLF GEAR',
            image: {
                url: 'https://cdn.shopify.com/s/files/1/0835/8445/0850/files/vice-golf-homepage-get-the-look-4.jpg?v=1718643720',
                altText: 'VICE Golf Gear',
            },
            url: '/',
            tooltips: [
                {
                    id: '3-1',
                    title: 'Vice Golf Performance Polo',
                    category: 'Polos',
                    price: '$59.99',
                    position: { top: '30%', left: '50%' },
                    handle: 'vice-solid-polo-navy-2025',
                    type:'product'

                },
                // {
                //     id: '3-2',
                //     title: 'Vice Golf Performance Shorts',
                //     category: 'Shorts',
                //     price: '$49.99',
                //     position: { top: '60%', left: '40%' },
                //     handle: 'vice-shorts'
                // },
                {
                    id: '3-3',
                    title: 'Vice Verve Black',
                    category: 'Shoes',
                    price: '$59.99',
                    position: { top: '92%', left: '40%' },
                    handle: 'verve-black',
                    type:'collection'

                }
            ]
        },
    ];

    const navigate = useNavigate()
    const fetcher = useFetcher()
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

    const title = "GET THE VICE LOOK";
    if (!items || items.length === 0) return null;

   const handleClick = async (e: React.MouseEvent<HTMLButtonElement>, item: ProductTooltip) => {
        e.preventDefault();
        if (!item.handle) return;
        
        const itemType = item.type.trim();
        console.log("itemType",itemType)
        try {
            if (itemType === 'collection') {
                     fetcher.submit(
                    { handle: item.handle },
                    { method: "post", action: "/api/collection" }
                );
            } else {
                navigate(`/products/${encodeURIComponent(item.handle)}/`);
            }
        } catch (error) {
            console.error('Error in handleClick:', error);

        }
}
    useEffect(() => {
        if (
            fetcher.state === "idle"
            && fetcher.data?.collection?.id
            && fetcher.data?.collection?.title
        ) {
            const { id, title } = fetcher.data.collection
            console.log("fetcher.data hero section", id, title)
            navigate(`/collections/${encodeURIComponent(JSON.stringify([id]))}/${encodeURIComponent(title)}`);
        }
        console.log("fetcherdata",fetcher.data)
    }, [fetcher.state, fetcher.data, navigate]);

    return (
        <section className="w-full">
            <div className="w-full">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight mb-6 lg:mb-10 uppercase" style={{ fontSize: '1.375rem', fontWeight: '800' }}>{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="group block overflow-visible"
                        >
                            <div
                                className="relative overflow-visible lg:w-auto group"
                                onMouseLeave={() => setActiveTooltip(null)}
                            >
                                <Image
                                    data={{
                                        url: item.image.url,
                                        altText: item.image.altText || item.title,
                                        width: 1200,
                                        height: 1600,
                                    }}
                                    className="w-full h-auto object-cover"
                                    loading="lazy"
                                />

                                {item.tooltips.map((tooltip) => (
                                    <div
                                        key={tooltip.id}
                                        className="absolute"
                                        style={{
                                            top: tooltip.position.top,
                                            left: tooltip.position.left,
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
                                                setActiveTooltip(tooltip.id);
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

                                            {activeTooltip === tooltip.id && (
                                                <button
                                                    className="absolute cursor-pointer left-1/2 transform -translate-x-1/2 top-full mt-2 bg-white p-4 rounded-lg shadow-lg w-61 z-20"
                                                    onMouseEnter={(e) => {
                                                        e.stopPropagation();
                                                        setActiveTooltip(tooltip.id);
                                                    }}
                                                    onMouseLeave={() => setActiveTooltip(null)}
                                                    onClick={(e) => handleClick(e, tooltip)}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900">{tooltip.title}</span>
                                                        <div className="flex justify-between items-center mt-2">
                                                           <span className="text-sm text-gray-600">{tooltip.category}</span>
                                                            {/* <span className="text-gray-900 font-medium">{tooltip.price}</span> */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        </section>
    );
}
