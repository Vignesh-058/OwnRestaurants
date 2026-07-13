import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductTabsProps {
 description?: string;
}

export const ProductTabs = ({ description }: ProductTabsProps) => {
 return (
 <div className="w-full mt-6">
 <Tabs defaultValue="description" className="w-full">
 <TabsList className="w-full justify-between h-[56px] p-2 bg-[#1F2937] rounded-[20px] overflow-x-auto hide-scrollbar">
 <TabsTrigger value="description" className="flex-1 rounded-[16px] px-4 py-2 font-bold text-[#9CA3AF] data-[state=active]:bg-transparent data-[state=active]:text-[#FF6B00] data-[state=active]:shadow-none">
 Description
 </TabsTrigger>
 <TabsTrigger value="ingredients" className="flex-1 rounded-[16px] px-4 py-2 font-bold text-[#9CA3AF] data-[state=active]:bg-transparent data-[state=active]:text-[#FF6B00] data-[state=active]:shadow-none">
 Ingredients
 </TabsTrigger>
 <TabsTrigger value="nutrition" className="flex-1 rounded-[16px] px-4 py-2 font-bold text-[#9CA3AF] data-[state=active]:bg-transparent data-[state=active]:text-[#FF6B00] data-[state=active]:shadow-none">
 Nutrition
 </TabsTrigger>
 <TabsTrigger value="reviews" className="flex-1 rounded-[16px] px-4 py-2 font-bold text-[#9CA3AF] data-[state=active]:bg-transparent data-[state=active]:text-[#FF6B00] data-[state=active]:shadow-none">
 Reviews
 </TabsTrigger>
 </TabsList>
 <TabsContent value="description" className="p-4 pt-6 text-[#6B7280] leading-relaxed text-[15px]">
 {description || 'Deliciously prepared with the finest ingredients. A perfect choice for a satisfying meal.'}
 </TabsContent>
 <TabsContent value="ingredients" className="p-4 pt-6 text-[#6B7280] leading-relaxed text-[15px]">
 Detailed ingredient list is currently not available for this item.
 </TabsContent>
 <TabsContent value="nutrition" className="p-4 pt-6 text-[#6B7280] leading-relaxed text-[15px]">
 Nutritional information is currently being updated.
 </TabsContent>
 <TabsContent value="reviews" className="p-4 pt-6 text-[#6B7280] leading-relaxed text-[15px]">
 No reviews yet. Be the first to review this product!
 </TabsContent>
 </Tabs>
 </div>
 );
};
