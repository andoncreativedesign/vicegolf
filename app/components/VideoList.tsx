import { type SanityListingVideo } from '~/lib/sanity/products';
import { useState, useRef, useEffect } from 'react';

interface VideoListProps {
    videos?: SanityListingVideo[];
    title?: string;
    className?: string;
}

export function VideoList({ videos, title = 'Videos', className = '' }: VideoListProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    if (!videos || videos.length === 0) {
        return null;
    }

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.addEventListener('play', () => setIsPlaying(true));
            video.addEventListener('pause', () => setIsPlaying(false));
            video.addEventListener('ended', () => setIsPlaying(false));

            // Set muted and attempt autoplay
            video.muted = true;
            video.play().catch(error => {
                console.log('Autoplay failed:', error);
                setIsPlaying(false);
            });
        }
    }, []);

    return (
        <section className={`relative w-full overflow-hidden mb-8 h-[80vh] min-h-[500px] max-h-[90vh] w-screen max-w-[100vw] left-1/2 -ml-[50vw] listing-videos ${className}`}>
            <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
                <div className="w-full h-full">
                    <div className="w-full h-full flex items-center justify-center">
                        {videos.map((video, index) => (
                            <div key={index} className="video-container w-full h-full relative">
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    preload="metadata"
                                    onClick={togglePlay}
                                >
                                    <source src={video.asset.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>

                                {/* Minimal controls in bottom right */}
                                <div className="absolute bottom-4 right-4 flex items-center space-x-2 z-20">
                                    <button
                                        onClick={toggleMute}
                                        className="text-white p-2 transition-colors"
                                    >
                                        {isMuted ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                            </svg>
                                        )}
                                    </button>

                                    <button
                                        onClick={togglePlay}
                                        className="text-white p-2 transition-colors"
                                    >
                                        {isPlaying ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <rect x="6" y="4" width="4" height="16" />
                                                <rect x="14" y="4" width="4" height="16" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
