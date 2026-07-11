import { lazy } from 'react';

// Placeholders (can remain normal or we can just leave them as is, but let's make them lazy-compatible by providing default exports if we actually use them, or just export them as named exports without lazy if they are just placeholders)
export const IndexPage = () => <div>Index Page Placeholder</div>;
export const ProductPage = () => <div>Product Page Placeholder</div>;
export const CheckoutPage = () => <div>Checkout Page Placeholder</div>;

// Lazy-loaded pages
export const LoginPage = lazy(() => import('./LoginPage').then(m => ({ default: m.LoginPage })));
export const LandingPage = lazy(() => import('./LandingPage').then(m => ({ default: m.LandingPage })));
export const CartPage = lazy(() => import('./CartPage').then(m => ({ default: m.CartPage })));
export const AddressPage = lazy(() => import('./AddressPage').then(m => ({ default: m.AddressPage })));
export const OrdersPage = lazy(() => import('./OrdersPage').then(m => ({ default: m.OrdersPage })));
export const ProfilePage = lazy(() => import('./ProfilePage').then(m => ({ default: m.ProfilePage })));
export const CouponsPage = lazy(() => import('./CouponsPage').then(m => ({ default: m.CouponsPage })));
export const SearchPage = lazy(() => import('./SearchPage').then(m => ({ default: m.SearchPage })));
export const WishlistPage = lazy(() => import('./WishlistPage').then(m => ({ default: m.WishlistPage })));
