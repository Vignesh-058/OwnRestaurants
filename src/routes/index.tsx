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
 RewardsPage,
 SettingsPage,
 DineInPage,
 SearchPage,
 ProductsPage,
 OrderSuccessPage,
 OrderDetailsPage,
 PreBookPage,
} from '@/pages';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const router = createBrowserRouter([
 { path: '/login', element: <LoginPage /> },
 {
   path: '/',
   element: <MainLayout />,
   children: [
     { index: true, element: <LandingPage /> },
     {
       element: <ProtectedRoute />,
       children: [
         { path: 'products', element: <ProductsPage /> },
         { path: 'pre-book-page', element: <PreBookPage /> },
         { path: 'search', element: <SearchPage /> },
         { path: 'dine-in', element: <DineInPage /> },
         { path: 'product/:id', element: <ProductPage /> },
         { path: 'cart', element: <CartPage /> },
         { path: 'address', element: <AddressPage /> },
         { path: 'checkout', element: <CheckoutPage /> },
         { path: 'order-success/:orderId', element: <OrderSuccessPage /> },
         { path: 'orders', element: <OrdersPage /> },
         { path: 'orders/:orderId', element: <OrderDetailsPage /> },
         { path: 'profile', element: <ProfilePage /> },
         { path: 'profile/orders', element: <OrdersPage /> },
         { path: 'profile/addresses', element: <AddressPage /> },
         { path: 'profile/settings', element: <SettingsPage /> },
         { path: 'profile/favorites', element: <ProfilePage /> },
         { path: 'profile/rewards', element: <RewardsPage /> },
         { path: 'coupons', element: <CouponsPage /> },
         { path: 'offers', element: <CouponsPage /> },
         { path: 'profile/coupons', element: <CouponsPage /> },
       ],
     }
   ]
 }
]);

export function AppRouter() {
 return (
 <Suspense fallback={<PageLoader />}>
 <RouterProvider router={router} />
 </Suspense>
 );
}
