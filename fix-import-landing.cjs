const fs = require('fs');

let lp = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');
if (!lp.includes("import { useProductFilter }")) {
  lp = "import { useProductFilter } from '@/hooks/useProductFilter';\n" + lp;
  fs.writeFileSync('src/pages/LandingPage.tsx', lp);
  console.log('Import added.');
} else {
  console.log('Import already exists.');
}
