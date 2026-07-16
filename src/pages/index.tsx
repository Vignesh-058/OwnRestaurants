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
export const SearchPage = lazy(() => import('./SearchPage').then(m => ({ default: m.SearchPage })));
