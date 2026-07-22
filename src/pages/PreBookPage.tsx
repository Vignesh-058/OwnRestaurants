import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePreOrderCategories } from '@/hooks/queries/usePreOrderCategories';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductDrawer } from '@/components/product/ProductDrawer';
import { AlertCircle, ArrowLeft, Calendar, Clock, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/CartStore';

export const PreBookPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setPreBooking, setOrderType, setTableInfo, setNumberOfGuests } = useCartStore();
  
  const preBookingId = searchParams.get('preBookingId') || '';
  const preOrderDate = searchParams.get('preOrderDate') || '';
  const preOrderTime = searchParams.get('preOrderTime') || '';
  const orderType = searchParams.get('orderType') || '';
  const tableId = searchParams.get('tableId') || '';
  const tableName = searchParams.get('tableName') || '';
  const numberOfGuestsStr = searchParams.get('numberOfGuests') || '';
  const numberOfGuests = numberOfGuestsStr ? parseInt(numberOfGuestsStr, 10) : null;

  useEffect(() => {
    if (preBookingId && preOrderDate && preOrderTime) {
      setPreBooking({
        preBookingId,
        preOrderDate,
        preOrderTime,
        orderType: (orderType as any) || null,
        tableInfo: tableId ? { tableId, tableName: tableName || 'Table' } : null,
        numberOfGuests,
      });
      if (orderType) setOrderType(orderType as any);
      if (tableId) setTableInfo({ tableId, tableName: tableName || 'Table' });
      if (numberOfGuests) setNumberOfGuests(numberOfGuests);
    }
  }, [preBookingId, preOrderDate, preOrderTime, orderType, tableId, tableName, numberOfGuests, setPreBooking, setOrderType, setTableInfo, setNumberOfGuests]);

  const { data: originalCategories, isLoading, isError } = usePreOrderCategories({
    preBookId: preBookingId,
    preOrderDate,
    preOrderTime,
  });

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  if (!preBookingId || !preOrderDate || !preOrderTime) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Invalid Pre-Booking</h2>
        <p className="text-muted-foreground mb-6">Missing pre-booking details. Please select a valid campaign.</p>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-64px)] bg-background">
      <motion.div
        key="prebook"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="w-full flex flex-col"
      >
        {/* Header */}
        <div className="bg-card border-b border-border p-4 sticky top-16 z-20 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-bold text-foreground leading-tight">Pre-Order Menu</h1>
          </div>
          <div className="ml-11">
            <div className="inline-flex flex-wrap items-center gap-3 px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
              <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                <Calendar className="w-4 h-4" /> {new Date(preOrderDate).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="w-1 h-1 rounded-full bg-primary/40" />
              <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                <Clock className="w-4 h-4" /> {preOrderTime}
              </span>
              {orderType && (
                <>
                  <span className="w-1 h-1 rounded-full bg-primary/40" />
                  <span className="flex items-center gap-1.5 text-sm font-bold text-primary">
                    <Utensils className="w-4 h-4" /> {orderType} {orderType === 'Dine In' && tableName ? `(${tableName}${numberOfGuests ? `, ${numberOfGuests} Guests` : ''})` : ''}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="w-full max-w-7xl mx-auto flex-1 px-4 sm:px-6 py-8 pb-24 space-y-12">
            {[1, 2].map((catIndex) => (
              <div key={catIndex} className="w-full">
                <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((itemIndex) => (
                    <div key={itemIndex} className="flex flex-col w-full h-[320px] bg-card rounded-2xl border border-border overflow-hidden">
                      <div className="w-full h-[180px] bg-muted animate-pulse shrink-0" />
                      <div className="flex flex-col flex-1 p-4 justify-between">
                        <div>
                           <div className="h-5 w-3/4 bg-muted rounded animate-pulse mb-2" />
                           <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between items-center mt-auto pt-4">
                           <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                           <div className="h-10 w-24 bg-muted rounded-full animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[50vh] px-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Failed to load menu</h2>
            <p className="text-muted-foreground text-center max-w-md">
              We couldn't load the pre-order menu. Please try again later.
            </p>
          </div>
        ) : !originalCategories || originalCategories.length === 0 || originalCategories.every(c => !c.items || c.items.length === 0) ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[50vh] px-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Utensils className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No pre-order items available.</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Please choose another date or time.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto flex-1 px-4 sm:px-6 py-8 pb-24 space-y-12">
            {(() => {
              const validCategories = originalCategories.filter(c => c?.items && c.items.length > 0);
              return validCategories.map((category, index) => (
                <div key={category._id || index} className="w-full">
                <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">{(category as any).categoryName || category.name || (category as any).displayName}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {category.items.map((product: any) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        layout="vertical"
                        onClick={(p) => {
                          if (p.variations && p.variations.length > 0) {
                            setSelectedProductId(p._id);
                          }
                        }}
                      />
                    ))}
                  </div>
                  {index < validCategories.length - 1 && (
                    <div className="mt-10 border-b border-border" />
                  )}
                </div>
              ));
            })()}
          </div>
        )}
      </motion.div>

      {/* Product Details Drawer for items with variations */}
      <ProductDrawer
        itemId={selectedProductId}
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  );
};
