import { Building2, Mail, Phone, Clock, Globe } from 'lucide-react';
import type { Organization } from '@/types/organization.types';

interface ContactUsPanelProps {
  organization: Organization | null;
}

export const ContactUsPanel = ({ organization }: ContactUsPanelProps) => {
  const footerConfig = organization?.theme?.config?.footer?.config;
  const address = footerConfig?.address || (organization as any)?.address;
  const email = footerConfig?.email;
  const phone = footerConfig?.phone || organization?.phoneNo;
  const website = organization?.name ? `www.${organization.name.toLowerCase().replace(/\s+/g, '')}.com` : undefined;

  return (
    <div className="space-y-6 text-[#1F2937]">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black">{organization?.name || 'Contact Us'}</h3>
        <p className="text-[#6B7280] text-sm mt-1">We're here to help and answer any question you might have.</p>
      </div>

      <div className="space-y-4">
        {address && (
          <div className="flex gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#FFE2CC]">
            <div className="h-10 w-10 rounded-full bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-[#FF6B00]" />
            </div>
            <div>
              <p className="font-bold text-sm">Business Address</p>
              <p className="text-sm text-[#6B7280] mt-1">{typeof address === 'string' ? address : address.city}</p>
            </div>
          </div>
        )}

        {email && (
          <div className="flex gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#FFE2CC]">
            <div className="h-10 w-10 rounded-full bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-[#FF6B00]" />
            </div>
            <div>
              <p className="font-bold text-sm">Email Address</p>
              <a href={`mailto:${email}`} className="text-sm text-[#6B7280] mt-1 hover:text-[#FF6B00] transition-colors">{email}</a>
            </div>
          </div>
        )}

        {phone && (
          <div className="flex gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#FFE2CC]">
            <div className="h-10 w-10 rounded-full bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5 text-[#FF6B00]" />
            </div>
            <div>
              <p className="font-bold text-sm">Phone Number</p>
              <a href={`tel:${phone}`} className="text-sm text-[#6B7280] mt-1 hover:text-[#FF6B00] transition-colors">{phone}</a>
            </div>
          </div>
        )}

        {website && (
          <div className="flex gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#FFE2CC]">
            <div className="h-10 w-10 rounded-full bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
              <Globe className="h-5 w-5 text-[#FF6B00]" />
            </div>
            <div>
              <p className="font-bold text-sm">Website</p>
              <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B7280] mt-1 hover:text-[#FF6B00] transition-colors">
                {website}
              </a>
            </div>
          </div>
        )}

        <div className="flex gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#FFE2CC]">
          <div className="h-10 w-10 rounded-full bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5 text-[#FF6B00]" />
          </div>
          <div>
            <p className="font-bold text-sm">Working Hours</p>
            <p className="text-sm text-[#6B7280] mt-1">Mon - Sun: 9:00 AM - 10:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};
