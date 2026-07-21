import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const DEFAULT_FAQS = [
  {
    question: 'How do I place an order?',
    answer: 'Browse our catalog, select your items, and tap "Add to Cart". When you are ready, proceed to Checkout and follow the on-screen instructions to complete your payment.'
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes! Once your order is placed, you can go to "Orders" in your profile to see the real-time status of your delivery.'
  },
  {
    question: 'What are the payment options?',
    answer: 'We accept Credit/Debit cards, UPI, Wallets, and Cash on Delivery (COD) for eligible orders.'
  },
  {
    question: 'How do I cancel my order?',
    answer: 'Orders can only be cancelled before they are processed. Go to "Order Details" and tap "Cancel Order" if the option is available.'
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach us through the "Contact Us" section in Settings for email and phone support.'
  }
];

export const FaqPanel = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-black text-[#1F2937]">Frequently Asked Questions</h3>
        <p className="text-[#6B7280] text-sm mt-1">Find answers to common questions.</p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {DEFAULT_FAQS.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`} 
            className="border border-[#FFE2CC] bg-[#FAF8F5] rounded-2xl px-4 py-1 data-[state=open]:bg-white transition-colors"
          >
            <AccordionTrigger className="hover:no-underline text-left font-bold text-[#1F2937] text-sm py-3">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-[#6B7280] text-sm leading-relaxed pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
