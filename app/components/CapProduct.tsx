import type { ProductDetails } from '~/lib/sanity/products';

type CapProductProps = {
    product: {
        id: string;
        title?: string;
        productType?: string;
        [key: string]: any;
    };
    productDetails?: any;
    initialRecommended?: any;
    showBestSellers?: boolean;
};

const ProductSummaryCap = () => {
    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                {/* Image section - left side */}
                <div className="w-full lg:w-[50%] max-w-xl">
                    <div className="relative pb-[90%] rounded-lg overflow-hidden">
                        <img
                            src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/vice-golf-cap-black-front.jpg?v=1751368007?width=1600&quality=80"
                            alt="Vice Golf Cap"
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                </div>
                {/* Content section - right side */}
                <div className="w-full lg:w-[50%] flex items-center">
                    <div className="w-full space-y-4 lg:space-y-6 text-center lg:text-left">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">The Perfect Golf Cap</h3>
                        <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            The Vice Golf Cap is designed for performance and style on the course. Made with high-quality materials, it provides excellent sun protection while keeping you cool and comfortable. The structured fit ensures it stays in place during your swing, and the adjustable strap guarantees a perfect fit for every golfer.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function CapProduct({
    product,
    productDetails,
    initialRecommended,
    showBestSellers = false
}: CapProductProps) {
    return (
        <div className="w-full max-w-4xl mx-auto p-6 md:p-8 lg:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">This is the cap page</h1>
            <div className="prose max-w-none">
                <p className="text-lg text-center">
                    This is a simple text-based page for cap products.
                </p>
            </div>
        </div>
    );
}
