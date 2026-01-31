// app/components/CustomerReviews.tsx
import { useState } from "react";
import { Star, X } from "lucide-react";
import { ReviewFilters } from "./CustomerReview/ReviewFilters";
import { ReviewsList } from "./CustomerReview/ReviewsList";
import { PopularTopics } from "./CustomerReview/PopularTopics"; 

import React from "react"; 

export function CustomerReviews() {
  const [withMediaOnly, setWithMediaOnly] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<'media' | 'text'>('text');
  const [sortBy, setSortBy] = useState<'most' | 'highest' | 'lowest' | 'media'>('most');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [headline, setHeadline] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setRating(0);
    setReview("");
    setHeadline("");
    setName("");
    setEmail("");
  };

  const reviews = [
    {
      name: "AJ T.",
      country: "us",
      verified: true,
      rating: 5,
      title: "Best golf balls on the market",
      text: "Ever since I began using Vice golf balls, they honestly compare to, if not surpass, the industry standard leading golf balls. I don't believe I'll ever switch back to any other brand.",
      date: "04/21/25",
      images: [],
    },
    {
      name: "Matthew K.",
      country: "us",
      verified: true,
      rating: 4,
      title: "Best ball in my opinion",
      text: "I will not buy a different ball. The pro plus has amazing feel from any club I use. I even think that the pro plus feels better than the Pro V1.",
      date: "04/21/25",
      images: ["/golfball.png", "/golfball.png", "/golfball.png"],
    },
    {
      name: "Matt D.",
      country: "us",
      verified: true,
      rating: 2,
      title: "New Pro Plus Works!",
      text: "I got my first custom picture golf balls and they look great! Best performing Vice golf ball yet.",
      date: "10/29/25",
      images: ["/golfball.png"],
    },
    {
      name: "Ashley N.",
      country: "ca",
      verified: true,
      rating: 1,
      title: "Obsessed cannot describe how I",
      text: "Obsessed cannot describe how I feel about this.",
      date: "10/28/25",
      images: [],
    },
     {
      name: "Matt D.",
      country: "us",
      verified: true,
      rating: 5,
      title: "New Pro Plus Works!",
      text: "I got my first custom picture golf balls and they look great! Best performing Vice golf ball yet.",
      date: "10/29/25",
      images: ["/golfball.png"],
    },
     {
      name: "Matt D.",
      country: "us",
      verified: true,
      rating: 5,
      title: "New Pro Plus Works!",
      text: "I got my first custom picture golf balls and they look great! Best performing Vice golf ball yet.",
      date: "10/29/25",
      images: ["/golfball.png"],
    },
  ];

  const filteredReviews = React.useMemo(() => {
  let filtered = [...reviews];
  
  // Apply search filter
  if (searchQuery.trim()) {
    filtered = filtered.filter((r) => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply media filter
  if (mediaFilter === 'media') {
    filtered = filtered.filter((r) => r.images.length > 0);
  } else {
    filtered = filtered.filter((r) => r.images.length === 0);
  }
  
  // Apply rating filter
  if (ratingFilter !== null) {
    filtered = filtered.filter((r) => r.rating >= ratingFilter);
  }
  
  return filtered;
}, [reviews, mediaFilter, ratingFilter, searchQuery]);

  const handleSortChange = (newSortBy: 'most' | 'highest' | 'lowest' | 'media') => {
    setSortBy(newSortBy);
  };

  const topics = [
    "fit",
    "model",
    "color",
    "problem",
    "performance",
    "control",
    "shipping",
    "distance",
  ];

  const scrollSlider = (direction: "left" | "right") => {
    const container = document.querySelector(".media-slider");
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full py-16 relative">
      {/* Heading */}
      <div className="mb-16 px-6">
        <h2 className="text-3xl font-normal text-center text-gray-800 tracking-wide">
          Customer Reviews
        </h2>
      </div>

      {/* Summary Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-16 px-6">
        {/* Left: Average Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-5xl font-normal text-gray-900">4.8</span>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-1">Based on 1150 reviews</p>
        </div>

        {/* Middle: Rating Breakdown */}
        <div className="w-full md:w-[300px]">
          {[5, 4, 3, 2, 1].map((star, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <span className="w-4 text-sm text-gray-800">{star}</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black"
                  style={{
                    width:
                      star === 5
                        ? "88%"
                        : star === 4
                        ? "8%"
                        : star === 3
                        ? "2%"
                        : star === 2
                        ? "1%"
                        : "1%",
                  }}
                ></div>
              </div>
              <span className="w-10 text-xs text-gray-500 text-right">
                {star === 5
                  ? 1013
                  : star === 4
                  ? 98
                  : star === 3
                  ? 22
                  : star === 2
                  ? 3
                  : 14}
              </span>
            </div>
          ))}
        </div>

        {/* Right: Write Review Button */}
        <div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-900 transition"
          >
            Write A Review
          </button>
        </div>
      </div>

      {/* Reviews with media slider */}
      <div className="px-6 mb-12">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Reviews with media
        </h3>

        <div className="relative">
          <div className="media-slider flex overflow-x-auto gap-4 pb-2 scrollbar-hide scroll-smooth">
            {reviews
              .filter((r) => r.images.length > 0)
              .flatMap((r) => r.images)
              .map((img, i) => (
                <div
                  key={i}
                  className="flex-none w-[120px] h-[120px] rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition"
                >
                  <img
                    src={img}
                    alt={`review media ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
          </div>

          {/* Left & Right Arrows */}
          <button
            onClick={() => scrollSlider("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100"
          >
            ‹
          </button>

          <button
            onClick={() => scrollSlider("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100"
          >
            ›
          </button>
        </div>
      </div>

      {/* Filters */}
      <ReviewFilters 
        withMediaOnly={withMediaOnly}
        setWithMediaOnly={setWithMediaOnly}
        mediaFilter={mediaFilter}
        setMediaFilter={setMediaFilter}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

   {/* Popular Topics */}
      <PopularTopics 
        topics={topics}
        onShowMore={() => console.log('Show more topics')}
      /> 

      {/* Reviews List */}
      <ReviewsList 
        reviews={reviews} 
        sortBy={sortBy}
        onSortChange={handleSortChange}
        ratingFilter={ratingFilter}
      />

      {/* Write Review Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Share your thoughts
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate your experience *
                </label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleRatingClick(i + 1)}
                      className={`${
                        i < rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <Star className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Write a review *
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us what you like or dislike"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none h-24"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add headline *
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Summarize your experience"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your email address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white font-medium py-2.5 rounded-md hover:bg-gray-900 transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        </>
      )}
    </section>
  );
}
