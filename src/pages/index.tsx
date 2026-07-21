import { lazy } from 'react';



export const ProductPage = lazy(() => import('./ProductPage').then(m => ({ default: m.ProductPage })));
export const CheckoutPage = lazy(() => import('./CheckoutPage').then(m => ({ default: m.CheckoutPage })));

// Lazy-loaded pages
export const LoginPage = lazy(() => import('./LoginPage').then(m => ({ default: m.LoginPage })));
export const LandingPage = lazy(() => import('./LandingPage').then(m => ({ default: m.LandingPage })));
export const CartPage = lazy(() => import('./CartPage').then(m => ({ default: m.CartPage })));
export const AddressPage = lazy(() => import('./AddressPage').then(m => ({ default: m.AddressPage })));
export const ProductsPage = lazy(() => import('./ProductsPage').then(m => ({ default: m.ProductsPage })));
export const OrdersPage = lazy(() => import('./OrdersPage').then(m => ({ default: m.OrdersPage })));
export const ProfilePage = lazy(() => import('./ProfilePage').then(m => ({ default: m.ProfilePage })));
export const CouponsPage = lazy(() => import('./CouponsPage').then(m => ({ default: m.CouponsPage })));
export const RewardsPage = lazy(() => import('./RewardsPage').then(m => ({ default: m.RewardsPage })));
export const SettingsPage = lazy(() => import('./SettingsPage').then(m => ({ default: m.SettingsPage })));
export const PreBookPage = lazy(() => import('./PreBookPage').then(m => ({ default: m.PreBookPage })));
export const DineInPage = lazy(() => import('./DineInPage').then(m => ({ default: m.DineInPage })));
export const SearchPage = lazy(() => import('./SearchPage').then(m => ({ default: m.SearchPage })));
export const OrderSuccessPage = lazy(() => import('./OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));
export const OrderDetailsPage = lazy(() => import('./OrderDetailsPage').then(m => ({ default: m.default })));
