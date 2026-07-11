import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPInput } from '@/components/auth/OTPInput';
import { ResendOTP } from '@/components/auth/ResendOTP';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/hooks/auth/useLogin';
import { useVerifyOTP } from '@/hooks/auth/useVerifyOTP';
import { ArrowLeft, Loader2, Store } from 'lucide-react';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useLocationStore } from '@/store/LocationStore';
import { useLocationModalStore } from '@/store/LocationModalStore';
import { toast } from 'sonner';

export const LoginPage = () => {
 const navigate = useNavigate();
 const location = useLocation();
 const organization = useOrganizationStore(state => state.organization);
 
 const [step, setStep] = useState<1 | 2>(1);
 const [phone, setPhone] = useState('');
 const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

 const { mutate: sendOtp, isPending: isSendingOtp } = useLogin();
 const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOTP();

 // Redirect to where they came from or home
 const from = location.state?.from?.pathname || '/';

 const handleSendOTP = () => {
 if (phone.length !== 10) return;
 
 sendOtp(phone, {
 onSuccess: () => {
 setStep(2);
 }
 });
 };

 const handleVerifyOTP = () => {
 const otpString = otp.join('');
 if (otpString.length !== 6) return;

 verifyOtp(
 { phone, otp: otpString },
 {
 onSuccess: (data: any) => {
 const rawToken = data?.accessToken || data?.data?.accessToken || data?.token || data?.data?.token;
 let extractedToken = '';
 if (typeof rawToken === 'string') {
 extractedToken = rawToken;
 } else if (rawToken && typeof rawToken === 'object') {
 extractedToken = rawToken.token || rawToken.accessToken || rawToken.value || '';
 }
 if (extractedToken) {
 // Immediately request GPS permission
 if (navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(
 (position) => {
 const { latitude, longitude } = position.coords;
 const address = `GPS Location (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`;
 useLocationStore.getState().setLocation(latitude, longitude, address);
 toast.success("Location set via GPS successfully!");
 navigate(from, { replace: true });
 },
 (error) => {
 console.warn("[LOGIN LOCATION] GPS permission denied/failed:", error);
 // Denied or error -> navigate to destination and trigger manual location modal selector
 navigate(from, { replace: true });
 setTimeout(() => {
 useLocationModalStore.getState().openModal();
 }, 200);
 },
 { enableHighAccuracy: true, timeout: 5000 }
 );
 } else {
 navigate(from, { replace: true });
 setTimeout(() => {
 useLocationModalStore.getState().openModal();
 }, 200);
 }
 }
 }
 }
 );
 };

 return (
 <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
 {/* Decorative background elements */}
 <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
 <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />

 <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden relative z-10">
 
 {/* Header area with Logo */}
 <div className="px-8 pt-10 pb-6 flex flex-col items-center border-b border-border/50">
 {organization?.logo ? (
 <img src={organization.logo} alt={organization.brandName} className="h-16 w-16 object-contain mb-4 drop-shadow-sm" />
 ) : (
 <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-4">
 <Store className="h-8 w-8 text-primary-foreground" />
 </div>
 )}
 <h1 className="text-2xl font-black text-foreground text-center">
 {step === 1 ? 'Welcome Back' : 'Verify Your Number'}
 </h1>
 <p className="text-muted-foreground text-center mt-2 font-medium">
 {step === 1 
 ? 'Enter your mobile number to securely sign in or create an account.'
 : `We've sent a 6-digit code to +91 ${phone}`
 }
 </p>
 </div>

 {/* Content area */}
 <div className="p-8">
 {step === 1 ? (
 <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
 <PhoneInput 
 phone={phone} 
 onChange={setPhone} 
 disabled={isSendingOtp}
 />
 <Button 
 className="w-full h-14 rounded-2xl text-lg font-bold shadow-premium hover:shadow-premium-hover transition-all"
 disabled={phone.length !== 10 || isSendingOtp}
 onClick={handleSendOTP}
 >
 {isSendingOtp ? (
 <Loader2 className="w-6 h-6 animate-spin" />
 ) : (
 'Continue'
 )}
 </Button>
 </div>
 ) : (
 <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
 <OTPInput 
 otp={otp} 
 onChange={setOtp} 
 onSubmit={handleVerifyOTP}
 disabled={isVerifyingOtp}
 />
 
 <Button 
 className="w-full h-14 rounded-2xl text-lg font-bold shadow-premium hover:shadow-premium-hover transition-all"
 disabled={otp.some(d => d === '') || isVerifyingOtp}
 onClick={handleVerifyOTP}
 >
 {isVerifyingOtp ? (
 <Loader2 className="w-6 h-6 animate-spin" />
 ) : (
 'Verify Code'
 )}
 </Button>

 <ResendOTP 
 onResend={handleSendOTP}
 isSending={isSendingOtp}
 />

 <Button 
 variant="ghost" 
 className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 font-semibold"
 onClick={() => {
 setStep(1);
 setOtp(['', '', '', '', '', '']);
 }}
 disabled={isVerifyingOtp}
 >
 <ArrowLeft className="w-4 h-4 mr-2" />
 Change mobile number
 </Button>
 </div>
 )}
 </div>
 </div>
 
 {/* Return Home Button */}
 <Button 
 variant="ghost"
 className="absolute top-6 left-6 rounded-full hover:bg-white/50 dark:hover:bg-black/50 backdrop-blur-md transition-all font-semibold"
 onClick={() => navigate('/')}
 >
 <ArrowLeft className="w-4 h-4 mr-2" />
 Back to Home
 </Button>
 </div>
 );
};
