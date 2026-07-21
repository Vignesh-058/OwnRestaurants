import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/AuthStore';
import { useUpdateProfile } from '@/hooks/mutations/useUpdateProfile';
import { User, Phone, Mail, Loader2, Save } from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProfileDialog = ({ open, onOpenChange }: EditProfileDialogProps) => {
  const { user } = useAuthStore();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setErrors({});
    }
  }, [user, open]);

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !user?._id) return;

    updateProfile(
      {
        id: user._id,
        payload: {
          name: formData.name.trim(),
          email: formData.email.trim(),
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-[24px] p-0 overflow-hidden bg-[#FFFFFF] border-[#FFE2CC]">
        <DialogHeader className="p-6 pb-4 bg-[#FAF8F5] border-b border-[#FFE2CC]">
          <DialogTitle className="text-2xl font-bold tracking-tight text-[#1F2937]">
            Edit Profile
          </DialogTitle>
          <p className="text-sm text-[#6B7280]">
            Update your personal information below.
          </p>
        </DialogHeader>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#374151]">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`pl-10 h-12 bg-white rounded-xl focus:ring-[#FF6B00] focus:border-[#FF6B00] ${errors.name ? 'border-red-500' : 'border-[#FFE2CC]'}`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#374151]">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`pl-10 h-12 bg-white rounded-xl focus:ring-[#FF6B00] focus:border-[#FF6B00] ${errors.email ? 'border-red-500' : 'border-[#FFE2CC]'}`}
                placeholder="Enter your email"
                type="email"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2 opacity-70">
            <label className="text-sm font-semibold text-[#374151]">Phone Number (Uneditable)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={formData.phone}
                disabled
                className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 border-t border-[#FFE2CC] bg-[#FAF8F5]">
          <Button
            variant="outline"
            className="rounded-xl border-[#FFE2CC] text-[#1F2937] h-12 px-6 font-semibold hover:bg-[#FFF4EB] hover:text-[#FF6B00] transition-colors"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className="rounded-xl bg-[#FF6B00] hover:bg-[#FF7A1A] text-white h-12 px-8 font-bold shadow-md shadow-[#FF6B00]/20 w-full sm:w-auto mt-2 sm:mt-0 transition-colors"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
