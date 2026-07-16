const fs = require('fs');

let lp = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');
lp = lp.replace("import type { CategoryItem } from '@/types/category.types';\n", '');
lp = lp.replace('useMemo, useCallback }', 'useMemo }');
fs.writeFileSync('src/pages/LandingPage.tsx', lp);

let pp = fs.readFileSync('src/pages/ProductPage.tsx', 'utf8');
pp = pp.replace('CategoryItem, CategoryItemVariation, CategoryItemAddonGroup, CategoryItemAddonItem', 'CategoryItemVariation, CategoryItemAddonItem');
fs.writeFileSync('src/pages/ProductPage.tsx', pp);

let cs = fs.readFileSync('src/store/CartStore.ts', 'utf8');
cs = cs.replace("import type { CategoryItem } from '@/types/category.types';\n", '');
fs.writeFileSync('src/store/CartStore.ts', cs);

console.log('Fixed unused imports.');
