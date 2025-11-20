import { Image } from '@shopify/hydrogen';
import { Link } from 'react-router';

interface ViceLookItem {
    id: string;
    title: string;
    image: {
        url: string;
        altText?: string;
    };
    url: string;
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
        },
        {
            id: '2',
            title: 'VICE GOLF APPAREL',
            image: {
                url: 'https://cdn.shopify.com/s/files/1/0835/8445/0850/files/vice-golf-homepage-get-the-look-3.jpg?v=1718636826',
                altText: 'VICE Golf Apparel',
            },
            url: '/collections/apparel',
        },
        {
            id: '3',
            title: 'VICE GOLF GEAR',
            image: {
                url: 'https://cdn.shopify.com/s/files/1/0835/8445/0850/files/vice-golf-homepage-get-the-look-4.jpg?v=1718643720',
                altText: 'VICE Golf Gear',
            },
            url: '/collections/gear',
        },
    ];

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
                            <div className="relative overflow-visible lg:w-auto">
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
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
