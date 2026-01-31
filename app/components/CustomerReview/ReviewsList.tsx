import { useState } from 'react';
import React from 'react';
import { CustomerReview } from './CustomerReview'; 

interface Review {
  name: string;
  country: string;
  verified: boolean;
  rating: number;
  title: string;
  text: string;
  date: string;
  images: string[];
  helpfulCount?: number;
  notHelpfulCount?: number;
}

interface ReviewsListProps {
  reviews: Review[];
  reviewsPerPage?: number;
  className?: string;
  sortBy?: 'most' | 'highest' | 'lowest' | 'media';
  onSortChange?: (sortBy: 'most' | 'highest' | 'lowest' | 'media') => void;
  ratingFilter?: number | null;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = "" 
}: PaginationProps) {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className={`flex justify-center items-center gap-1 mt-12 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 rounded-lg ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
        }`}
      >
        ‹
      </button>
      
      {getVisiblePages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg ${
            page === currentPage
              ? "bg-black text-white border border-black"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 rounded-lg ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
        }`}
      >
        ›
      </button>
    </div>
  );
}

export function ReviewsList({ 
  reviews, 
  reviewsPerPage = 3,
  className = "",
  sortBy = 'most',
  onSortChange,
  ratingFilter = null
}: ReviewsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sort and filter reviews based on sortBy and ratingFilter
  const processedReviews = React.useMemo(() => {
    let sorted = [...reviews];
    
    // Apply rating filter first
    if (ratingFilter !== null) {
      sorted = sorted.filter(review => review.rating >= ratingFilter);
    }
    
    // Then apply sorting
    if (sortBy === 'most') {
      // Sort by most recent (assuming date format MM/DD/YY)
      sorted.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
    } else if (sortBy === 'highest') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      sorted.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'media') {
      sorted = sorted.filter(review => review.images.length > 0);
    }
    
    return sorted;
  }, [reviews, sortBy, ratingFilter]);
  
  const totalPages = Math.ceil(processedReviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = processedReviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (newSortBy: 'most' | 'highest' | 'lowest' | 'media') => {
    setCurrentPage(1); // Reset to first page when sorting changes
    onSortChange?.(newSortBy);
  };

  if (reviews.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No reviews found.
      </p>
    );
  }

  return (
    <div className={`px-6 ${className}`}>
      {/* Sort by dropdown at top right */}
      <div className="flex justify-end mb-6">
        <select 
          className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value as 'highest' | 'lowest' | 'media')}
        >
          <option value="most">Most recent</option>
          <option value="highest">Highest rated</option>
          <option value="lowest">Lowest rated</option>
          <option value="media">With media</option>
        </select>
      </div>

      <div className="divide-y divide-gray-100">
        {currentReviews.map((review, index) => (
          <CustomerReview
            key={index}
            {...review}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-6"
      />
    </div>
  );
}
