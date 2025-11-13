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
    <div className="absolute mt-4 bg-white border-t border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-center items-center gap-2 px-auto">
          {menuItem?.items?.map((subItem, subIndex) => (
            <NavLink
              key={subItem.id || subIndex}
              prefetch="intent"
              to={subItem.url}
              className="flex flex-col items-center gap-1 hover:bg-gray-50 rounded-md p-2 transition group"
              style={{ textDecoration: "none" }}
            >
              <div className="flex flex-col w-full">
                <h4 className="text-sm font-medium text-gray-900 text-center">
                  {subItem.title}
                </h4>
              </div>
              {subItem.resource?.image?.url && (
                <div className="w-32 h-32 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
                  <Image
                    data={subItem.resource.image}
                    alt={subItem.resource.image.altText || subItem.title}
                    className="max-w-full max-h-full object-contain p-1"
                    sizes="(min-width: 1024px) 200px, (min-width: 768px) 33.33vw, 50vw"
                  />
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NavDropdownItem