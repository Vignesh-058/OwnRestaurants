const fs = require('fs');
const path = require('path');

const mappings = [
  // Primary (Oranges)
  { hex: '#FF6B00', token: 'primary' },
  { hex: '#E85D00', token: 'primary' },
  { hex: '#FF8A3D', token: 'primary' },
  { hex: '#EA580C', token: 'primary' },
  { hex: '#E65C00', token: 'primary' },
  { hex: '#FF7A00', token: 'primary' },
  { hex: '#CC5200', token: 'primary' },
  { hex: '#FF8A33', token: 'primary' },

  // Background/Accent Oranges
  { hex: '#FFF7ED', token: 'accent' },
  { hex: '#FFEDD5', token: 'accent' },
  { hex: '#FFE4CC', token: 'accent' },
  { hex: '#FFF0E5', token: 'accent' },
  { hex: '#FFD8B3', token: 'accent' },
  { hex: '#FFF4EB', token: 'accent' },

  // Reds (Destructive)
  { hex: '#EF4444', token: 'destructive' },
  { hex: '#B91C1C', token: 'destructive' },
  { hex: '#991B1B', token: 'destructive' },
  
  // Greens (Success)
  { hex: '#10B981', token: 'success' },
  { hex: '#059669', token: 'success' },
  { hex: '#16A34A', token: 'success' },
  { hex: '#22C55E', token: 'success' },
  { hex: '#ECFDF5', token: 'accent' }, 

  // Yellows/Ambers (Warning)
  { hex: '#F59E0B', token: 'warning' },

  // Blues (Info)
  { hex: '#0C6CEA', token: 'info' },
  { hex: '#3B82F6', token: 'info' },
  { hex: '#2563EB', token: 'info' },
  { hex: '#0055CC', token: 'info' },
  { hex: '#1D4ED8', token: 'info' },
  { hex: '#60A5FA', token: 'info' },
  { hex: '#0EA5E9', token: 'info' },
  { hex: '#0284C7', token: 'info' },
  { hex: '#F3F7FC', token: 'accent' }, 

  // Dark Grays / Blacks (Foreground / Card-Foreground)
  { hex: '#111827', token: 'foreground' },
  { hex: '#0F172A', token: 'foreground' },
  { hex: '#1F2937', token: 'foreground' },
  { hex: '#1A2238', token: 'card' },
  { hex: '#1E293B', token: 'muted-foreground' },
  { hex: '#374151', token: 'muted-foreground' },
  { hex: '#4B5563', token: 'muted-foreground' },
  { hex: '#6B7280', token: 'muted-foreground' },
  { hex: '#64748B', token: 'muted-foreground' },

  // Light Grays (Muted / Border)
  { hex: '#E5E7EB', token: 'border' },
  { hex: '#F3F4F6', token: 'muted' },
  { hex: '#F8FAFC', token: 'muted' },
  { hex: '#CBD5E1', token: 'border' },
  { hex: '#9CA3AF', token: 'muted-foreground' },
  { hex: '#94A3B8', token: 'muted-foreground' },
  { hex: '#D1D5DB', token: 'border' },
  { hex: '#F9FAFB', token: 'muted' },
  { hex: '#FAFAFA', token: 'muted' },
  { hex: '#F1F5F9', token: 'muted' },
  { hex: '#E2E8F0', token: 'border' },
  { hex: '#F8F9FA', token: 'muted' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  const prefixes = [
    'text', 'bg', 'border', 'border-t', 'border-b', 'border-l', 'border-r',
    'fill', 'stroke', 'ring', 'ring-offset', 'shadow', 'divide',
    'hover:bg', 'hover:text', 'hover:border', 'hover:fill', 'hover:stroke',
    'focus:ring', 'focus:border', 'focus:text', 'focus:bg', 'active:bg', 'group-hover:text',
    'from', 'via', 'to'
  ];

  for (const { hex, token } of mappings) {
    for (const prefix of prefixes) {
      // Regex to match prefix-[hex] exactly, case insensitive for hex
      const escapeHex = hex.replace('#', '');
      const regexStr = `${prefix}-\\[#${escapeHex}\\]`;
      const regex = new RegExp(regexStr, 'gi');
      
      if (regex.test(content)) {
        content = content.replace(regex, `${prefix}-${token}`);
        updated = true;
      }
    }
    
    // Catch arbitrary inline styles like color: '#FF6B00'
    const hexRegexStr = `'${hex}'|"${hex}"`;
    const hexRegex = new RegExp(hexRegexStr, 'gi');
    if (hexRegex.test(content)) {
      content = content.replace(hexRegex, `'var(--${token})'`);
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(filePath, content);
  }
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fullPath.includes('node_modules') || fullPath.includes('dist')) continue;
    
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      if (fullPath.includes('brand.ts')) continue; // Already updated manually
      processFile(fullPath);
    }
  }
}

console.log('Starting mass refactor...');
scanDir(path.join(__dirname, 'src'));
console.log('Refactor complete!');
