export interface AddonItem {
 addonitemid: string;
 addonitem_name: string;
 addonitem_price: number;
 dietryType: string;
}

export interface AddonGroup {
 addongroupid: string;
 addongroup_name: string;
 min: number;
 max: number;
 items: AddonItem[];
}

export interface Variation {
 variationid: string;
 variation_name: string;
 price: number;
 sellingPrice?: number;
 basePrice?: number;
}

export interface ItemDetail {
 itemid: string;
 itemname: string;
 variationid: string | null;
 dietryType: string;
 basePrice: number;
 sellingPrice: number;
 image: string[];
 variations: Variation[];
 addons: AddonGroup[];
 belongsTo: string;
 stockStatus: boolean;
 trackInventory: boolean;
 stockCount?: number;
 rating?: number;
 inStock?: boolean;
}
