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
        <div className={`listing-images ${className}`}>
            {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                        <img
                            src={image.asset.url}
                            alt={image.alt || 'Listing image'}
                            className="w-full h-full object-cover rounded-lg"
                            loading={index < 2 ? 'eager' : 'lazy'}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
