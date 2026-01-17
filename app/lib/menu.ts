import type {MenuFragment} from 'storefrontapi.generated';

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  items?: MenuItem[];
  resourceId?: string | null;
  tags?: string[];
  type?: string;
}

/**
 * Transform Shopify menu data into a more usable format
 */
export function transformMenuItems(menu: MenuFragment | null | undefined): MenuItem[] {
  if (!menu?.items) return [];

  return menu.items.map(item => ({
    id: item.id,
    title: item.title,
    url: item.url,
    resourceId: item.resourceId,
    tags: item.tags || [],
    type: item.type,
    items: item.items?.map(subItem => ({
      id: subItem.id,
      title: subItem.title,
      url: subItem.url,
      resourceId: subItem.resourceId,
      tags: subItem.tags || [],
      type: subItem.type,
    })) || []
  }));
}

/**
 * Get menu items by handle from Shopify
 */
export async function getMenuItems(
  storefront: any,
  menuHandle: string
): Promise<MenuItem[]> {
  try {
    const {menu} = await storefront.query(`
      query Menu($handle: String!) {
        menu(handle: $handle) {
          id
          items {
            id
            title
            url
            resourceId
            tags
            type
            items {
              id
              title
              url
              resourceId
              tags
              type
            }
          }
        }
      }
    `, {
      variables: {handle: menuHandle}
    });

    return transformMenuItems(menu);
  } catch (error) {
    return [];
  }
}

/**
 * Filter menu items by tags
 */
export function filterMenuItemsByTag(items: MenuItem[], tag: string): MenuItem[] {
  return items.filter(item => item.tags?.includes(tag));
}

/**
 * Find menu item by URL
 */
export function findMenuItemByUrl(items: MenuItem[], url: string): MenuItem | null {
  for (const item of items) {
    if (item.url === url) return item;
    if (item.items) {
      const found = findMenuItemByUrl(item.items, url);
      if (found) return found;
    }
  }
  return null;
}