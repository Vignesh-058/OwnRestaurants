import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
}

export const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
  disabled,
}: QuantitySelectorProps) => {
  return (
    <div className="flex items-center bg-secondary/50 rounded-xl p-1 w-fit">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg hover:bg-background shadow-sm bg-background text-muted-foreground hover:text-foreground transition-colors"
        onClick={onDecrease}
        disabled={disabled}
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="w-10 text-center font-bold text-sm select-none">
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg hover:bg-background shadow-sm bg-background text-muted-foreground hover:text-primary transition-colors"
        onClick={onIncrease}
        disabled={disabled}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};
