// app/components/CustomerReview/PopularTopics.tsx
import { useState } from 'react';

interface PopularTopicsProps {
  topics: string[];
  onShowMore?: () => void;
}

export function PopularTopics({ topics, onShowMore }: PopularTopicsProps) {
  return (
    <div className="px-6 mb-8 mt-6">
      <h3 className="text-sm font-semibold mb-4 text-gray-800 uppercase tracking-wide">
        Popular topics
      </h3>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, i) => (
          <span
            key={i}
            className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-50 hover:border-gray-400"
          >
            {topic}
          </span>
        ))}
        <button 
          className="text-sm text-gray-600 hover:text-black hover:underline ml-2"
          onClick={onShowMore}
        >
          Show more
        </button>
      </div>
    </div>
  );
}
