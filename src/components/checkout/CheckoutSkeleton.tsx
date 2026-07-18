import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
export const CheckoutSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-background">
      {" "}
      {/* Header */}{" "}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        {" "}
        <div className="max-w-[1400px] mx-auto flex items-center p-4 sm:px-6 md:px-8 h-[72px]">
          {" "}
          <Button
            variant="ghost"
            size="icon"
            disabled
            className="rounded-xl hover:bg-muted"
          >
            {" "}
            <ArrowLeft className="h-6 w-6 text-muted-foreground" />{" "}
          </Button>{" "}
          <Skeleton className="ml-4 h-6 w-32 rounded" />{" "}
        </div>{" "}
      </div>{" "}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
        {" "}
        <div className="flex flex-col lg:grid lg:grid-cols-[65fr_35fr] md:grid-cols-[70fr_30fr] gap-5 xl:gap-6 items-start">
          {" "}
          {/* LEFT COLUMN: Sections */}{" "}
          <div className="flex-1 space-y-6 md:space-y-8 w-full">
            {" "}
            {/* Section 1 */}{" "}
            <div className="premium-card p-4 md:p-5">
              {" "}
              <div className="flex items-center gap-2 mb-4">
                {" "}
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />{" "}
                <div className="space-y-1">
                  {" "}
                  <Skeleton className="h-5 w-32 rounded" />{" "}
                  <Skeleton className="h-3 w-40 rounded" />{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-4">
                {" "}
                <div className="grid grid-cols-3 gap-2">
                  {" "}
                  <Skeleton className="h-[42px] rounded-[12px]" />{" "}
                  <Skeleton className="h-[42px] rounded-[12px]" />{" "}
                  <Skeleton className="h-[42px] rounded-[12px]" />{" "}
                </div>{" "}
                <div className="mt-4 border-t border-border pt-4">
                  {" "}
                  <Skeleton className="h-[72px] w-full rounded-[12px]" />{" "}
                  <Skeleton className="h-[72px] w-full rounded-[12px] mt-3" />{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {/* Section 2 */}{" "}
            <div className="premium-card p-4 md:p-5">
              {" "}
              <div className="flex items-center gap-2 mb-4">
                {" "}
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />{" "}
                <div className="space-y-1">
                  {" "}
                  <Skeleton className="h-5 w-32 rounded" />{" "}
                  <Skeleton className="h-3 w-40 rounded" />{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                <Skeleton className="h-[64px] rounded-[16px]" />{" "}
                <Skeleton className="h-[64px] rounded-[16px]" />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* RIGHT COLUMN: Summary */}{" "}
          <div className="w-full lg:sticky lg:top-24 flex flex-col gap-4 relative z-10">
            {" "}
            <div className="premium-card p-4 md:p-5">
              {" "}
              <Skeleton className="h-6 w-40 rounded mb-4" />{" "}
              <div className="mb-5 pb-5 border-b border-border">
                {" "}
                <Skeleton className="h-[56px] w-full rounded-[16px]" />{" "}
              </div>{" "}
              <div className="space-y-4 mb-5">
                {" "}
                <div className="flex justify-between">
                  {" "}
                  <Skeleton className="h-4 w-16" />{" "}
                  <Skeleton className="h-4 w-16" />{" "}
                </div>{" "}
                <div className="flex justify-between">
                  {" "}
                  <Skeleton className="h-4 w-16" />{" "}
                  <Skeleton className="h-4 w-16" />{" "}
                </div>{" "}
                <div className="flex justify-between">
                  {" "}
                  <Skeleton className="h-4 w-16" />{" "}
                  <Skeleton className="h-4 w-16" />{" "}
                </div>{" "}
              </div>{" "}
              <div className="border-t border-dashed border-border pt-4 mb-6 flex justify-between items-end">
                {" "}
                <Skeleton className="h-5 w-24" />{" "}
                <Skeleton className="h-8 w-24" />{" "}
              </div>{" "}
              <Skeleton className="h-[56px] w-full rounded-[16px]" />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
