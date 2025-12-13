import type { MenuItem, SecondaryMenu, SecondaryMenuItem } from "~/lib/shopify/product-queries";
import { Image } from "@shopify/hydrogen"
import { NavLink, useFetcher, useNavigate } from "react-router"
import NavDropdownItem from "./NavDropdownItem";
import { useAside } from '~/components/Aside';
import { useEffect, useState, useRef } from "react";
import { CountryCurrencySelector } from '../Header';

// Custom SVG Caret component
const CaretIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="transparent"
    stroke="currentColor"
    className={`w-5 h-5 transition -rotate-90 w-8 h-8 ${className}`}
    aria-hidden="true"
  >
    <title>Caret</title>
    <path d="M14 8L10 12L6 8" strokeWidth={1.25} />
  </svg>
);

const HeaderMenu = ({
  viewport,
  menuItems = [],
}: {
  viewport: 'desktop' | 'mobile';
  menuItems: MenuItem[];
}) => {
  const fetcher = useFetcher()
  const navigate = useNavigate()
  const { close } = useAside();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [activeSubmenu, setActiveSubmenu] = useState<MenuItem | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSubmenuOpen = (item: MenuItem, event: React.MouseEvent) => {
    event.preventDefault();
    setActiveSubmenu(item);
  };

  const handleBackToMain = (event: React.MouseEvent) => {
    event.preventDefault();
    setActiveSubmenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  function reconstructMenuObject(value: string | null | undefined): SecondaryMenu[] | null {
    if (!value || typeof value !== "string") return null;

    const trimmed = value.trim();

    // guard: Shopify sometimes returns "Internal Server Error" or HTML
    if (trimmed.startsWith("<") || trimmed.startsWith("Internal")) {
      console.error("Invalid metafield content:", trimmed);
      return null;
    }

    // guard: must start with JSON array `[`
    if (!trimmed.startsWith("[")) {
      console.error("Not JSON array:", trimmed);
      return null;
    }

    try {
      const parsed = JSON.parse(trimmed);

      if (!Array.isArray(parsed)) {
        console.error("Parsed value is not an array:", parsed);
        return null;
      }

      return parsed.map((section: any) => ({
        section: String(section.section || ""),
        items: Array.isArray(section.items)
          ? section.items.map((i: any) => ({
            title: String(i.title || ""),
            type: i.type === "PAGE" ? "PAGE" : "COLLECTION",
            handle: String(i.handle || "")
          }))
          : []
      }));
    } catch (e) {
      console.error("JSON parse failed:", e);
      return null;
    }
  }



  const updateMenuItems = (items: MenuItem[]): MenuItem[] => {

    const getAllResourceIdsOfChild = (items: MenuItem[]) => {
      const ids = items
        .filter(item => item.type === "COLLECTION")
        .map(item => item.resourceId || '');

      return JSON.stringify(ids);
    };

    return items.map(item => {
      let updatedItem: MenuItem;
      const handle = item?.resource?.handle || '';

      if (item.type === "PRODUCT") {
        updatedItem = {
          ...item,
          resource: {
            ...item.resource,
            image: item?.resource?.featuredImage
          },
          url: `/products/${encodeURIComponent(handle)}/`
        };
      } else if (item.type === 'PAGE') {
        const reconstructed = reconstructMenuObject(item.resource?.metafield?.value);
        console.log("reconstructed ", reconstructed)

        updatedItem = {
          ...item,
          resource: {
            id: item.resource?.id || "",
            handle: item.resource?.handle || "",
            title: item.resource?.title || "",
            metafield: {
              key: item.resource?.metafield?.key || "",
              value: reconstructed
            }
          }
        };

      } else {
        updatedItem = {
          ...item,
          url: item.resourceId
            ? `/collections/${encodeURIComponent(JSON.stringify([item.resourceId]))}/${decodeURIComponent(item.title)}`
            : `/collections/${encodeURIComponent(getAllResourceIdsOfChild(item.items || []))}/${decodeURIComponent(item.title)}`
        };
      }

      // Handle nested items
      if (item.items?.length) {
        updatedItem = {
          ...updatedItem,
          items: updateMenuItems(item.items)
        };
      }

      return updatedItem;
    });
  };

  useEffect(() => {
    if (menuItems.length === 0) return;
    const updatedMenu = updateMenuItems(menuItems);
    console.log('updated menuitems reconstructed  - ', updatedMenu)
    setMenu(updatedMenu);
  }, [menuItems]);

  const handleNavigate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, navItem: SecondaryMenuItem) => {
    e.preventDefault();
    close(); // Close the menu immediately when any link is clicked

    if (navItem.type === "COLLECTION") {
      fetcher.submit(
        { handle: navItem.handle },
        { method: "post", action: "/api/collection" }
      );
    } else if (navItem.type === "PAGE") {
      navigate(`/${navItem.handle}`);
    }
  }

  useEffect(() => {
    if (
      fetcher.state === "idle"
      && fetcher.data?.collection?.id
      && fetcher.data?.collection?.title
    ) {
      const { id, title } = fetcher.data.collection
      console.log("fetcher.data ", id, title)
      close(); // Ensure menu is closed before navigation
      navigate(`/collections/${encodeURIComponent(JSON.stringify([id]))}/${encodeURIComponent(title)}`);
    }
  }, [fetcher.state, fetcher.data, navigate]);

  if (viewport === "mobile") {
    return (
      <nav className="w-full h-full flex flex-col relative" role="navigation">
        <div className="flex-1 overflow-y-auto pb-24">
          {activeSubmenu ? (
            <div>
              <button
                onClick={handleBackToMain}
                className="font-semibold text-main-900 flex items-center text-copy mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="transparent" stroke="currentColor" className="w-5 h-5 transition rotate-90 w-8 h-8 -ml-2.5"><title>Caret</title><path d="M14 8L10 12L6 8" strokeWidth="1.25"></path></svg>Back
              </button>
              <h3 className="text-lg font-semibold mb-3">{activeSubmenu.title}</h3>

              {/* Grid for non-PAGE items */}
              <div className="grid grid-cols-2 gap-3 mb-4 w-full pr-2">
                {activeSubmenu.items
                  ?.filter(subItem => subItem.type !== "PAGE")
                  .map((subItem) => (
                    <NavLink
                      key={subItem.id}
                      to={subItem.url}
                      onClick={close}
                      className="flex flex-col items-center p-0 rounded-md hover:bg-gray-50 text-gray-700 border-0 relative"
                    >
                      {subItem.resource?.image?.url && (
                        <div className="w-full aspect-square mb-2 overflow-hidden rounded-none bg-gray-50 flex items-center justify-center relative">
                          <span className="text-black text-xs font-semibold absolute top-2 left-3 max-w-[90%] line-clamp-1">
                            {subItem.title}
                          </span>
                          <Image
                            data={subItem.resource.image}
                            alt={subItem.resource.image.altText || subItem.title}
                            className="w-full h-full object-contain p-1"
                            width={120}
                            height={120}
                          />
                        </div>
                      )}
                    </NavLink>
                  ))}
              </div>
            </div>
          ) : (
            <div className="w-full">
              {menu.map((item) => (
                <div key={item.id} className="">
                  {item.items?.length > 0 ? (
                    <button
                      onClick={(e) => handleSubmenuOpen(item, e)}
                      className="text-left text-xl font-semibold w-full flex justify-between items-center py-1.5 px-2 text-gray-700 hover:bg-gray-50"
                    >
                      <span className="uppercase">{item.title}</span>
                      <CaretIcon className="text-black" />
                    </button>
                  ) : (
                    <NavLink
                      to={item.url}
                      onClick={close}
                      className="block w-full py-1.5 px-2 text-xl font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <span className="uppercase">{item.title}</span>
                    </NavLink>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Country Selector for Mobile - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
          <div className="relative z-50">
            <CountryCurrencySelector isMobile={true} />
          </div>
        </div>
      </nav>
    );
  }

  // ====== DESKTOP VIEW ======
  return (
    <div className="relative w-full z-30" ref={menuRef}>
      <nav
        className="hidden lg:flex items-center justify-center space-x-16 py-4 w-full"
        role="navigation"
      >
        {menu?.map((item) => (
          <div
            key={item.id}
            className={`group ${item.items?.length > 0 ? "relative" : ""}`}
          >
            <NavLink
              prefetch="intent"
              to={item.url}
              onMouseEnter={() => item.items?.length > 0 && setActiveSubmenu(item)}
              onClick={() => setActiveSubmenu(null)}
              className={({ isActive }) =>
                `flex items-center gap-1 text-sm uppercase font-medium tracking-wide transition-colors duration-200 ${isActive ? "text-black" : "text-gray-700 hover:text-black"}`
              }
              style={{ textDecoration: "none" }}
            >
              {item.title}
            </NavLink>

            {activeSubmenu?.id === item.id && (
              <NavDropdownItem
                menuItem={item}
                onBack={handleBackToMain}
                onClose={() => setActiveSubmenu(null)}
              />
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}

export default HeaderMenu