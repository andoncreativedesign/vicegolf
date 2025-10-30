import type {MenuFragment} from 'storefrontapi.generated';

/**
 * Debug utility to log menu items to console
 */
export function debugMenuItems(menu: MenuFragment | null | undefined, menuName = 'Menu') {
  if (!menu?.items) {
    console.log(`🔍 ${menuName}: No menu items found`);
    return;
  }

  console.log(`🔍 ${menuName} Items (${menu.items.length} total):`);
  
  menu.items.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.title}`);
    console.log(`     URL: ${item.url}`);
    console.log(`     Type: ${item.type}`);
    console.log(`     ID: ${item.id}`);
    
    if (item.items && item.items.length > 0) {
      console.log(`     Sub-items (${item.items.length}):`);
      item.items.forEach((subItem, subIndex) => {
        console.log(`       ${index + 1}.${subIndex + 1}. ${subItem.title} -> ${subItem.url}`);
      });
    }
    console.log('');
  });
}

/**
 * Get menu items as a simple array for easy use
 */
export function getSimpleMenuItems(menu: MenuFragment | null | undefined) {
  if (!menu?.items) return [];

  return menu.items.map(item => ({
    title: item.title,
    url: item.url,
    type: item.type,
    id: item.id,
    subItems: item.items?.map(subItem => ({
      title: subItem.title,
      url: subItem.url,
      type: subItem.type,
      id: subItem.id,
    })) || []
  }));
}