import { useState } from "react";


const ProductAccordion2 = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

    return (
      <>
        <div className="text-center mb-8">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Technical Specs
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Accordion */}
            <div className="p-8 lg:p-12">
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
                      onClick={() =>
                        setOpenAccordion(openAccordion === index ? null : index)
                      }
                      className="flex w-full items-center justify-between py-5 text-left transition-colors duration-200 hover:bg-gray-50 px-2 -mx-2 rounded"
                    >
                      <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
                        {item.title}
                      </span>
                      <svg
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${openAccordion === index ? 'rotate-180' : ''
                          }`}
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

                    {/* FIXED SECTION: use scaleY animation instead of height expansion */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${openAccordion === index
                        ? 'grid-rows-[1fr] opacity-100 scale-y-100'
                        : 'grid-rows-[0fr] opacity-0 scale-y-95'
                        }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm text-gray-600 leading-relaxed tracking-wide px-2 pb-4">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Right: Image */}
            <div className="h-full min-h-[400px] flex items-center justify-center p-8">
              <img
                src="/golfball.png"
                alt="GolfVice Technical Specifications"
                className="w-full max-w-sm object-contain"
              />
            </div>
          </div>
        </div>
      </>
    )
}

export default ProductAccordion2
