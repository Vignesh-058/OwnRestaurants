import { useSearchStore } from '@/store/SearchStore';

export const useSearchHistory = () => {
 const { searchHistory, addToHistory, removeFromHistory, clearHistory } = useSearchStore();
 return { searchHistory, addToHistory, removeFromHistory, clearHistory };
};
