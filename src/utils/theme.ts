import type { ThemeColors } from '@/types/organization.types';

export const applyOrganizationTheme = (themeConfig?: ThemeColors) => {
  const root = document.documentElement;
  if (!themeConfig) return;

  if (themeConfig.primaryColor) {
    // We ignore the backend primary color to enforce the preferred #FF6B00 brand color
    // root.style.setProperty('--primary', themeConfig.primaryColor);
    // root.style.setProperty('--ring', themeConfig.primaryColor);
  }

  if (themeConfig.secondaryColor) {
    root.style.setProperty('--secondary', themeConfig.secondaryColor);
  }

  if (themeConfig.backgroundColor) {
    // We ignore the backend background color to enforce the preferred #FFF8F3 background.
    // root.style.setProperty('--background', themeConfig.backgroundColor);
  }
  
  if (themeConfig.textColor) {
    // We ignore backend textColor to preserve high-contrast dark text readability
    // root.style.setProperty('--foreground', themeConfig.textColor);
  }
  
  if (themeConfig.borderColor) {
    root.style.setProperty('--border', themeConfig.borderColor);
  }

  if (themeConfig.headerBackgroundColor) {
    root.style.setProperty('--header-bg', themeConfig.headerBackgroundColor);
  }

  if (themeConfig.footerBackgroundColor) {
    root.style.setProperty('--footer-bg', themeConfig.footerBackgroundColor);
  }

  if (themeConfig.fontFamily) {
    root.style.setProperty('--font-sans', themeConfig.fontFamily);
  }

  if (themeConfig.fontSize) {
    // We preserve the default 16px root font size for proper UI scale
    // document.documentElement.style.fontSize = themeConfig.fontSize;
  }

  if (themeConfig.buttonRadius) {
    root.style.setProperty('--radius', themeConfig.buttonRadius);
  }

  if (themeConfig.cardRadius) {
    root.style.setProperty('--card-radius', themeConfig.cardRadius);
  }
};
