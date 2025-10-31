import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";

export function CustomerReviews() {
  const [withMediaOnly, setWithMediaOnly] = useState(false);

  const reviews = [
    {
      name: "AJ T.",
      country: "us",
      verified: true,
      rating: 5,
      title: "Best golf balls on the market",
      text: "Ever since I began using Vice golf balls, they honestly compare to, if not surpass, the industry standard leading golf balls. I don’t believe I’ll ever switch back to any other brand.",
      date: "04/21/25",
      images: ["/golfball.png"],
    },
    {
      name: "Matthew K.",
      country: "us",
      verified: true,
      rating: 5,
      title: "Best ball in my opinion",
      text: "I will not buy a different ball. The pro plus has amazing feel from any club I use. I even think that the pro plus feels better than the Pro V1.",
      date: "04/21/25",
      images: ["/golfball.png", "/golfball.png", "/golfball.png"],
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
      name: "Ashley N.",
      country: "ca",
      verified: true,
      rating: 5,
      title: "Obsessed cannot describe how I",
      text: "Obsessed cannot describe how I feel about this.",
      date: "10/28/25",
      images: [],
    },
  ];

  const filteredReviews = withMediaOnly
    ? reviews.filter((r) => r.images.length > 0)
    : reviews;

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

  return (
    <section className="w-full bg-white py-16">
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
            <span className="text-5xl font-bold text-gray-900">4.8</span>
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
          <button className="mt-4 bg-black text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-gray-900 transition">
            ★ See Reviews Summary
          </button>
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
          <button className="bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-900 transition">
            Write A Review
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between px-6 py-8 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search reviews"
            className="border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <select className="border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
            <option>Rating</option>
            <option>5 stars</option>
            <option>4 stars</option>
            <option>3 stars</option>
          </select>

          {/* With Media Toggle */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={withMediaOnly}
              onChange={(e) => setWithMediaOnly(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
            />
            With media
          </label>

          <select className="border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
            <option>Country</option>
            <option>US</option>
            <option>CA</option>
          </select>
        </div>

        <div>
          <select className="border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
            <option>Sort by: Most recent</option>
            <option>Highest rated</option>
            <option>Lowest rated</option>
          </select>
        </div>
      </div>

      {/* Popular Topics */}
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
          <button className="text-sm text-gray-600 hover:text-black hover:underline ml-2">
            Show more
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-100 px-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((r, i) => (
            <div
              key={i}
              className="py-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6 hover:bg-gray-50 px-4 rounded-lg transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">{r.name}</span>
                  <span className="text-xs text-gray-500">
                    • {r.country.toUpperCase()}
                  </span>
                  {r.verified && (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified Buyer
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`w-5 h-5 ${
                        j < r.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="font-semibold text-gray-900 ml-3">
                    {r.title}
                  </span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed max-w-2xl mb-3">
                  {r.text}
                </p>

                {/* Review Images */}
                {r.images.length > 0 && (
                  <div className="flex gap-3 mt-2 flex-wrap">
                    {r.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-[100px] h-[100px] rounded-md overflow-hidden border border-gray-200 hover:shadow-md transition"
                      >
                        <img
                          src={img}
                          alt={`review ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-right min-w-[140px]">
                <p className="text-sm text-gray-500 mb-4">{r.date}</p>
                <div className="flex items-center gap-3 justify-end">
                  <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs">0</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-xs">0</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">
            No reviews with media found.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-1 mt-12">
        <button className="w-10 h-10 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">
          ‹
        </button>
        {[1, 2, 3, 4, 5].map((p) => (
          <button
            key={p}
            className={`w-10 h-10 rounded-lg ${
              p === 1
                ? "bg-black text-white border border-black"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button className="w-10 h-10 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">
          ›
        </button>
      </div>
    </section>
  );
}
