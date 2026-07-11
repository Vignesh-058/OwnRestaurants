import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { PageLoader } from '@/components/common/PageLoader';
import {
 LoginPage,
 LandingPage,
 ProductPage,
 CartPage,
 AddressPage,
 CheckoutPage,
 OrdersPage,
 ProfilePage,
 CouponsPage,
 SearchPage,
 WishlistPage,
} from '@/pages';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const router = createBrowserRouter([
 { path: '/login', element: <LoginPage /> },
 {
 path: '/',
 element: <MainLayout />,
 children: [
 { index: true, element: <LandingPage /> },
 { path: 'search', element: <SearchPage /> },
 { path: 'wishlist', element: <WishlistPage /> },
 { path: 'product/:id', element: <ProductPage /> },
 { path: 'cart', element: <CartPage /> },
 {
 element: <ProtectedRoute />,
 children: [
 { path: 'address', element: <AddressPage /> },
 { path: 'checkout', element: <CheckoutPage /> },
 { path: 'orders', element: <OrdersPage /> },
 { path: 'profile', element: <ProfilePage /> },
 { path: 'profile/orders', element: <OrdersPage /> },
 { path: 'profile/addresses', element: <AddressPage /> },
 { path: 'profile/settings', element: <ProfilePage /> },
 { path: 'profile/favorites', element: <ProfilePage /> },
 { path: 'coupons', element: <CouponsPage /> },
 { path: 'offers', element: <CouponsPage /> },
 { path: 'profile/coupons', element: <CouponsPage /> },
 ]
 }
 ],
 },
]);

export function AppRouter() {
 return (
 <Suspense fallback={<PageLoader />}>
 <RouterProvider router={router} />
 </Suspense>
 );
}
