import { motion } from 'framer-motion';

interface NutritionProps {
  calories?: string;
  protein?: string;
  fat?: string;
  carbs?: string;
  sugar?: string;
}

export const ProductNutrition = ({
  calories = '320 kcal',
  protein = '12g',
  fat = '14g',
  carbs = '35g',
  sugar = '8g'
}: NutritionProps) => {
  const items = [
    { label: 'Calories', value: calories, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Protein', value: protein, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Fat', value: fat, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Carbs', value: carbs, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Sugar', value: sugar, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-black/5 ${item.bg}`}
        >
          <span className="text-sm font-bold text-muted-foreground mb-1">{item.label}</span>
          <span className={`text-xl font-black tracking-tight ${item.color}`}>{item.value}</span>
        </motion.div>
      ))}
    </div>
  );
};
