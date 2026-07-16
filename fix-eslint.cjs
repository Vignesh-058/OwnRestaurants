const fs = require('fs');
let file = fs.readFileSync('src/components/location/LocationSelectorModal.tsx', 'utf8');
file = file.replace('const [loading, setLoading] = useState(false);', '');
fs.writeFileSync('src/components/location/LocationSelectorModal.tsx', file);
