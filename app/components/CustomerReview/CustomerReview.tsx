import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown} from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";

interface ReviewImage {
  src: string;
  alt?: string;
}

interface CustomerReviewProps {
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

export function CustomerReview({
  name,
  country,
  verified,
  rating,
  title,
  text,
  date,
  images,
  helpfulCount = 0,
  notHelpfulCount = 0,
}: CustomerReviewProps) {
  const [helpful, setHelpful] = useState(helpfulCount);
  const [notHelpful, setNotHelpful] = useState(notHelpfulCount);
  const [userVote, setUserVote] = useState<'helpful' | 'notHelpful' | null>(null);

  const handleHelpfulClick = () => {
    if (userVote === 'helpful') {
      // Remove helpful vote
      setHelpful(helpful - 1);
      setUserVote(null);
    } else if (userVote === 'notHelpful') {
      // Switch from notHelpful to helpful
      setNotHelpful(notHelpful - 1);
      setHelpful(helpful + 1);
      setUserVote('helpful');
    } else {
      // Add helpful vote
      setHelpful(helpful + 1);
      setUserVote('helpful');
    }
  };

  const handleNotHelpfulClick = () => {
    if (userVote === 'notHelpful') {
      // Remove notHelpful vote
      setNotHelpful(notHelpful - 1);
      setUserVote(null);
    } else if (userVote === 'helpful') {
      // Switch from helpful to notHelpful
      setHelpful(helpful - 1);
      setNotHelpful(notHelpful + 1);
      setUserVote('notHelpful');
    } else {
      // Add notHelpful vote
      setNotHelpful(notHelpful + 1);
      setUserVote('notHelpful');
    }
  };
  return (
    <div className="py-6 px-4 border-b border-gray-100">
      <div className="flex gap-6">
        {/* Left Side - Reviewer Information */}
        <div className="flex-none w-48">
          <div className="mb-2">
            <span className="font-semibold text-gray-900 block">{name} {country.toUpperCase()}</span>
            {verified && (
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <FaCheckCircle className=" fa-solid w-4 h-4 " />
                <span>Verified Buyer</span>
              </div>
            )}
          </div>
        </div>

        {/* Center - Rating, Review Text and Images */}
        <div className="flex-1">
          {/* Rating Stars */}
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star
                key={j}
                className={`w-5 h-5 ${
                  j < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
              
            ))}
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          </div>

          {/* Review Text */}
          <p className="text-gray-700 mb-4">{text}</p>

          {/* Review Images */}
          {images.length > 0 && (
            <div className="flex gap-3 mb-4 flex-wrap">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-[100px] h-[100px] "
                >
                  <img
                    src={img}
                    alt={`review ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Date and Helpfulness */}
        <div className="flex-none text-right flex flex-col justify-between">
          {/* Date */}
          <div>
            <span className="text-md text-gray-700">{date}</span>
          </div>

          {/* Helpfulness Section */}
          <div className="text-md text-gray-700 flex justify-end items-center gap-3">
            <span>Was this review helpful?</span>
            <button 
              onClick={handleHelpfulClick}
              className={`flex items-center gap-1 text-gray-700 ${
                userVote === 'helpful' ? '' : ''
              }`}
            >
              <ThumbsUp 
                className="w-4 h-4 text-gray-900 " 
                fill={userVote === 'helpful' ? 'currentColor' : 'none'}
              />
              <span>{helpful}</span>
            </button>
            <button 
              onClick={handleNotHelpfulClick}
              className={`flex items-center gap-1 text-gray-700 ${
                userVote === 'notHelpful' ? '' : ''
              }`}
            >
              <ThumbsDown 
                className="w-4 h-4 text-gray-900 " 
                fill={userVote === 'notHelpful' ? 'currentColor' : 'none'}
              />
              <span>{notHelpful}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
