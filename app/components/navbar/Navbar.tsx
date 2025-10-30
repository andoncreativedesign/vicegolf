import {useState, useEffect, useRef} from 'react';
import {NavLink} from '@remix-run/react';

type MenuItem = {
  id: string;
  title: string;
  url: string;
  submenu?: MenuItem[];
};

const menuItems: MenuItem[] = [
  {
    id: 'home',
    title: 'Home',
    url: '/',
  },
  {
    id: 'shop',
    title: 'Shop',
    url: '/collections/all',
    submenu: [
      {id: 'new-arrivals', title: 'New Arrivals', url: '/collections/new'},
      {id: 'best-sellers', title: 'Best Sellers', url: '/collections/best-sellers'},
      {id: 'sale', title: 'Sale', url: '/collections/sale'},
    ],
  },
  {
    id: 'collections',
    title: 'Collections',
    url: '/collections',
    submenu: [
      {id: 'men', title: 'Men', url: '/collections/men'},
      {id: 'women', title: 'Women', url: '/collections/women'},
      {id: 'accessories', title: 'Accessories', url: '/collections/accessories'},
    ],
  },
  {
    id: 'about',
    title: 'About Us',
    url: '/pages/about',
  },
  {
    id: 'contact',
    title: 'Contact',
    url: '/pages/contact',
  },
];

export function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = (menuId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(menuId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav 
      className="relative bg-white shadow-sm"
      ref={navRef}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {menuItems.map((item) => (
                <div key={item.id} className="relative">
                  <NavLink
                    to={item.url}
                    className={({isActive}) => 
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive 
                          ? 'border-indigo-500 text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`
                    }
                    onMouseEnter={() => handleMouseEnter(item.id)}
                  >
                    {item.title}
                  </NavLink>
                  
                  {item.submenu && activeMenu === item.id && (
                    <div 
                      className="absolute z-10 -ml-4 mt-0 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
                      onMouseEnter={() => handleMouseEnter(item.id)}
                    >
                      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {item.submenu.map((subItem) => (
                            <NavLink
                              key={subItem.id}
                              to={subItem.url}
                              className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
                            >
                              <div className="ml-4">
                                <p className="text-base font-medium text-gray-900">
                                  {subItem.title}
                                </p>
                              </div>
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <NavLink
                to={item.url}
                className={({isActive}) => 
                  `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`
                }
              >
                {item.title}
              </NavLink>
              {item.submenu && (
                <div className="pl-6 py-2 space-y-1">
                  {item.submenu.map((subItem) => (
                    <NavLink
                      key={subItem.id}
                      to={subItem.url}
                      className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {subItem.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;