/**
 * ============================================================
 * GLOBAL BRAND COLOR SYSTEM — OwnRestaurants
 * ============================================================
 * PRIMARY BRAND COLOR: ORANGE (#FF6B00)
 * BLUE IS PERMANENTLY BANNED FROM THIS PROJECT.
 * Any new component, feature, or UI element MUST use these tokens.
 * ============================================================
 */

export const BRAND = {
  // === PRIMARY (ORANGE ONLY) ===
  primary: '#FF6B00',
  primaryHover: '#E85D00',
  primaryDark: '#CC5200',
  primaryLight: '#FFF4EB',
  primarySubtle: 'rgba(255, 107, 0, 0.1)',

  // === SEMANTIC COLORS ===
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',

  // === NEUTRALS ===
  navbar: '#111827',
  darkCard: '#1A2238',
  background: '#F8FAFC',
  white: '#FFFFFF',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
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
} as const;

// ❌ FORBIDDEN COLORS — DO NOT USE ANYWHERE
// #2563EB, #3B82F6, #1D4ED8, #60A5FA, #0EA5E9, #0284C7
// blue-*, sky-*, indigo-* (except purple variants for decoration)
// These are permanently replaced by the orange brand system above.
