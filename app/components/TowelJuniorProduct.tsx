import { useState, useEffect } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { Youtube } from './Youtube';

type TowelJuniorProductProps = {
    product: ProductFragment;
    productDetails: ProductDetails | null;
};

export function TowelJuniorProduct({ product, productDetails }: TowelJuniorProductProps) {
    const [productDetailsState, setProductDetails] = useState<ProductDetails | null>(productDetails);

    // Fetch product details if not provided
    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!productDetails) {
                const details = await getProductDetails(product.id);
                setProductDetails(details);
            }
        };
        fetchProductDetails();
    }, [product.id, productDetails]);

    return (
        <div className="towel-junior-container px-6 sm:px-8 lg:px-12 xl:px-16">
            <div className="max-w-8xl mx-auto">
                {/* Hero Section */}
                <section className="py-12 md:py-16 lg:py-20">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8">
                        Towel Junior
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <p className="text-lg mb-6">
                                The perfect golf towel for young golfers. Designed with junior players in mind, our Towel Junior
                                combines functionality with fun designs that kids love.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">✓</span>
                                    <span>Perfect size for junior golf bags</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">✓</span>
                                    <span>Super absorbent microfiber material</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">✓</span>
                                    <span>Fun, vibrant designs</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">✓</span>
                                    <span>Durable construction</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">Towel Junior Image</span>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-12 md:py-16 lg:py-20 bg-gray-50 rounded-lg my-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Designed for Young Golfers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Perfect Fit',
                                description: 'Specially sized for junior golf bags and smaller hands.'
                            },
                            {
                                title: 'Fun Designs',
                                description: 'Colorful patterns that young golfers will love.'
                            },
                            {
                                title: 'Durable',
                                description: 'Built to withstand the rigors of junior golf.'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Dynamic Content Sections */}
                {productDetailsState?.productContent1?.content?.map((item, index) => (
                    <div key={index} className="py-12">
                        <ProductDetailsContent1 content={item} />
                    </div>
                ))}

                {/* Video Section */}
                {productDetailsState?.youtubeVideoId && (
                    <div className="py-12">
                        <Youtube videoId={productDetailsState.youtubeVideoId} />
                    </div>
                )}
            </div>
        </div>
    );
}
