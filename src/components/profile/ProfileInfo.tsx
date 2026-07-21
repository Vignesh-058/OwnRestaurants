import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import { EditProfileDialog } from './EditProfileDialog';
import type { CustomerProfile } from '@/types/customer.types';

interface ProfileInfoProps {
  profile: CustomerProfile | null;
}

export const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const joinDate = profile?.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <Card className="rounded-3xl border-border/50 shadow-sm bg-card overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4 border-b border-border/50 px-6 sm:px-8 pt-8 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[28px] font-bold text-foreground">Profile Details</CardTitle>
            <p className="text-sm font-medium text-muted-foreground mt-1">Your personal information</p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-xl border-[#FFE2CC] text-[#FF6B00] hover:bg-[#FFF4EB] hover:text-[#FF7A1A] h-10 px-4 font-semibold shadow-sm transition-all"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <dl className="divide-y divide-border/50">
            <div className="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8 hover:bg-muted/20 transition-colors">
              <dt className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center">Full Name</dt>
              <dd className="mt-1 text-[18px] font-semibold text-foreground sm:mt-0 sm:col-span-2">
                {profile?.name || 'Guest User'}
              </dd>
            </div>
            
            <div className="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8 hover:bg-muted/20 transition-colors">
              <dt className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center">Phone Number</dt>
              <dd className="mt-1 text-[18px] font-semibold text-foreground sm:mt-0 sm:col-span-2">
                +91 {profile?.phone || 'Not provided'}
              </dd>
            </div>
            
            {profile?.email && (
              <div className="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8 hover:bg-muted/20 transition-colors">
                <dt className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center">Email Address</dt>
                <dd className="mt-1 text-[18px] font-semibold text-foreground sm:mt-0 sm:col-span-2">
                  {profile.email}
                </dd>
              </div>
            )}
            
            <div className="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8 hover:bg-muted/20 transition-colors">
              <dt className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center">Customer Type</dt>
              <dd className="mt-1 text-[18px] font-semibold text-foreground sm:mt-0 sm:col-span-2">
                {profile?.ordersCount && profile.ordersCount > 10 ? 'Loyal Customer' : 'Customer'}
              </dd>
            </div>
            
            <div className="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8 hover:bg-muted/20 transition-colors">
              <dt className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center">Member Since</dt>
              <dd className="mt-1 text-[18px] font-semibold text-foreground sm:mt-0 sm:col-span-2">
                {joinDate}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <EditProfileDialog open={isEditOpen} onOpenChange={setIsEditOpen} />
    </>
  );
};
