const fs = require('fs');

// Replace any in ProductPage.tsx
let pp = fs.readFileSync('src/pages/ProductPage.tsx', 'utf8');
if (!pp.includes('CategoryItemVariation')) {
  pp = pp.replace("import type { CategoryItem } from '@/types/category.types';", "import type { CategoryItem, CategoryItemVariation, CategoryItemAddonGroup, CategoryItemAddonItem } from '@/types/category.types';");
}
pp = pp.replace(/\(group: any\)/g, '(group: CategoryItemAddonGroup)');
pp = pp.replace(/\(i: any\)/g, '(i: CategoryItemAddonItem)');
pp = pp.replace(/\(a1: any\[\], a2: any\[\]\)/g, '(a1: unknown[], a2: unknown[])');
pp = pp.replace(/const payload: any =/g, 'const payload: Record<string, unknown> =');
pp = pp.replace(/\(v: any\)/g, '(v: CategoryItemVariation)');
pp = pp.replace(/\(addon: any\)/g, '(addon: CategoryItemAddonItem)');
fs.writeFileSync('src/pages/ProductPage.tsx', pp);


// Replace any in LandingPage.tsx
let lp = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');
lp = lp.replace(/\(items: any\[\]\)/g, '(items: CategoryItem[])');
lp = lp.replace(/\(item: any\)/g, '(item: CategoryItem)');
lp = lp.replace(/\(a: any, b: any\)/g, '(a: CategoryItem, b: CategoryItem)');
fs.writeFileSync('src/pages/LandingPage.tsx', lp);

// Replace any in CartStore.ts
let cs = fs.readFileSync('src/store/CartStore.ts', 'utf8');
cs = cs.replace(/\(product: any, newQuantity/g, '(product: CategoryItem, newQuantity');
cs = cs.replace(/\(discount: any \| null\)/g, '(discount: unknown | null)');
cs = cs.replace(/\(item: any\)/g, '(item: CategoryItem)');
if (!cs.includes('CategoryItem')) {
   cs = cs.replace("import { create } from 'zustand';", "import { create } from 'zustand';\nimport type { CategoryItem } from '@/types/category.types';");
}
fs.writeFileSync('src/store/CartStore.ts', cs);


console.log('Fixed types in ProductPage, LandingPage, and CartStore!');
