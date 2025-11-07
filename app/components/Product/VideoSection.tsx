'use client';

import React from 'react';
import type { VideoContentItem } from '~/lib/sanity/products';

interface YoutubeProps {
  videoContent: VideoContentItem
}

export function VideoSection({ videoContent }: YoutubeProps) {

  return (
    <section className="w-full py-16 md:py-24 flex justify-center">
      <div className="w-[80vw] max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl lg:text-3xl font-bold mb-3">
            {videoContent?.title}
          </h3>
          <h3 className="text-md font-semibold">
            {videoContent?.description}
          </h3>
        </div>

        <div className="relative w-full aspect-video bg-gray-200 rounded-xl overflow-hidden">
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
    </section>
  );
}
