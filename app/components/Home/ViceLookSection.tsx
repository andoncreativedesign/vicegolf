import { Image } from '@shopify/hydrogen';
import { Link } from 'react-router';
import { useState } from 'react';

interface ProductTooltip {
    id: string;
    title: string;
    category: string;
    price: string;
    position: {
        top: string;
        left: string;
    };
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
                url: 'https://cdn.shopify.com/s/files/1/0835/8445/0850/files/vice-golf-homepage-get-the-look-1.jpg?v=1718636826',
                altText: 'VICE Golf Balls',
            },
            url: '/collections/golf-balls',
            tooltips: [
                {
                    id: '1-1',
                    title: 'Vice Golf Performance Shorts',
                    category: 'Shorts',
                    price: '$49.99',
                    position: { top: '70%', left: '40%' }
                },
                {
                    id: '1-2',
                    title: 'Vice Golf Performance Polo',
                    category: 'Polos',
                    price: '$59.99',
                    position: { top: '40%', left: '50%' }
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
            url: '/collections/apparel',
            tooltips: [
                {
                    id: '2-1',
                    title: 'Vice Golf Performance Polo',
                    category: 'Polos',
                    price: '$59.99',
                    position: { top: '35%', left: '50%' }
                },
                {
                    id: '2-2',
                    title: 'Vice Golf Performance Shorts',
                    category: 'Shorts',
                    price: '$49.99',
                    position: { top: '75%', left: '50%' }
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
            url: '/collections/gear',
            tooltips: [
                {
                    id: '3-1',
                    title: 'Vice Golf Performance Polo',
                    category: 'Polos',
                    price: '$59.99',
                    position: { top: '35%', left: '50%' }
                },
                {
                    id: '3-2',
                    title: 'Vice Golf Performance Shorts',
                    category: 'Shorts',
                    price: '$49.99',
                    position: { top: '75%', left: '50%' }
                }
            ]
        },
    ];

    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    const title = "GET THE VICE LOOK";

    if (!items || items.length === 0) return null;

    return (
        <section className="w-full">
            <div className="w-full">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-6">{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            to={item.url}
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
                                    className="w-full h-[500px] lg:h-[700px] object-cover"
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
                                            className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg cursor-pointer"
                                            onMouseEnter={() => setActiveTooltip(tooltip.id)}
                                            onMouseLeave={() => setActiveTooltip(null)}
                                        >
                                            <span className="text-black font-bold">+</span>
                                        </div>
                                        {activeTooltip === tooltip.id && (
                                            <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 translate-y-full bg-white p-4 rounded-lg shadow-lg w-64 z-20">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{tooltip.title}</span>
                                                    <span className="text-sm text-gray-600">{tooltip.category}</span>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-gray-900 font-medium">{tooltip.price}</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
