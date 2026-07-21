import type { Organization } from '@/types/organization.types';
import ENV from '@/config/env';

interface AboutUsPanelProps {
  organization: Organization | null;
}

export const AboutUsPanel = ({ organization }: AboutUsPanelProps) => {
  const logo = (organization as any)?.images?.logo;
  const description = organization?.theme?.config?.footer?.config?.description || 
    `Welcome to ${organization?.name || 'our platform'}! We are dedicated to providing you with the best shopping experience.`;

  return (
    <div className="space-y-8 text-center text-[#1F2937]">
      <div className="flex justify-center">
        {logo ? (
          <img 
            src={`${ENV.IMAGE_BASE_URL}${logo}`} 
            alt={organization?.name} 
            className="h-24 w-auto object-contain drop-shadow-sm"
          />
        ) : (
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-[#FF6B00] to-[#F59E0B] flex items-center justify-center text-white text-4xl font-black shadow-lg">
            {organization?.name?.charAt(0) || 'O'}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-black">{organization?.name || 'OwnCart'}</h3>
        <p className="text-[#FF6B00] font-bold text-sm mt-1 uppercase tracking-widest">Premium Shopping Experience</p>
      </div>

      <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#FFE2CC] text-left">
        <p className="text-[#6B7280] leading-relaxed text-sm">
          {description}
        </p>
      </div>
      
      <div className="pt-4 border-t border-[#FFE2CC]">
        <p className="text-xs text-[#6B7280]">
          © {new Date().getFullYear()} {organization?.name || 'OwnCart'}. All rights reserved.
        </p>
      </div>
    </div>
  );
};
