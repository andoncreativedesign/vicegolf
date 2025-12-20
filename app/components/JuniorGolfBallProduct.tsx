import type { ProductFragment } from 'storefrontapi.generated';
import ProductDetailsContent1 from '~/components/Product/ProductDetailsContent1';
import ProductAccordion2 from '~/components/Product/ProductAccordion2';
import type { ProductDetails } from '~/lib/sanity/products';

type JuniorGolfBallProductProps = {
    product: ProductFragment;
    productDetails: ProductDetails | null;
};

export function JuniorGolfBallProduct({
    product,
    productDetails,
}: JuniorGolfBallProductProps) {

    return (
        <div>
            <div className="max-w-8xl mx-auto">
                {productDetails?.productContent1?.content?.slice(0, 3).map((item, index) => {
                    const isFirst = index === 0;
                    const isSecond = index === 1;
                    const isThird = index === 2;

                    // Text top, Image bottom full width for index 0 and 1. Side-by-side for index 2.
                    const isSideBySide = index === 2;

                    return (
                        <div key={index} className="w-full pb-10">
                            <ProductDetailsContent1
                                content={item}
                                showImageLeft={false} // Text first (Top) or Left
                                isTextFull={!isSideBySide}     // Full width Text unless side-by-side
                                isImageFull={!isSideBySide}    // Full width Image unless side-by-side
                                isFirst={isFirst}
                                isSecond={isSecond}
                                isThird={isThird}
                                isDescriptionFull={!isSideBySide}
                                imageSize={isSideBySide ? "xlarge" : "xlarge"}
                                titleClassName={isSideBySide ? "text-4xl lg:text-5xl font-bold text-left w-full" : "text-4xl lg:text-5xl font-bold text-center"}
                                descriptionClassName={isSideBySide ? "!text-xl font-light text-gray-600 w-full text-left mt-2" : "!text-xl font-light text-gray-600 w-full max-w-full px-4 text-center"}
                                imageContainerClassName={`px-4 md:px-8 lg:px-12 ${isSideBySide ? 'flex items-center' : ''} ${isSideBySide ? 'lg:flex-1' : ''}`}
                                imageClassName={isSideBySide ? "w-auto max-w-full h-auto max-h-[70vh] lg:max-h-[80vh] object-contain mx-auto" : "w-full h-auto max-h-[60vh] object-cover"}
                                imageCentered={isSideBySide}
                                containerClassName={isSideBySide ? "items-center" : ""}
                                contentContainerClassName={isSideBySide ? "flex-1 flex flex-col justify-center" : ""}
                                imageObjectFit={isSideBySide ? 'contain' : 'cover'}
                            />
                            {index === 2 && (
                                <ProductAccordion2 accordion2={productDetails?.accordion2} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
