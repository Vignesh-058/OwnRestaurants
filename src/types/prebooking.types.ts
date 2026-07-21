export interface ActivePreBookingCampaign {
  preBookingId: string;
  preBookingName: string;
  description: string | null;
  image: string;
  allowedOrderTypes: string[];
  availableDates: string[]; // "YYYY-MM-DD"
  unAvailableDates: string[]; // "YYYY-MM-DD"
  timeSlots: string[]; // "HH:MM:SS"
  slotCount: number[];
}

export interface GetActivePreBookingPayload {
  belongsTo: string;
  outletId: string;
}

export interface GetActivePreBookingResponse {
  success: boolean;
  count: number;
  data: ActivePreBookingCampaign[];
}
