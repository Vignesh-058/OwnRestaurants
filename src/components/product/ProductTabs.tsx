import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductTabsProps {
 description?: string;
}

export const ProductTabs = ({ description }: ProductTabsProps) => {
 return (
 <div className="w-full mt-6">
 <Tabs defaultValue="description" className="w-full">
 <TabsList className="w-full justify-start h-auto p-1 bg-[#F3F7FC] dark:bg-slate-800 rounded-2xl overflow-x-auto hide-scrollbar">
 <TabsTrigger value="description" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-[#111827] data-[state=active]:shadow-sm data-[state=active]:text-[#0C6CEA]">
 Description
 </TabsTrigger>
 <TabsTrigger value="ingredients" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-[#111827] data-[state=active]:shadow-sm data-[state=active]:text-[#0C6CEA]">
 Ingredients
 </TabsTrigger>
 <TabsTrigger value="nutrition" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-[#111827] data-[state=active]:shadow-sm data-[state=active]:text-[#0C6CEA]">
 Nutrition
 </TabsTrigger>
 <TabsTrigger value="reviews" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-[#111827] data-[state=active]:shadow-sm data-[state=active]:text-[#0C6CEA]">
 Reviews
 </TabsTrigger>
 </TabsList>
 <TabsContent value="description" className="p-4 pt-6 text-[#6B7280] leading-relaxed">
 {description || 'Deliciously prepared with the finest ingredients. A perfect choice for a satisfying meal.'}
 </TabsContent>
 <TabsContent value="ingredients" className="p-4 pt-6 text-[#6B7280] leading-relaxed">
 Detailed ingredient list is currently not available for this item.
 </TabsContent>
 <TabsContent value="nutrition" className="p-4 pt-6 text-[#6B7280] leading-relaxed">
 Nutritional information is currently being updated.
 </TabsContent>
 <TabsContent value="reviews" className="p-4 pt-6 text-[#6B7280] leading-relaxed">
 No reviews yet. Be the first to review this product!
 </TabsContent>
 </Tabs>
 </div>
 );
};
