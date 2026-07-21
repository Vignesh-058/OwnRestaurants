import { ScrollArea } from '@/components/ui/scroll-area';

interface LegalDocumentProps {
  title: string;
  type: 'privacy' | 'terms';
}

const PRIVACY_TEXT = `Privacy Policy

Last Updated: ${new Date().toLocaleDateString('en-IN')}

1. Information We Collect
We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.

2. Use of Information
We may use the information we collect about you to:
- Provide, maintain, and improve our Services
- Perform internal operations, including to prevent fraud
- Send or facilitate communications between you and a delivery partner

3. Sharing of Information
We may share the information we collect about you with vendors, consultants, marketing partners, and other service providers who need access to such information to carry out work on our behalf.

4. Data Security
We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.

5. Contact Us
If you have any questions about this Privacy Policy, please contact our support team via the Contact Us section.`;

const TERMS_TEXT = `Terms & Conditions

Last Updated: ${new Date().toLocaleDateString('en-IN')}

1. Acceptance of Terms
By accessing and using our application, you accept and agree to be bound by the terms and provision of this agreement.

2. User Accounts
When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.

3. Purchases and Payments
If you wish to purchase any product made available through the Service, you may be asked to supply certain information relevant to your Purchase.

4. Returns and Refunds
Refunds are subject to our return policy. Perishable goods generally cannot be returned unless they are defective or damaged upon delivery.

5. Termination
We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever.

6. Changes
We reserve the right, at our sole discretion, to modify or replace these Terms at any time.`;

export const LegalDocument = ({ title, type }: LegalDocumentProps) => {
  const content = type === 'privacy' ? PRIVACY_TEXT : TERMS_TEXT;

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <div className="text-center mb-6 shrink-0">
        <h3 className="text-2xl font-black text-[#1F2937]">{title}</h3>
      </div>
      
      <ScrollArea className="flex-1 pr-4 bg-[#FAF8F5] p-6 rounded-2xl border border-[#FFE2CC]">
        <div className="whitespace-pre-wrap text-sm text-[#4B5563] leading-relaxed">
          {content}
        </div>
      </ScrollArea>
    </div>
  );
};
