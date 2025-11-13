import { Image } from "@shopify/hydrogen"
import type { MenuItem } from "~/lib/shopify/product-queries"
import { NavLink } from "react-router"
import { useEffect } from "react"

interface DropdownItemProps {
  menuItem: MenuItem
}

const NavDropdownItem = ({ menuItem }: DropdownItemProps) => {

  useEffect(() => {
    console.log("menuItem ", menuItem)
  }, [menuItem])

  return (
    <div className="fixed left-0 right-0 mt-0 bg-white border-t border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 w-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {menuItem?.items?.map((subItem, subIndex) => (
            <NavLink
              key={subItem.id || subIndex}
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
                <h4 className="text-sm font-medium text-gray-900 text-center">
                  {subItem.title}
                </h4>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NavDropdownItem