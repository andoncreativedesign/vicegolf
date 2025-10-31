// app/components/WhatsNew.tsx
export function WhatsNew() {
  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: Image */}
        <div className="flex justify-center transform hover:scale-105 transition-transform duration-300">
          <img
            src="https://via.placeholder.com/600x400?text=Product+Image"
            alt="What's New Product Feature"
            className="rounded-3xl shadow-xl w-full max-w-md object-cover border-8 border-white"
          />
        </div>

        {/* Right: Text */}
        <div className="text-gray-900 space-y-6">
          <div>
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
              Latest Innovation
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              What's New?
            </h2>
          </div>
          
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            Created with a meticulously designed <strong className="text-gray-900 font-bold">336 dimple pattern structure</strong> 
            that enhances aerodynamic performance during flight — giving you an edge on the course.
          </p>

          <ul className="space-y-4 text-lg">
            <li className="flex items-start group">
              <span className="text-green-500 font-bold mr-3 mt-1 transform group-hover:scale-110 transition-transform">✓</span>
              <span className="text-gray-800 group-hover:text-gray-900 transition-colors">
                Increased compression of the core, inner, and outer mantle to maximize energy transfer
              </span>
            </li>
            <li className="flex items-start group">
              <span className="text-green-500 font-bold mr-3 mt-1 transform group-hover:scale-110 transition-transform">✓</span>
              <span className="text-gray-800 group-hover:text-gray-900 transition-colors">
                Increased spin rate with short irons & wedges
              </span>
            </li>
            <li className="flex items-start group">
              <span className="text-green-500 font-bold mr-3 mt-1 transform group-hover:scale-110 transition-transform">✓</span>
              <span className="text-gray-800 group-hover:text-gray-900 transition-colors">
                Higher ball speeds for mid-high swing speeds
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* New Optimal Alignment Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-20">
        {/* Left: Text */}
        <div className="text-gray-900 space-y-6 order-2 md:order-1">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Optimal Alignment
            </h2>
          </div>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            Take strokes off your game with our alignment aid. Designed with crisp edges that taper towards the target, use it to visualize your aim on the tee or as a guide when lining up a putt after reading the green.
          </p>
        </div>

        {/* Right: Image */}
        <div className="flex justify-center transform hover:scale-105 transition-transform duration-300 order-1 md:order-2">
          <img
            src="https://via.placeholder.com/600x400?text=Alignment+Aid"
            alt="Golf alignment aid feature"
            className="rounded-3xl shadow-xl w-full max-w-md object-cover border-8 border-white"
          />
        </div>
      </div>
    </section>
  );
}