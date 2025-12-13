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
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              controls
              title={videoContent?.title || 'Product Video'}
            >
              <source src={videoContent?.video?.asset.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
