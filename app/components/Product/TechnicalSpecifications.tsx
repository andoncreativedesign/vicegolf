import { useState, useEffect, useRef } from 'react';
import { Image } from '@shopify/hydrogen';

type TabType = 'specs' | 'shafts' | 'grips';

interface SpecsData {
  head: string[];
  loft: string[];
  lie: string[];
}

interface ShaftData {
  id: string;
  name: string;
  variants: {
    flex: string;
    weight: string;
    launch: string;
    spin: string;
  }[];
}

interface GripData {
  id: string;
  name: string;
  colors: string[];
  weight: string;
}

export function TechnicalSpecifications() {
  const [activeTab, setActiveTab] = useState<TabType>('specs');
  const [activeShaft, setActiveShaft] = useState<number>(0);
  const [activeShaftColor, setActiveShaftColor] = useState<number>(0);
  const [activeGripColor, setActiveGripColor] = useState<{ [key: string]: number }>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const specsData: SpecsData = {
    head: ['460cc', '440cc','450cc'],
    loft: ['9°', '10.5°', '12°'],
    lie: ['56°', '58°', '60°']
  };

  const getActiveSpecValue = (values: string[]) => {
    return values.length > 0 ? values[0] : '';
  };

  const shaftsData: ShaftData[] = [
    {
      id: '1',
      name: 'Whiz 55w+ by Aldila',
      variants: [
        { flex: 'A', weight: '57g', launch: 'Mid Launch', spin: 'Low Spin' },
        { flex: 'R', weight: '57g', launch: 'Mid Launch', spin: 'Low Spin' }
      ]
    },
    {
      id: '2',
      name: 'Whiz 65w+ by Aldila',
      variants: [
        { flex: 'R', weight: '68g', launch: 'Low/Mid Launch', spin: 'Low Spin' },
        { flex: 'S', weight: '68g', launch: 'Low/Mid Launch', spin: 'Low Spin' }
      ]
    },
    {
      id: '3',
      name: 'Whiz 80w+ by Aldila',
      variants: [
        { flex: 'S', weight: '80g', launch: 'Low Launch', spin: 'Low Spin' },
        { flex: 'X', weight: '80g', launch: 'Low Launch', spin: 'Low Spin' }
      ]
    },
    {
      id: '4',
      name: 'Whiz 80w+ by Aldila',
      variants: [
        { flex: 'S', weight: '80g', launch: 'Low Launch', spin: 'Low Spin' },
        { flex: 'X', weight: '80g', launch: 'Low Launch', spin: 'Low Spin' }
      ]
    }
  ];

  const gripsData: GripData[] = [
    {
      id: '1',
      name: 'VICE OG STANDARD',
      colors: ['#000000', '#808080', '#87CEEB', '#FF0000', '#32CD32', '#FFC0CB'],
      weight: '52 g'
    },
    {
      id: '2',
      name: 'VICE OG MIDSIZE',
      colors: ['#000000', '#808080', '#87CEEB', '#FF0000', '#32CD32', '#FFC0CB'],
      weight: '66 g'
    },
    {
      id: '3',
      name: 'LAMKIN UTX CORD STANDARD',
      colors: ['#000080', '#006400', '#000080'],
      weight: '53 g'
    },
    {
      id: '4',
      name: 'LAMKIN UTX CORD MIDSIZE',
      colors: ['#000080', '#006400', '#000080'],
      weight: '64 g'
    }
  ];

  const renderTabContent = () => {
    const visibleShafts = isMobile ? [shaftsData[activeShaft]] : shaftsData.slice(activeShaft, activeShaft + (isMobile ? 1 : 3));
    const canGoBack = activeShaft > 0;
    const canGoForward = activeShaft < shaftsData.length - (isMobile ? 1 : 3);
    switch (activeTab) {
      case 'specs':
        return (
          <div className="max-w-[350px] mx-auto pr-15">
       <div className="space-y-4">
    {/* Head Spec */}
    <div className="flex items-center  pb-2">
      <div className="w-1/4 text-sm font-bold text-gray-900">HEAD</div>
      <div className="w-3/4 flex justify-between">
        {specsData.head.map((size, idx) => (
          <div key={idx} className="text-sm text-gray-900">
            {size}
          </div>
        ))}
      </div>
    </div>

    {/* Loft Spec */}
    <div className="flex items-center pb-2">
      <div className="w-1/4 text-sm font-bold text-gray-900">LOFT</div>
      <div className="w-3/4 flex justify-between">
        {specsData.loft.map((loft, idx) => (
          <div key={idx} className="text-sm text-gray-900">
            {loft}
          </div>
        ))}
      </div>
    </div>

    {/* Lie Spec */}
    <div className="flex items-center pb-2">
      <div className="w-1/4 text-sm font-bold text-gray-900">LIE</div>
      <div className="w-3/4 flex justify-between">
        {specsData.lie.map((lie, idx) => (
          <div key={idx} className="text-sm text-gray-900">
            {lie}
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
        );

      case 'shafts':
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-8">
              <div className="inline-flex border border-gray-800 rounded-full overflow-hidden">
                <button
                  className="px-6 py-2 text-sm font-medium  text-black  transition-colors"
                  onClick={() => { }}
                >
                  GRAPHITE
                </button>
              </div>
            </div>
              {/* Navigation Arrows - Moved to top right */}
              <div className="flex justify-end mb-2 space-x-1">
                <button
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${!canGoBack ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:bg-gray-100 cursor-pointer'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canGoBack) setActiveShaft(prev => Math.max(0, prev - 1));
                  }}
                  disabled={!canGoBack}
                  aria-label="Previous shaft"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${!canGoForward ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:bg-gray-100 cursor-pointer'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canGoForward) setActiveShaft(prev => prev + 1);
                  }}
                  disabled={!canGoForward}
                  aria-label="Next shaft"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              
                <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
                  <div className="flex space-x-6">
                    {visibleShafts.map((shaft, index) => (
                      <div key={`${shaft.id}-${index}`} className="flex-shrink-0" style={{ width: '418.667px', marginRight: '36px' }}>
                        <div className="p-6 border border-gray-200 h-full">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">{shaft.name}</h4>
                          <div className="flex space-x-1">
                            {[0, 1].map((colorIndex) => (
                              <button
                                key={colorIndex}
                                className={`w-5 h-5 rounded-full border ${activeShaftColor === colorIndex ? 'border-gray-900' : 'border-gray-300'}`}
                                style={{
                                  backgroundColor: colorIndex === 0 ? '#000000' : '#40E0D0',
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveShaftColor(colorIndex);
                                }}
                                aria-label={`Color ${colorIndex + 1}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Shaft Image */}
                        <div className="bg-gray-100 h-24 mb-3 flex items-center justify-center">
                          <span className="text-xs text-gray-400">Shaft Image</span>
                        </div>

                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-gray-500 border-b border-gray-200">
                              <th className="pb-1 font-normal text-left">FLEX</th>
                              <th className="pb-1 font-normal text-left">WEIGHT</th>
                              <th className="pb-1 font-normal text-left">LAUNCH</th>
                              <th className="pb-1 font-normal text-left">SPIN</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shaft.variants.map((variant, idx) => (
                              <tr key={idx} className="border-b border-gray-100 last:border-0">
                                <td className="py-1.5">{variant.flex}</td>
                                <td className="py-1.5">{variant.weight}</td>
                                <td className="py-1.5">{variant.launch}</td>
                                <td className="py-1.5">{variant.spin}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
        );

      case 'grips':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gripsData.map((grip) => {
              const activeColorIndex = activeGripColor[grip.id] || 0;
              return (
                <div key={grip.id} className="border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                  {/* Grip Image Placeholder */}
                  <div className="bg-gray-100 h-32 mb-3 flex items-center justify-center">
                    <span className="text-xs text-gray-400">Grip Image</span>
                  </div>

                  <h4 className="text-xs font-medium text-gray-900 mb-2 uppercase">{grip.name}</h4>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {grip.colors.map((color, idx) => (
                      <button
                        key={idx}
                        className={`w-4 h-4 rounded-full border ${activeColorIndex === idx ? 'border-gray-900' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setActiveGripColor(prev => ({ ...prev, [grip.id]: idx }))}
                        aria-label={`Color ${idx + 1} for ${grip.name}`}
                      />
                    ))}
                  </div>

                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Weight: </span>
                    <span>{grip.weight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-center font-bold text-gray-900 mb-8">TECHNICAL SPECIFICATIONS</h2>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex justify-center space-x-8">
          {(['specs', 'shafts', 'grips'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setActiveShaft(0);
              }}
              className={`py-3 px-1 border-b-2 font-medium text-sm tracking-wider ${activeTab === tab
                  ? 'border-black text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).toUpperCase()}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
