const fs = require('fs');

let lp = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');

// 1. Add hook import
if (!lp.includes('useProductFilter')) {
  lp = lp.replace(
    "import { useCategories } from '@/hooks/queries/useCategories';",
    "import { useCategories } from '@/hooks/queries/useCategories';\nimport { useProductFilter } from '@/hooks/useProductFilter';"
  );
}

// 2. Remove applyFiltersToItems completely
const startIndex = lp.indexOf('  const applyFiltersToItems = useCallback((items: CategoryItem[]) => {');
const endIndexStr = "return filtered;\n  }, [filters]);";
let endIndex = lp.indexOf(endIndexStr, startIndex);
if (startIndex !== -1 && endIndex !== -1) {
  endIndex += endIndexStr.length;
  lp = lp.substring(0, startIndex) + lp.substring(endIndex);
}

// 3. Replace recommendedProducts definition
const recStart = lp.indexOf('const recommendedProducts = useMemo(() => {');
const recEndStr = "}, [allProducts, applyFiltersToItems]);";
let recEnd = lp.indexOf(recEndStr, recStart);
if (recStart !== -1 && recEnd !== -1) {
  recEnd += recEndStr.length;
  const newRec = `  const recommendedProductsBase = useMemo(() => {
    return allProducts.filter((p) => p.bestseller || (p.rating && p.rating >= 4.5));
  }, [allProducts]);

  const filteredRecommendedProducts = useProductFilter(recommendedProductsBase, filters);
  const recommendedProducts = useMemo(() => filteredRecommendedProducts.slice(0, 8), [filteredRecommendedProducts]);`;
  
  lp = lp.substring(0, recStart) + newRec + lp.substring(recEnd);
}

fs.writeFileSync('src/pages/LandingPage.tsx', lp);
console.log('LandingPage refactored with custom hook!');
