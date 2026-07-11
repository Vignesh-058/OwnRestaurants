import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';

export const ProtectedRoute = () => {
 const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
 const location = useLocation();

 if (!isAuthenticated) {
 console.warn("[PROTECTED ROUTE] Not authenticated, redirecting to /login", { location: location.pathname });
 // Redirect them to the /login page, but save the current location they were trying to go to
 return <Navigate to="/login" state={{ from: location }} replace />;
 }

 console.log("[PROTECTED ROUTE] Authenticated, rendering Outlet", { location: location.pathname });
 return <Outlet />;
};
