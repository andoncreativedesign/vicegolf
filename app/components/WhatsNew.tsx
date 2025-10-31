// app/components/WhatsNew.tsx
import { useState } from 'react';

export function WhatsNew() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  
  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };
  return (
    <section className="w-full py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* What's New Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 lg:mb-32">
          {/* Left: Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              <img
                src="/golfball.png"
                alt="GolfVice Golf Ball"
                className="w-full max-w-md lg:max-w-lg object-contain"
              />
            </div>
          </div>
          {/* Right: Text */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">What's New?</h3>
            </div>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0">
              Created with a meticulously designed <strong className="text-gray-900 font-bold">336 dimple pattern structure</strong>
              that enhances aerodynamic performance during flight — giving you an edge on the course.
            </p>
            <ul className="space-y-4 text-lg lg:text-xl max-w-md mx-auto lg:mx-0">
              <li className="flex items-start group">
                <span className="text-green-500 font-bold mr-4 mt-1 transform group-hover:scale-110 transition-transform flex-shrink-0">✓</span>
                <span className="text-gray-800 group-hover:text-gray-900 transition-colors flex-1">
                  Increased compression of the core, inner, and outer mantle to maximize energy transfer
                </span>
              </li>
              <li className="flex items-start group">
                <span className="text-green-500 font-bold mr-4 mt-1 transform group-hover:scale-110 transition-transform flex-shrink-0">✓</span>
                <span className="text-gray-800 group-hover:text-gray-900 transition-colors flex-1">
                  Increased spin rate with short irons & wedges
                </span>
              </li>
              <li className="flex items-start group">
                <span className="text-green-500 font-bold mr-4 mt-1 transform group-hover:scale-110 transition-transform flex-shrink-0">✓</span>
                <span className="text-gray-800 group-hover:text-gray-900 transition-colors flex-1">
                  Higher ball speeds for mid-high swing speeds
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Optimal Alignment Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 lg:mb-32">
          {/* Left: Text */}
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
             
                   <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">  Optimal Alignment</h3>
            </div>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Take strokes off your game with our alignment aid. Designed with crisp edges that taper towards the target, use it to visualize your aim on the tee or as a guide when lining up a putt after reading the green.
            </p>
          </div>
          {/* Right: Image */}
          <div className="flex justify-center lg:justify-start order-1 lg:order-2">
            <div className="relative group">
              <img
                src="/golfball.png"
                alt="GolfVice Golf Ball Alignment"
                className="w-full max-w-md lg:max-w-lg object-contain"
              />
            </div>
          </div>
        </div>

        {/* Engineered Performance Section */}
        <div className="text-center mb-20">
          <div className="space-y-6 max-w-4xl mx-auto">


                   <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3"> Engineered Performance</h3>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed px-4">
              Engineered with a 4-layer design, featuring a Cast Urethane cover for optimal on-course performance.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center max-w-6xl mx-auto mt-16 px-4">
            {/* Left: Outer Mantle */}
            <div className="text-right lg:text-base xl:text-lg space-y-3 p-6">
              <h2 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
                The Outer Mantle
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-xs ml-auto">
                Versatile Dow™ HPF1000 Magnesium ionomer increases elasticity for a softer feel.
              </p>
            </div>
            {/* Center: Image */}
            <div className="relative group flex justify-center">
              <img
                src="/golfball.png"
                alt="GolfVice Golf Ball Cross Section"
                className="w-full max-w-sm lg:max-w-md object-contain"
              />
            </div>
            {/* Right: The Cover */}
            <div className="text-left lg:text-base xl:text-lg space-y-3 p-6">
              <h2 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
                The Cover
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-xs">
                The thinnest Cast Urethane cover for maximum control and short game spin.
              </p>
            </div>
          </div>
        </div>

        {/* New Card Section with Accordion and Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Accordion */}
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
                Technical Specifications
              </h3>
              <div className="border-t border-gray-100">
              {[
  {
    title: 'Cast Urethane',
    content:
      'Cast Urethane is one of the best covers on the market. The process creates an extra thin cover with stronger polymer bonds compared to other ball covers, leading to optimal performance with enhanced feel and control on the course.',
  },
  {
    title: 'Vice Pro Plus Compression',
    content:
      'The Vice Pro Plus has a compression rating of 100, which is optimized to convert high swing speeds into high ball speeds with optimal efficiency. To compare compression ratings across our range, view our Ball Comparison page.',
  },
  {
    title: 'Ball Flight Trajectory',
    content:
      'The Vice Pro Plus is developed for maximum control, giving players capable of achieving high swing speeds and controlling backspin the chance to shape shots at will and gain ultimate control over the ball flight.',
  },
].map((item, index) => (
  <div key={index} className="border-b border-gray-100">
    <button
      onClick={() => toggleAccordion(index)}
      className="flex w-full items-center justify-between py-5 text-left transition-colors duration-200 hover:bg-gray-50 px-2 -mx-2 rounded"
    >
      <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
        {item.title}
      </span>
      <svg
        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${openAccordion === index ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${openAccordion === index ? 'max-h-40 pb-5' : 'max-h-0'}`}
    >
      <p className="text-sm text-gray-600 leading-relaxed tracking-wide px-2">
        {item.content}
      </p>
    </div>
  </div>
))}
              </div>
            </div>
            
            {/* Right: Image */}
            <div className="h-full min-h-[400px] bg-gray-50 flex items-center justify-center p-8">
              <img
                src="/golfball.png"
                alt="GolfVice Technical Specifications"
                className="w-full max-w-sm object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}