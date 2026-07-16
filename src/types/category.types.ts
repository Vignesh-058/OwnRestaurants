export interface CategoryItemVariation {
  variationid: string;
  variation_name: string;
  price?: number;
  addonitem_price?: number;
}

export interface CategoryItemAddonItem {
  addonitemid: string;
  addonitem_name: string;
  price: number;
  addonitem_price?: number;
  dietary_type?: string;
  instock?: boolean;
  status?: boolean;
}

export interface CategoryItemAddonGroup {
  addongroupid: string;
  addongroup_name: string;
  min: number;
  max: number;
  items: CategoryItemAddonItem[];
}

export interface CategoryItemDiscount {
  _id: string;
  name: string;
  discountType: string;
  value: {
    amount: number;
    currency: string;
    getDiscountPercent: number;
    tiers: unknown[];
  };
  applicationType: string;
}

export interface CategoryItem {
  _id: string;
  active: boolean;
  allowAddon: boolean;
  allowVariation: boolean;
  basePrice: number;
  category: string;
  defaultBasePrice: number;
  defaultSellingPrice: number;
  description: string;
  dietryType: 'veg' | 'non-veg' | 'vegan' | string;
  imageUrl: string[];
  inStock: boolean;
  itemTimings: unknown[];
  name: string;
  sellingPrice: number;
  type: string;
  variations: CategoryItemVariation[];
  addons?: CategoryItemAddonGroup[];
  tag: string[];
  trackInventory: boolean;
  stockCount?: number;
  discount?: CategoryItemDiscount | null;
  price?: number;
  isAvailable?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  rating?: number;
  image?: { webView?: string } | string | null;
  variationid?: string;
  product_retailer_id?: string;
}

export interface Category {
  _id: string;
  categoryTimings: string[];
  imageUrl: string;
  name: string;
  items: CategoryItem[];
  iconImage?: string;
  image?: { webView?: string } | string | null;
}
