export interface CategoryItemDiscount {
 _id: string;
 name: string;
 discountType: string;
 value: {
 amount: number;
 currency: string;
 getDiscountPercent: number;
 tiers: any[];
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
 itemTimings: any[];
 name: string;
 sellingPrice: number;
 type: string;
 variations: any[];
 tag: string[];
 trackInventory: boolean;
 stockCount?: number;
 discount?: CategoryItemDiscount | null;
 price?: number;
 isAvailable?: boolean;
 bestseller?: boolean;
 rating?: number;
 image?: any;
}

export interface Category {
 _id: string;
 categoryTimings: any[];
 imageUrl: string;
 name: string;
 items: CategoryItem[];
 iconImage?: string;
 image?: any;
}
