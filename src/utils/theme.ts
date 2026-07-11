export const applyOrganizationTheme = (themeConfig?: {
 primaryColor?: string;
 secondaryColor?: string;
 backgroundColor?: string;
}) => {
 const root = document.documentElement;

 if (themeConfig?.primaryColor) {
 root.style.setProperty('--primary', themeConfig.primaryColor);
 // Setting foreground for primary for contrast, assuming white for dark primary colors
 root.style.setProperty('--primary-foreground', '#ffffff'); 
 }

 if (themeConfig?.secondaryColor) {
 root.style.setProperty('--secondary', themeConfig.secondaryColor);
 root.style.setProperty('--secondary-foreground', '#ffffff');
 }

 if (themeConfig?.backgroundColor) {
 root.style.setProperty('--background', themeConfig.backgroundColor);
 }
};
