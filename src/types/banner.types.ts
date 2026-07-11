export interface BannerImage {
 mobileView: string;
 webView: string;
}

export interface Banner {
 _id: string;
 belongsTo: string;
 outletId: string;
 type: string;
 category: string[];
 item: string[];
 active: boolean;
 image: BannerImage;
 rank: number;
}
