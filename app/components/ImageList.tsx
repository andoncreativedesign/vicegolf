import { type SanityListingImage } from '~/lib/sanity/products';

interface ImageListProps {
    images?: SanityListingImage[];
    title?: string;
    className?: string;
}

export function ImageList({ images, title, className = '' }: ImageListProps) {
    if (!images || images.length === 0) {
        return null;
    }

    return (
       <section
  className={`relative w-full overflow-hidden mb-8 
  h-[450px] min-h-[400px] max-h-[500px] 
  w-screen max-w-[100vw] left-1/2 -ml-[50vw] listing-images ${className}`}
>
    <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                <div className="w-full h-full">
                    {title && <h3 className="text-2xl md:text-4xl font-bold text-white mb-8 text-center drop-shadow-lg absolute top-4 left-1/2 -translate-x-1/2 z-20">{title}</h3>}
                    <div className="w-full h-full flex items-center justify-center">
                        {images.map((image, index) => (
                            <div key={index} className="relative w-full h-full">
                                <img
                                    src={image.asset.url}
                                    alt={image.alt || 'Listing image'}
                                    className="w-full h-full object-cover"
                                    loading={index < 2 ? 'eager' : 'lazy'}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
