import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileMenu } from '@/components/profile/ProfileMenu';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { AddressPreview } from '@/components/profile/AddressPreview';
import { RecentOrders } from '@/components/profile/RecentOrders';
import { ProfileLoyalty } from '@/components/profile/ProfileLoyalty';

export const ProfilePage = () => {
 const navigate = useNavigate();
 const { isAuthenticated, user } = useAuthStore();

 useEffect(() => {
 window.scrollTo(0, 0);
 }, []);

 if (!isAuthenticated) {
 navigate('/login', { replace: true });
 return null;
 }



 return (
 <div className="bg-background min-h-screen py-10">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
 <div className="flex flex-col lg:flex-row gap-8">
 {/* Left Sidebar (Desktop Menu) */}
 <div className="hidden lg:block w-[320px] shrink-0 sticky top-28 h-fit space-y-6">
 <div className="px-2 mb-2">
 <h2 className="text-[28px] font-bold text-foreground tracking-tight">My Account</h2>
 </div>
 <ProfileMenu />
 </div>

 {/* Main Content Area */}
 <div className="flex-1 min-w-0 flex flex-col space-y-8">
 <ProfileHeader profile={user || null} />
 
 <ProfileStats profile={user || null} />

 <ProfileLoyalty profile={user || null} />
 
 <div className="lg:hidden">
 <h2 className="text-xl font-black text-foreground mb-4 px-2">Account Menu</h2>
 <ProfileMenu />
 </div>

 <ProfileInfo profile={user || null} />
 
 <RecentOrders />
 
 <AddressPreview />
 
 </div>
 </div>

 </div>
 </div>
 );
};
