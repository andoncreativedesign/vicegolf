import type { MenuItem, SecondaryMenu, SecondaryMenuItem } from "~/lib/shopify/product-queries";
import { Image } from "@shopify/hydrogen"
import { NavLink, useFetcher, useNavigate } from "react-router"
import NavDropdownItem from "./NavDropdownItem";
import { useAside } from '~/components/Aside';
import { useEffect, useState, useRef } from "react";
import { ChevronRight } from 'lucide-react';

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
      const ids = items.map(item => item.resourceId || '');
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

  const handleNavigate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>,navItem: SecondaryMenuItem) => {
    e.preventDefault()
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
      navigate(`/collections/${encodeURIComponent(JSON.stringify([id]))}/${encodeURIComponent(title)}`);
    }
  }, [fetcher.state, fetcher.data, navigate]);

  if (viewport === "mobile") {
    return (
      <nav className="flex flex-col p-4" role="navigation">
        {activeSubmenu ? (
          <>
            <button
              onClick={handleBackToMain}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm font-medium"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Categories
            </button>
            <h3 className="text-lg font-semibold mb-3">{activeSubmenu.title}</h3>
            
            {/* Grid for non-PAGE items */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {activeSubmenu.items
                ?.filter(subItem => subItem.type !== "PAGE")
                .map((subItem) => (
                  <NavLink
                    key={subItem.id}
                    to={subItem.url}
                    onClick={close}
                    className="flex flex-col items-center p-2 rounded-md hover:bg-gray-50 text-gray-700 border border-gray-100"
                  >
                    {subItem.resource?.image?.url && (
                      <div className="w-full aspect-square mb-2 overflow-hidden rounded-md bg-gray-50 flex items-center justify-center">
                        <Image
                          data={subItem.resource.image}
                          alt={subItem.resource.image.altText || subItem.title}
                          className="w-full h-full object-contain p-1"
                          width={120}
                          height={120}
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium text-center line-clamp-2">
                      {subItem.title}
                    </span>
                  </NavLink>
                ))}
            </div>

            {/* Secondary menu for PAGE items */}
            {activeSubmenu.items
              ?.filter(item => item.type === "PAGE" && item.resource?.metafield?.value)
              .map((item, index) => {
                const secondaryMenu = item?.resource?.metafield?.value as SecondaryMenu[];
                return (
                  <div key={index} className="grid grid-cols-2 gap-6 mt-6 text-sm text-gray-800">
                    {secondaryMenu.map((menu, menuIndex) => (
                      <div key={menuIndex}>
                        <h5 className="font-semibold mb-2">{menu.section}</h5>
                        <ul className="space-y-1">
                          {menu?.items?.map((menuItem, itemIndex) => (
                            <li key={itemIndex}>
                              <button
                                onClick={(e) => handleNavigate(e, menuItem)}
                                className="hover:underline text-left w-full cursor-pointer block"
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
              })}
          </>
        ) : (
          <div className="space-y-1">
            {menu.map((item) => (
              <div key={item.id} className="border-b border-gray-100">
                {item.items?.length > 0 ? (
                  <button
                    onClick={(e) => handleSubmenuOpen(item, e)}
                    className="w-full flex justify-between items-center py-3 px-2 text-left text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <span className="font-medium">{item.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ) : (
                  <NavLink
                    to={item.url}
                    onClick={close}
                    className="block py-3 px-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    {item.title}
                  </NavLink>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    );
  }

  // ====== DESKTOP VIEW ======
  return (
    <div className="relative w-full" ref={menuRef}>
      <nav
        className="hidden lg:flex items-center justify-center space-x-8 py-4 w-full"
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
              className={({ isActive }) =>
                `flex items-center gap-1 text-sm uppercase font-medium tracking-wide transition-colors duration-200 ${isActive ? "text-black border-b-2 border-black pb-1" : "text-gray-700 hover:text-black"
                }`
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