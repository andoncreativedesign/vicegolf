import { Image } from "@shopify/hydrogen"
import type { MenuItem } from "~/lib/shopify/product-queries"
import { NavLink } from "react-router"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DropdownItemProps {
  menuItem: MenuItem
}

const NavDropdownItem = ({ menuItem }: DropdownItemProps) => {

  useEffect(() => {
    console.log("menuItem ", menuItem)
  }, [menuItem])

  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [menuItem]);

  return (
    <div className="fixed left-0 right-0 mt-0 bg-white border-t border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 w-screen">
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-4">
        
        <div 
          ref={containerRef}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar gap-4 py-2 px-1"
        >
          {menuItem?.items?.map((subItem, subIndex) => (
            <div key={subItem.id || subIndex} className="flex-shrink-0 w-[calc((100%-5rem)/6)] snap-center">
              <NavLink
                prefetch="intent"
                to={subItem.url}
                className="flex flex-col items-center gap-2 hover:bg-gray-50 rounded-md p-3 transition group w-full"
                style={{ textDecoration: "none" }}
              >
                {subItem.resource?.image?.url && (
                  <div className="w-full aspect-square bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
                    <Image
                      data={subItem.resource.image}
                      alt={subItem.resource.image.altText || subItem.title}
                      className="w-full h-full object-contain p-2"
                      sizes="(min-width: 1024px) 200px, (min-width: 768px) 33.33vw, 50vw"
                    />
                  </div>
                )}
                <div className="w-full">
                  <h4 className="text-sm font-medium text-gray-900 text-center line-clamp-2">
                    {subItem.title}
                  </h4>
                </div>
              </NavLink>
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center gap-4 mt-4 pt-2">
          {showLeftArrow && (
            <button 
              onClick={() => scroll('left')}
              className="bg-white/80 hover:bg-white text-red-500 rounded-full p-2 shadow-md z-10 transition-all hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-red-500" />
            </button>
          )}
          
          {showRightArrow && (
            <button 
              onClick={() => scroll('right')}
              className="bg-white/80 hover:bg-white text-red-500 rounded-full p-2 shadow-md z-10 transition-all hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-red-500" />
            </button>
          )}
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default NavDropdownItem