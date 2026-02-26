import { create } from 'zustand';

interface UIState {
  isUnlockAnimationActive: boolean;
  setUnlockAnimationActive: (isActive: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isUnlockAnimationActive: false,
  setUnlockAnimationActive: (isActive) => set({ isUnlockAnimationActive: isActive }),
}));
