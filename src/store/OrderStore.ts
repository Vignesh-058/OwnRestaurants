import { create } from 'zustand';
import type { Order, OrderStatus, PaymentMode, OrderType } from '@/types/order.types';

export type OrderFilterStatus = 'All' | OrderStatus;
export type OrderFilterPayment = 'All' | PaymentMode;
export type OrderFilterType = 'All' | OrderType;

export interface OrderFilters {
 status: OrderFilterStatus;
 payment: OrderFilterPayment;
 orderType: OrderFilterType;
}

interface OrderState {
 selectedOrder: Order | null;
 filters: OrderFilters;
 currentPage: number;
 pageSize: number;
 searchQuery: string;

 setSelectedOrder: (order: Order | null) => void;
 setFilters: (filters: Partial<OrderFilters>) => void;
 setCurrentPage: (page: number) => void;
 setSearchQuery: (query: string) => void;
 resetFilters: () => void;
}

const defaultFilters: OrderFilters = {
 status: 'All',
 payment: 'All',
 orderType: 'All',
};

export const useOrderStore = create<OrderState>((set) => ({
 selectedOrder: null,
 filters: defaultFilters,
 currentPage: 1,
 pageSize: 20,
 searchQuery: '',

 setSelectedOrder: (order) => set({ selectedOrder: order }),
 setFilters: (partial) =>
 set((state) => ({ filters: { ...state.filters, ...partial }, currentPage: 1 })),
 setCurrentPage: (page) => set({ currentPage: page }),
 setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
 resetFilters: () => set({ filters: defaultFilters, searchQuery: '', currentPage: 1 }),
}));
