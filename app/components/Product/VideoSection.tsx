'use client';

import React from 'react';
import type { VideoContentItem } from '~/lib/sanity/products';

interface VideoSectionProps {
  videoContent: VideoContentItem;
  titleColor?: string;
  titleSize?: string;
  descriptionColor?: string;
  descriptionSize?: string;
}

export function VideoSection({
  videoContent,
  titleColor = 'text-gray-900',
  titleSize = 'text-2xl lg:text-3xl',
  descriptionColor = 'text-gray-600',
  descriptionSize = 'text-xl'
}: VideoSectionProps) {

  return (
    <section className="w-full py-16 md:py-24">
      <div className="w-full">
        <div className="text-center mb-12 max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          <h3 className={`mb-3 sm:text-[32px] text-[24px] font-semibold w-full ${titleColor} ${titleSize}`}>
            {videoContent?.title}
          </h3>
          <p className={`${descriptionSize} font-light ${descriptionColor}`} style={{fontSize:'1.2rem'}} >
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
