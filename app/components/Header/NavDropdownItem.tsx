import { Image } from "@shopify/hydrogen"
import { COLLECTION_PRODUCTS_QUERY, GET_COLLECTION_DETAILS_WITHOUT_PRODUCTS, type MenuItem, type SecondaryMenu, type SecondaryMenuItem } from "~/lib/shopify/product-queries"
import { NavLink, useFetcher, useNavigate } from "react-router"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { axiosShopifyAdmin } from "~/utils/axiosInsatances"

interface DropdownItemProps {
  menuItem: MenuItem
}

const NavDropdownItem = ({ menuItem }: DropdownItemProps) => {
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

  const handleNavigate = (navItem: SecondaryMenuItem) => {
    console.log('Navigation item:', navItem);
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
    <div className="fixed left-0 right-0 mt-0 bg-white border-t border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 w-screen">
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-4">

        <div
          ref={containerRef}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar gap-4 py-2 px-1"
        >
          {menuItem?.items
            ?.filter(subItem => subItem.type !== "PAGE")
            .map((subItem, subIndex) => (
              <div key={subItem.id || subIndex} className="flex-shrink-0 w-[calc((100%-5rem)/6)] snap-center">
                <NavLink
                  prefetch="intent"
                  to={subItem.url}
                  className="flex flex-col gap-2 bg-gray-50 hover:bg-gray-100 rounded-md p-3 transition-colors group w-full h-full"
                  style={{ textDecoration: "none" }}
                >
                  <div className="w-full">
                    <h4 className="text-sm font-medium text-gray-900 text-start line-clamp-2">
                      {subItem.title}
                    </h4>
                  </div>
                  {subItem.resource?.image?.url && (
                    <div className="w-full aspect-square rounded-md overflow-hidden flex items-center justify-center mt-2">
                      <Image
                        data={subItem.resource.image}
                        alt={subItem.resource.image.altText || subItem.title}
                        className="w-full h-full object-contain p-2"
                        sizes="(min-width: 1024px) 200px, (min-width: 768px) 33.33vw, 50vw"
                      />
                    </div>
                  )}
                </NavLink>
              </div>
            ))}
        </div>

        {menuItem.items
          ?.filter(item => item.type === "PAGE" && item.resource?.metafield?.value)
          .map((item, index) => {
            const secondaryMenu = item?.resource?.metafield?.value as SecondaryMenu[];
            return (
              <div key={index} className="grid grid-cols-6 gap-8 mt-6 text-sm text-gray-800">
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
        }

        <div className="flex justify-end items-center gap-4 mt-4 pt-2">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 z-10 transition-all hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 z-10 transition-all hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
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