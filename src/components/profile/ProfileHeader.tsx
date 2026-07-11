import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, CalendarDays, Edit3, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CustomerProfile } from '@/types/customer.types';

interface ProfileHeaderProps {
 profile: CustomerProfile | null;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
 const joinDate = profile?.createdAt 
 ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
 : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

 // Calculate membership tier dynamically
 const ordersCount = profile?.ordersCount || 0;
 const { tier, badgeColor, gradient } = (() => {
 if (ordersCount > 15) {
 return { 
 tier: 'Platinum Member', 
 badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/35', 
 gradient: 'from-indigo-500 via-purple-500 to-pink-500' 
 };
 }
 if (ordersCount > 5) {
 return { 
 tier: 'Gold Member', 
 badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/35', 
 gradient: 'from-amber-400 via-orange-500 to-yellow-600' 
 };
 }
 return { 
 tier: 'Silver Member', 
 badgeColor: 'bg-slate-400/20 text-slate-400 border-slate-400/35', 
 gradient: 'from-slate-400 via-zinc-500 to-slate-600' 
 };
 })();

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 >
 <Card className="rounded-[2rem] border border-border/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.25)] overflow-hidden relative">
 {/* Dynamic header background gradient */}
 <div className={`absolute top-0 left-0 w-full h-36 bg-gradient-to-r ${gradient} opacity-15 dark:opacity-25 pointer-events-none`} />
 
 <CardContent className="pt-20 pb-8 px-6 sm:px-10 relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
 <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
 
 {/* Large circular avatar with badge overlay */}
 <div className="relative group">
 <Avatar className="h-28 w-28 border-4 border-background shadow-xl ring-4 ring-primary/10 bg-background group-hover:scale-105 transition-transform duration-300">
 <AvatarImage src={profile?.avatar} alt={profile?.name || 'User'} className="object-cover" />
 <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-black text-4xl">
 {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
 </AvatarFallback>
 </Avatar>
 <div className="absolute -bottom-2 -right-2 bg-background border border-border/60 p-2 rounded-full shadow-md">
 <Award className="h-4.5 w-4.5 text-primary" />
 </div>
 </div>

 {/* User credentials & membership information */}
 <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3.5">
 <div className="space-y-1">
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
 <h1 className="text-[28px] font-bold tracking-tight text-foreground">
 {profile?.name || 'Guest Customer'}
 </h1>
 <Badge variant="outline" className={`font-black rounded-full px-3.5 py-0.5 text-[10px] tracking-widest uppercase border ${badgeColor}`}>
 {tier}
 </Badge>
 </div>

 <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground justify-center sm:justify-start">
 <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
 <span>Member since {joinDate}</span>
 </div>
 </div>
 
 {/* Phone & Email contacts */}
 <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-start gap-3 sm:gap-6 text-sm font-semibold text-muted-foreground">
 <div className="flex items-center gap-2">
 <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
 <Phone className="w-3.5 h-3.5 text-primary" />
 </div>
 <span>+91 {profile?.phone || 'Not provided'}</span>
 </div>
 {profile?.email && (
 <div className="flex items-center gap-2">
 <div className="h-7 w-7 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
 <Mail className="w-3.5 h-3.5 text-blue-500" />
 </div>
 <span>{profile.email}</span>
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Edit Profile Button */}
 <Button 
 variant="outline" 
 size="sm" 
 className="rounded-full px-5 h-10 border-border dark:border-white/10 hover:bg-muted font-bold text-xs gap-1.5 shadow-sm shrink-0"
 >
 <Edit3 className="h-3.5 w-3.5" />
 Edit Profile
 </Button>

 </CardContent>
 </Card>
 </motion.div>
 );
};
