import { Image } from "@shopify/hydrogen"
import { type MenuItem, type SecondaryMenu, type SecondaryMenuItem } from "~/lib/shopify/product-queries"
import { NavLink, useFetcher, useNavigate } from "react-router"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DropdownItemProps {
  menuItem: MenuItem
  onClose?: () => void
}

const NavDropdownItem = ({ menuItem, onClose }: DropdownItemProps) => {
  const navigate = useNavigate()
  const fetcher = useFetcher<{ collection?: { id: string } }>();

  useEffect(() => {
    console.log("menuItem nav dropdown", menuItem)
  }, [menuItem])

  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const canScroll = scrollWidth > clientWidth;
      setShowLeftArrow(canScroll && scrollLeft > 0);
      setShowRightArrow(canScroll && scrollLeft < scrollWidth - clientWidth - 1);
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

  const handleNavigate = (navItem: SecondaryMenuItem) => {
    console.log('Navigation item:', navItem);
    if (onClose) onClose();

    if (navItem.type === "COLLECTION") {
      fetcher.submit(
        { handle: navItem.handle },
        { method: "post", action: "/api/collection" }
      );
    } else if (navItem.type === "PAGE") {
      navigate(`/${navItem.handle}`);
    }
  };

  useEffect(() => {
    if (
      fetcher.state === "idle"
      && fetcher.data?.collection?.id
      && fetcher.data?.collection?.title
    ) {
      const { id, title } = fetcher.data.collection
      console.log("fetcher.data ", id, title)
      navigate(`/collections/${encodeURIComponent(JSON.stringify([id]))}/${encodeURIComponent(title)}`);
    }
  }, [fetcher.state, fetcher.data, navigate]);

  return (
    <div className="fixed left-0 right-0 mt-6 bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40 w-screen">
      <div className="relative w-full px-16 sm:px-20 lg:px-24 py-4">

        <div
          ref={containerRef}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar gap-4 py-2 px-1"
        >
          {menuItem?.items
            // ?.filter(subItem => subItem.type !== "PAGE")
            ?.filter(subItem => {
              const isPage = subItem.type === "PAGE";
              const isHidden = subItem.resource?.metafield?.key === 'exclude_collections_from_nav'
                ? JSON.parse(subItem.resource?.metafield?.value || 'false')
                : false;

              return !isPage && !isHidden;
            })
            .map((subItem, subIndex) => (
              <div key={subItem.id || subIndex} className="flex-shrink-0 snap-center">
                <NavLink
                  prefetch="intent"
                  to={subItem.url}
                  onClick={() => onClose && onClose()}
                  className="flex flex-col items-start bg-white hover:bg-gray-50 rounded-sm p-0 transition-colors group w-[180px] h-[220px] overflow-hidden"
                  style={{ textDecoration: "none" }}
                >
                  <div className="w-full bg-white">
                    <h4 className="text-sm font-medium text-gray-800 text-start line-clamp-2 p-2">
                      {subItem.title}
                    </h4>
                  </div>
                  {subItem.resource?.image?.url && (
                    <div className="w-full h-[180px] flex items-center justify-center bg-white">
                      <Image
                        data={subItem.resource.image}
                        alt={subItem.resource.image.altText || subItem.title}
                        className="w-full h-full object-cover"
                        sizes="(min-width: 1024px) 200px, (min-width: 768px) 33.33vw, 50vw"
                      />
                    </div>
                  )}
                </NavLink>
              </div>
            ))}
        </div>

        {(showLeftArrow || showRightArrow) && (
          <div className="flex justify-end mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!showLeftArrow}
                className={`rounded-full p-2 shadow-md z-10 transition-all ${showLeftArrow
                  ? 'bg-gray-200 hover:bg-gray-300 hover:scale-110 cursor-pointer text-gray-700'
                  : 'bg-gray-50 cursor-not-allowed text-gray-300'
                  }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!showRightArrow}
                className={`rounded-full p-2 shadow-md z-10 transition-all ${showRightArrow
                  ? 'bg-gray-200 hover:bg-gray-300 hover:scale-110 cursor-pointer text-gray-700'
                  : 'bg-gray-50 cursor-not-allowed text-gray-300'
                  }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* secondary link container phase 2 */}
        {/* {menuItem.items
          ?.filter(item => item.type === "PAGE" && item.resource?.metafield?.value)
          .map((item, index) => {
            const secondaryMenu = item?.resource?.metafield?.value as SecondaryMenu[];
            return (
              <div key={index} className="grid grid-cols-6 gap-8 mt-6 text-sm text-gray-800 p-4">
                {secondaryMenu.map((menu, menuIndex) => (
                  <div key={menuIndex}>
                    <h5 className="font-semibold mb-2">{menu.section}</h5>
                    <ul className="space-y-1">
                      {menu?.items?.map((menuItem, itemIndex) => (
                        <li key={itemIndex}>
                          <button
                            onClick={() => handleNavigate(menuItem)}
                            className="hover:underline text-left w-full cursor-pointer"
                            style={{ textDecoration: 'none' }}
                          >
                            {menuItem.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );
          })
        } */}

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