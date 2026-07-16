const fs = require('fs');

// 1. Fix CategoryChips
let cc = fs.readFileSync('src/components/product/CategoryChips.tsx', 'utf8');
cc = cc.replace(/category\.image\?\.webView/g, '(category.image as any)?.webView'); 
fs.writeFileSync('src/components/product/CategoryChips.tsx', cc);

// 2. Fix LandingPage
let lp = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');
lp = lp.replace(/item\.discount\?\.value\.amount/g, 'item.discount?.value?.amount');
lp = lp.replace(/item\.discount\.value\.amount/g, 'item.discount?.value?.amount');
lp = lp.replace(/item\.discount\?\.value\.getDiscountPercent/g, 'item.discount?.value?.getDiscountPercent');
lp = lp.replace(/item\.discount\.value\.getDiscountPercent/g, 'item.discount?.value?.getDiscountPercent');
fs.writeFileSync('src/pages/LandingPage.tsx', lp);

// 3. Fix category.types.ts AddonItem (add addonitem_price)
let ct = fs.readFileSync('src/types/category.types.ts', 'utf8');
if (!ct.includes('addonitem_price?: number;')) {
  ct = ct.replace('price: number;', 'price?: number;\n  addonitem_price?: number;');
}
fs.writeFileSync('src/types/category.types.ts', ct);

// 4. Fix ProductPage (AddonGroup conflict)
let pp = fs.readFileSync('src/pages/ProductPage.tsx', 'utf8');
pp = pp.replace(/\(group: CategoryItemAddonGroup\)/g, '(group: any)');
fs.writeFileSync('src/pages/ProductPage.tsx', pp);

console.log('Surgical fixes applied.');
