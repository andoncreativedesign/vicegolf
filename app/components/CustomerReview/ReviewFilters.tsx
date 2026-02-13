// app/components/CustomerReview/ReviewFilters.tsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import { FaCheckCircle } from 'react-icons/fa';


interface ReviewFiltersProps {
  withMediaOnly: boolean;
  setWithMediaOnly: (value: boolean) => void;
  mediaFilter: 'media' | 'text';
  setMediaFilter: (value: 'media' | 'text') => void;
  ratingFilter: number | null;
  setRatingFilter: (value: number | null) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function ReviewFilters({ withMediaOnly, setWithMediaOnly, mediaFilter, setMediaFilter, ratingFilter, setRatingFilter, searchQuery, setSearchQuery }: ReviewFiltersProps) {
  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between px-6 py-8 border-t border-gray-200 bg-white">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search Input */}
        <div className="relative w-48 max-h-10">
          <input
            type="text"
            placeholder="Search reviews"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 w-full"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Rating Dropdown */}
        <div className="relative w-48 max-h-10">
          <select 
            className="border w-full border-gray-300 text-gray-700 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white appearance-none cursor-pointer pr-8"
            value={ratingFilter || ''}
            onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : null)}
            onClick={() => setRatingDropdownOpen(!ratingDropdownOpen)}
            onBlur={() => setRatingDropdownOpen(false)}
          >
            <option value="">Rating</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars & up</option>
            <option value="3">3 stars & up</option>
            <option value="2">2 stars & up</option>
            <option value="1">1 star & up</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${ratingDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* With Media Toggle Button */}
        <button
          onClick={() => {
            const nextFilter = mediaFilter === 'media' ? 'text' : 'media';
            setMediaFilter(nextFilter);
            setWithMediaOnly(nextFilter === 'media');
          }}
          className={`flex w-48 items-center justify-between text-sm cursor-pointer border border-gray-300 rounded-full px-4 py-2.5 max-h-11 transition-colors ${
            mediaFilter === 'media'
              ? 'text-gray-700   text-gray-400 '
              : 'text-gray-700  text-gray-400 '
          }`}
        >   
          <span>With media</span>
          {mediaFilter === 'media' ? (
            <FaCheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <div className="w-4 h-4 rounded-full border border-gray-300"></div>
          )}
        </button>

        {/* Country Dropdown */}
        <div className="relative w-48 max-h-10">
          <select 
            className="border w-full  text-gray-700 border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white appearance-none cursor-pointer pr-8"
            onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
            onBlur={() => setCountryDropdownOpen(false)}
          >
            <option>Country</option>
            <option>USA</option>
            <option>Germany</option>
            <option>UK</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${countryDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
