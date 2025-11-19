import { type SanityListingVideo } from '~/lib/sanity/products';

interface VideoListProps {
    videos?: SanityListingVideo[];
    title?: string;
    className?: string;
}

export function VideoList({ videos, title = 'Videos', className = '' }: VideoListProps) {
    if (!videos || videos.length === 0) {
        return null;
    }

    return (
        <div className={`listing-videos ${className}`}>
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video, index) => (
                    <div key={index} className="video-container">
                        {video.title && <h4 className="font-medium mb-2">{video.title}</h4>}
                        {video.description && <p className="text-gray-600 mb-2">{video.description}</p>}
                        <video
                            controls
                            className="w-full rounded-lg"
                            preload="metadata"
                        >
                            <source src={video.asset.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                ))}
            </div>
        </div>
    );
}
