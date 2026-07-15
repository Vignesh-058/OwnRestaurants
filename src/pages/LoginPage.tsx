import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OTPInput } from '@/components/auth/OTPInput';
import { ResendOTP } from '@/components/auth/ResendOTP';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/hooks/auth/useLogin';
import { useVerifyOTP } from '@/hooks/auth/useVerifyOTP';
import { ArrowLeft, ArrowRight, Loader2, ShoppingBag, Coffee, UtensilsCrossed } from 'lucide-react';
import { useLocationStore } from '@/store/LocationStore';
import { useLocationModalStore } from '@/store/LocationModalStore';
import { useAuthStore } from '@/store/AuthStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { motion, AnimatePresence } from 'framer-motion';
import defaultLogo from '@/assets/Ieyal Logo.jpeg';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

  const { mutate: sendOtp, isPending: isSendingOtp } = useLogin();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOTP();
  const organization = useOrganizationStore(state => state.organization);
  const loginConfig = organization?.theme?.config?.login;

  // Redirect to where they came from or home
  const from = location.state?.from?.pathname || '/';

  // If already authenticated, redirect to Home
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSendOTP = () => {
    if (phone.length < 7) return;
    const fullPhone = `${countryCode.replace('+', '')}${phone}`;
    
    sendOtp(fullPhone, {
      onSuccess: () => {
        setStep(2);
      }
    });
  };

  const handleVerifyOTP = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) return;
    const fullPhone = `${countryCode.replace('+', '')}${phone}`;

    verifyOtp(
      { phone: fullPhone, otp: otpString },
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
            // Let the global LocationPermissionModal handle the location request securely
            navigate(from, { replace: true });
          }
        }
      }
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-[#FAFAFA] dark:bg-slate-950 font-sans selection:bg-primary/20">
      
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {loginConfig?.background ? (
          <img src={loginConfig.background} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        ) : null}
        {/* Soft radial gradients */}
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-orange-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute top-[10%] left-[5%] text-orange-500/[0.03] dark:text-orange-500/[0.02] rotate-[-15deg]">
          <UtensilsCrossed className="w-16 h-16" strokeWidth={1.5} />
        </div>
        <div className="absolute bottom-[15%] right-[8%] text-primary/[0.03] dark:text-primary/[0.02] rotate-[20deg]">
          <ShoppingBag className="w-24 h-24" strokeWidth={1.5} />
        </div>
        <div className="absolute top-[30%] right-[5%] text-yellow-500/[0.03] dark:text-yellow-500/[0.02] rotate-[45deg]">
          <Coffee className="w-14 h-14" strokeWidth={1.5} />
        </div>
      </div>

      {/* Main Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
        className="w-full max-w-[460px] bg-[#111827] rounded-[24px] shadow-2xl border border-[rgba(255,255,255,0.08)] relative z-10"
      >
        
        <div className="p-10">
          
          {/* Header Branding */}
          <div className="flex flex-col items-center text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="relative mb-6"
            >
              {/* Soft Glow Behind Logo */}
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-3xl p-4 shadow-xl border border-white/20 transform rotate-[-2deg] hover:rotate-0 transition-all duration-300">
                <img 
                  src={organization?.logoImage || defaultLogo} 
                  alt={organization?.brandName || "IEYAL Solutions"} 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </motion.div>
            
            <h1 className="text-[36px] font-bold text-white tracking-tight mb-4">
              {step === 1 ? 'Welcome Back' : 'Verify Your Phone'}
            </h1>
            <div className="text-[18px] text-[#94A3B8] font-medium leading-relaxed max-w-sm">
              {step === 1 ? (
                <p>Sign in with your mobile number to continue.</p>
              ) : (
                <p>
                  Enter the 6-digit verification code sent to your mobile number. <br/>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                    {countryCode} {phone.replace(/(\d{5})(\d{5})/, '$1 $2')}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Form Area */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendOTP();
                  }}
                >
                  <PhoneInput 
                    phone={phone} 
                    onChange={setPhone} 
                    countryCode={countryCode}
                    onCountryCodeChange={setCountryCode}
                    disabled={isSendingOtp}
                  />
                  
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit"
                      className="w-full h-[56px] rounded-[16px] bg-primary hover:bg-primary/90 text-white text-[17px] font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 group overflow-hidden relative"
                      disabled={phone.length < 7 || isSendingOtp}
                    >
                      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                      
                      <span className="relative flex items-center justify-center gap-2">
                        {isSendingOtp ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          <>
                            Get OTP
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>

                  {/* Trust Indicators */}
                  <div className="mt-8 flex flex-col items-center gap-4 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2 text-[15px] font-semibold text-slate-600 dark:text-slate-300">
                      <svg className="w-[18px] h-[18px] text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure OTP Login
                    </div>
                    <div className="flex items-center justify-center gap-6 text-sm font-medium opacity-80">
                      <span className="flex items-center gap-1.5"><span className="text-emerald-500 font-bold">✓</span> Fast Delivery</span>
                      <span className="flex items-center gap-1.5"><span className="text-emerald-500 font-bold">✓</span> 10,000+ Users</span>
                    </div>
                  </div>
                </motion.form>
              ) : (
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerifyOTP();
                  }}
                >
                  <OTPInput 
                    otp={otp} 
                    onChange={setOtp} 
                    onSubmit={handleVerifyOTP}
                    disabled={isVerifyingOtp}
                  />
                  
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit"
                      className="w-full h-[56px] rounded-[16px] bg-primary hover:bg-primary/90 text-white text-[17px] font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 group relative overflow-hidden"
                      disabled={otp.some(d => d === '') || isVerifyingOtp}
                    >
                      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                      
                      <span className="relative flex items-center justify-center gap-2">
                        {isVerifyingOtp ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Verify Code
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>

                  {/* Trust Indicators */}
                  <div className="mt-8 flex flex-col items-center gap-4 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2 text-[15px] font-semibold text-slate-600 dark:text-slate-300">
                      <svg className="w-[18px] h-[18px] text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure OTP Verification
                    </div>
                    <div className="flex items-center justify-center gap-6 text-sm font-medium opacity-80">
                      <span className="flex items-center gap-1.5"><span className="text-emerald-500 font-bold">✓</span> End-to-end secure</span>
                      <span className="flex items-center gap-1.5"><span className="text-emerald-500 font-bold">✓</span> Fast authentication</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <ResendOTP 
                      onResend={handleSendOTP}
                      isSending={isSendingOtp}
                    />
                  </div>

                  <div className="pt-4 flex justify-center">
                    <Button 
                      type="button"
                      variant="ghost" 
                      className="h-10 px-4 rounded-xl text-[14px] text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-all group"
                      onClick={() => {
                        setStep(1);
                        setOtp(['', '', '', '', '', '']);
                      }}
                      disabled={isVerifyingOtp}
                    >
                      <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
                      Change mobile number
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4 text-[13px] font-semibold text-slate-400 dark:text-slate-500">
            <a href="#" className="hover:text-primary transition-colors">Need Help?</a>
            <span className="w-[3px] h-[3px] rounded-full bg-slate-300 dark:bg-slate-700" />
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <span className="w-[3px] h-[3px] rounded-full bg-slate-300 dark:bg-slate-700" />
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
