import type { MenuItem } from "~/lib/shopify/product-queries";
import { Image } from "@shopify/hydrogen"
import { NavLink } from "react-router"
import NavDropdownItem from "./NavDropdownItem";
import { useAside } from '~/components/Aside';
import { useEffect, useState, useRef } from "react";
import { ChevronRight } from 'lucide-react';

const HeaderMenu = ({
  viewport,
  menuItems = []
}: {
  viewport: 'desktop' | 'mobile';
  menuItems: MenuItem[];
}) => {
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

  const updateMenuItems = (items: MenuItem[]): MenuItem[] => {

    const getAllResourceIdsOfChild = (items: MenuItem[]) => {
      const ids = items.map(item => item.resourceId || '')
      return JSON.stringify(ids)
    }

    return items.map(item => {
      const updatedItem = {
        ...item,
        url: item.resourceId
          ? `/collections/${encodeURIComponent(JSON.stringify([item.resourceId]))}/${decodeURIComponent(item.title)}`
          : `/collections/${encodeURIComponent(getAllResourceIdsOfChild(item.items))}/${decodeURIComponent(item.title)}`
      };

      if (item.items && item.items.length > 0) {
        updatedItem.items = updateMenuItems(item.items);
      }

      return updatedItem;
    });
  };

  useEffect(() => {
    if (menuItems.length === 0) return;
    const updatedMenu = updateMenuItems(menuItems);
    setMenu(updatedMenu);
  }, [menuItems]);

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
            <div className="grid grid-cols-2 gap-3">
              {activeSubmenu.items?.map((subItem) => (
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
              onClick={(e) => item.items?.length > 0 && e.preventDefault()}
              onMouseEnter={() => item.items?.length > 0 && setActiveSubmenu(item)}
              className={({ isActive }) =>
                `flex items-center gap-1 text-sm uppercase font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? "text-black border-b-2 border-black pb-1" : "text-gray-700 hover:text-black"
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