import {NavLink} from 'react-router';
import type {MenuFragment} from 'storefrontapi.generated';

interface MenuProps {
  menu: MenuFragment | null | undefined;
  primaryDomainUrl: string;
  publicStoreDomain: string;
  className?: string;
}

interface MenuItem {
  id: string;
  title: string;
  url: string;
  items?: MenuItem[];
}

export function Menu({menu, primaryDomainUrl, publicStoreDomain, className = ''}: MenuProps) {
  if (!menu?.items) return null;

  // Convert Shopify URLs to relative URLs
  const convertToRelativeUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch {
      return url; // Return as-is if not a valid URL
    }
  };

  const menuItems: MenuItem[] = menu.items.map(item => ({
    id: item.id,
    title: item.title,
    url: convertToRelativeUrl(item.url),
    items: item.items?.map(subItem => ({
      id: subItem.id,
      title: subItem.title,
      url: convertToRelativeUrl(subItem.url),
    })) || []
  }));

  return (
    <nav className={`menu ${className}`} role="navigation">
      {menuItems.map((item) => (
        <div key={item.id} className="menu-item">
          <NavLink
            prefetch="intent"
            to={item.url}
            className={({isActive}) => 
              `menu-link ${isActive ? 'active' : ''}`
            }
          >
            {item.title}
          </NavLink>
          
          {/* Sub-menu items */}
          {item.items && item.items.length > 0 && (
            <div className="sub-menu">
              {item.items.map((subItem) => (
                <NavLink
                  key={subItem.id}
                  prefetch="intent"
                  to={subItem.url}
                  className={({isActive}) => 
                    `sub-menu-link ${isActive ? 'active' : ''}`
                  }
                >
                  {subItem.title}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

// Utility function to get menu items as plain objects
export function getMenuItems(menu: MenuFragment | null | undefined): MenuItem[] {
  if (!menu?.items) return [];

  const convertToRelativeUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch {
      return url;
    }
  };

  return menu.items.map(item => ({
    id: item.id,
    title: item.title,
    url: convertToRelativeUrl(item.url),
    items: item.items?.map(subItem => ({
      id: subItem.id,
      title: subItem.title,
      url: convertToRelativeUrl(subItem.url),
    })) || []
  }));
}