'use client';

import React from 'react';
import type { VideoContentItem } from '~/lib/sanity/products';

interface YoutubeProps {
  videoContent: VideoContentItem
}

export function VideoSection({ videoContent }: YoutubeProps) {

  return (
    <section className="w-full py-16 md:py-24">
      <div className="w-full">
        <div className="text-center mb-12 max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          <h3 className="text-2xl lg:text-3xl font-semibold mb-3">
            {videoContent?.title}
          </h3>
          <p className="text-xl font-light text-gray-600">
            {videoContent?.description}
          </p>
        </div>

        <div className="w-full">
          <div className="relative w-full aspect-video bg-gray-200">
            <iframe
              className="w-full h-full"
              src={`${videoContent?.video?.asset.url}?autoplay=1&loop=1&playlist=${videoContent.video?.asset._ref}`}
              title={videoContent?.title || 'Product Video'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
