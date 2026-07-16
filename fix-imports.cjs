const fs = require('fs');

// LandingPage.tsx
let lp = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');
if (!lp.includes('CategoryItem')) {
  lp = lp.replace(
    "import { useCategories } from '@/hooks/queries/useCategories';",
    "import { useCategories } from '@/hooks/queries/useCategories';\nimport type { CategoryItem } from '@/types/category.types';"
  );
}
fs.writeFileSync('src/pages/LandingPage.tsx', lp);

// ProductPage.tsx
let pp = fs.readFileSync('src/pages/ProductPage.tsx', 'utf8');
if (!pp.includes('CategoryItemAddonGroup')) {
  pp = pp.replace(
    "import type { CategoryItem } from '@/types/category.types';",
    "import type { CategoryItem, CategoryItemAddonGroup, CategoryItemAddonItem, CategoryItemVariation } from '@/types/category.types';"
  );
}
if (!pp.includes('CategoryItemAddonItem')) {
    pp = pp.replace(
    "import type { CategoryItem, CategoryItemVariation } from '@/types/category.types';",
    "import type { CategoryItem, CategoryItemVariation, CategoryItemAddonGroup, CategoryItemAddonItem } from '@/types/category.types';"
  );
}
fs.writeFileSync('src/pages/ProductPage.tsx', pp);

console.log('Imports fixed!');
