import React from 'react';

type BestSellersProps = {
    /**
     * The title to display above the best sellers section
     * If not provided, defaults to 'BEST SELLERS'
     * If set to null or empty string, no title will be shown
     */
    title?: string | null;
};

export function BestSellers({ title = 'BEST SELLERS' }: BestSellersProps) {
    // Dummy best sellers data
    const bestSellers = [
        { id: 1, name: 'Premium Golf Balls (12 Pack)', price: '$49.99' },
        { id: 2, name: 'Pro Golf Glove', price: '$24.99' },
        { id: 3, name: 'Golf Tees (50 Pack)', price: '$9.99' },
        { id: 4, name: 'Golf Towel', price: '$14.99' },
    ];

    return (
        <div className="best-sellers mt-12">
            {title && (
                <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellers.map((item) => (
                    <div key={item.id} className="border p-4 rounded-lg text-center">
                        <div className="h-32 bg-gray-100 mb-3 flex items-center justify-center">
                            <span className="text-gray-400">Image</span>
                        </div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-600">{item.price}</p>
                        <button className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BestSellers;
