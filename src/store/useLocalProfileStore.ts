import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocalProfileState {
    displayName: string;
    avatarUri: string | null;
    setDisplayName: (name: string) => void;
    setAvatarUri: (uri: string | null) => void;
}

export const useLocalProfileStore = create<LocalProfileState>()(
    persist(
        (set) => ({
            displayName: '',
            avatarUri: null,
            setDisplayName: (name) => set({ displayName: name }),
            setAvatarUri: (uri) => set({ avatarUri: uri }),
        }),
        {
            name: 'local-profile-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
