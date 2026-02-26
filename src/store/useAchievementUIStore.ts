import { create } from 'zustand';

type AchievementUIStore = {
    hiddenAchievementId: string | null;
    setHiddenAchievementId: (id: string | null) => void;
};

export const useAchievementUIStore = create<AchievementUIStore>((set) => ({
    hiddenAchievementId: null,
    setHiddenAchievementId: (id) => set({ hiddenAchievementId: id }),
}));
