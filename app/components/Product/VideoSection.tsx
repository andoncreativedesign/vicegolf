'use client';

import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { VideoContentItem, YoutubeVideo } from '~/lib/sanity/products';
import { Video } from '@shopify/hydrogen';

interface YoutubeProps {
  videoContent: VideoContentItem
}

export function VideoSection({ videoContent }: YoutubeProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = React.useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="w-full py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <h3 className="text-2xl lg:text-3xl font-bold mb-3">
            {videoContent?.title}
          </h3>
          <h3 className="text-md font-semibold">
            {videoContent?.description}
          </h3>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              <div className="flex-[0_0_100%] min-w-0">
                <div className="w-full mx-auto aspect-video bg-gray-200 rounded-sm overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={videoContent?.video?.asset.url}
                    title={''}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg z-10"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg z-10"
            aria-label="Next video"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* <div className="flex justify-center mt-4 gap-2">
            {youtubeVideo?.links?.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === selectedIndex ? 'bg-gray-900 w-8' : 'bg-gray-300'
                  }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
}
