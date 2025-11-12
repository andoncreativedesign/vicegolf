import type { MenuItem } from "~/lib/shopify/product-queries";
import { Image } from "@shopify/hydrogen"
import { NavLink } from "react-router"
import NavDropdownItem from "./NavDropdownItem";
import { useAside } from '~/components/Aside';


const HeaderMenu = ({
  viewport,
  menuItems
}: {
  viewport: 'desktop' | 'mobile';
  menuItems: MenuItem[];
}) => {
  const { close } = useAside();

  if (viewport === "mobile") {
    return (
      <nav className="flex flex-col space-y-4 p-4" role="navigation">
        {menuItems?.map((item, index) => (
          <div key={item.id || index}>
            <NavLink
              onClick={close}
              prefetch="intent"
              to={item.url as string}
              className="text-lg font-medium text-gray-900 hover:text-gray-600 block"
              style={{ textDecoration: "none" }}
            >
              {item.title}
            </NavLink>

            {/* Sub-menu with possible images */}
            {item.items?.length > 0 && (
              <div className="ml-4 mt-3 space-y-3">
                {item.items.map((subItem, subIndex) => (
                  <div key={subItem.id || subIndex}>
                    <NavLink
                      onClick={close}
                      prefetch="intent"
                      to={subItem.url}
                      className="flex items-center gap-3 text-base font-normal text-gray-700 hover:text-gray-900"
                      style={{ textDecoration: "none" }}
                    >
                      {/* Image if resource image exists */}
                      {subItem.resource?.image?.url && (
                        <Image
                          data={subItem.resource.image}
                          alt={subItem.resource.image.altText || subItem.title}
                          className="w-10 h-10 object-cover rounded-md uppercase"
                        />
                      )}
                      <span>{subItem.title}</span>
                    </NavLink>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }

  // ====== DESKTOP VIEW ======
  return (
    <div className="relative w-full">
      <nav
        className="hidden lg:flex items-center justify-center space-x-8 py-4 w-full"
        role="navigation"
      >
        {menuItems?.map((item, index) => (
          <div
            key={item.id || index}
            className={`group ${item.items?.length > 0 ? "relative" : ""
              }`}
          >
            <NavLink
              prefetch="intent"
              to={item.url}
              className={({ isActive }) =>
                `text-sm uppercase font-medium tracking-wide transition-colors duration-200 ${isActive
                  ? "text-black border-b-2 border-black pb-1"
                  : "text-gray-700 hover:text-black"
                }`
              }
              style={{ textDecoration: "none" }}
            >
              {item.title}
            </NavLink>

            <NavDropdownItem menuItem={item} />
          </div>
        ))}
      </nav>
    </div>
  )
}

export default HeaderMenu