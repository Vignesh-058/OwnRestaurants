/**
 * ============================================================
 * GLOBAL BRAND COLOR SYSTEM — OwnRestaurants
 * ============================================================
 * PRIMARY BRAND COLOR: ORANGE
 * All values now map directly to centralized CSS variables defined in colors.css.
 * ============================================================
 */

export const BRAND = {
  // === PRIMARY (ORANGE ONLY) ===
  primary: 'var(--primary)',
  primaryHover: 'var(--primary)', // Hover states handled by opacity classes in Tailwind
  primaryDark: 'var(--primary)',
  primaryLight: 'var(--accent)',
  primarySubtle: 'var(--primary)',

  // === SEMANTIC COLORS ===
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--destructive)',
  info: 'var(--info)',

  // === NEUTRALS ===
  navbar: 'var(--foreground)',
  darkCard: 'var(--card)',
  background: 'var(--background)',
  white: '#FFFFFF',
  border: 'var(--border)',
  textPrimary: 'var(--foreground)',
  textSecondary: 'var(--muted-foreground)',
  textMuted: 'var(--muted-foreground)',
} as const;

/** CSS variable equivalents for inline styles */
export const CSS_VARS = {
  primary: 'var(--primary)',
  ring: 'var(--ring)',
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  border: 'var(--border)',
  muted: 'var(--muted)',
  mutedForeground: 'var(--muted-foreground)',
  accent: 'var(--accent)',
  secondary: 'var(--secondary)',
  info: 'var(--info)',
} as const;
