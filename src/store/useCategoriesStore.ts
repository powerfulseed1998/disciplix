import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const MAX_CATEGORIES = 10;

export type Category = {
    id: string;
    label: string;
    icon: string;
    color: string;
};

export type CategoriesState = {
    categories: Category[];
    addCategory: (category: Category) => void;
    deleteCategory: (id: string) => boolean;
    deleteCategories: (ids: string[]) => void;
    setCategories: (categories: Category[]) => void;
};

export const useCategoriesStore = create<CategoriesState>()(
    persist(
        (set, get) => ({
            categories: [
                { id: 'personal', label: 'Personal', icon: 'user', color: '#ec4899' },
                { id: 'shopping', label: 'Shopping', icon: 'cart-shopping', color: '#f59e0b' },
                { id: 'work', label: 'Work', icon: 'briefcase', color: '#3b82f6' },
            ],
            addCategory: (category) => set(state => ({
                categories: [...state.categories, category]
            })),
            deleteCategory: (id) => {
                const { categories } = get();
                if (categories.some(c => c.id === id)) {
                    set({ categories: categories.filter(c => c.id !== id) });
                    return true;
                }
                return false;
            },
            deleteCategories: (ids) => {
                set(state => ({
                    categories: state.categories.filter(c => !ids.includes(c.id))
                }));
            },
            setCategories: (categories) => set({ categories }),
        }),
        {
            name: 'categories-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    ),
);
