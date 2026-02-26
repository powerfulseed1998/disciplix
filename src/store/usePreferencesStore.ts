import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import i18n, { type LanguageCode } from '../i18n';

export type ThemeSetting = 'light' | 'dark';

export type NotificationSettings = {
    pushEnabled: boolean; // 总开关
    habitReminders: boolean; // 习惯提醒
    achievementAlerts: boolean; // 成就弹窗
    soundEnabled: boolean; // 声音
};

type PreferencesState = {
    theme: ThemeSetting;
    language: LanguageCode;
    notificationsEnabled: boolean;
    notificationSettings: NotificationSettings;
    hasCompletedOnboarding: boolean;
    hasShownSwipeHint: boolean;
    hasShownReorderHint: boolean;
    hydrated: boolean;
    lastHabitCelebrationDate: string | null;
    setTheme: (theme: ThemeSetting) => void;
    toggleTheme: () => void;
    setLanguage: (language: LanguageCode) => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    updateNotificationSettings: (
        settings: Partial<NotificationSettings>,
    ) => void;
    setHasCompletedOnboarding: (completed: boolean) => void;
    markSwipeHintShown: () => void;
    markReorderHintShown: () => void;
    setHydrated: (value: boolean) => void;
    setLastHabitCelebrationDate: (date: string) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set, get) => ({
            theme: 'light',
            language: i18n.language as LanguageCode,
            notificationsEnabled: false,
            notificationSettings: {
                pushEnabled: true,
                habitReminders: true,
                achievementAlerts: true,
                soundEnabled: true,
            },
            hasCompletedOnboarding: false,
            hasShownSwipeHint: false,
            hasShownReorderHint: false,
            hydrated: false,
            lastHabitCelebrationDate: null,
            setTheme: theme => set({ theme }),
            toggleTheme: () =>
                set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
            setLanguage: (language: LanguageCode) => {
                i18n.changeLanguage(language);
                set({ language });
            },
            setNotificationsEnabled: enabled =>
                set(state => ({
                    notificationsEnabled: enabled,
                    notificationSettings: {
                        ...state.notificationSettings,
                        pushEnabled: enabled,
                    },
                })),
            updateNotificationSettings: settings =>
                set(state => {
                    const newSettings = {
                        ...state.notificationSettings,
                        ...settings,
                    };
                    return {
                        notificationSettings: newSettings,
                        // 如果修改了 pushEnabled，顺便同步回旧的 notificationsEnabled 字段以防其他地方用到
                        notificationsEnabled:
                            settings.pushEnabled !== undefined
                                ? settings.pushEnabled
                                : state.notificationsEnabled,
                    };
                }),
            setHasCompletedOnboarding: completed =>
                set({ hasCompletedOnboarding: completed }),
            markSwipeHintShown: () => set({ hasShownSwipeHint: true }),
            markReorderHintShown: () => set({ hasShownReorderHint: true }),
            setHydrated: value => set({ hydrated: value }),
            setLastHabitCelebrationDate: date => set({ lastHabitCelebrationDate: date }),
        }),
        {
            name: 'preferences-store',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: state => ({
                theme: state.theme,
                language: state.language,
                notificationsEnabled: state.notificationsEnabled,
                notificationSettings: state.notificationSettings,
                hasCompletedOnboarding: state.hasCompletedOnboarding,
                hasShownSwipeHint: state.hasShownSwipeHint,
                hasShownReorderHint: state.hasShownReorderHint,
                lastHabitCelebrationDate: state.lastHabitCelebrationDate,
            }),
            onRehydrateStorage: () => state => {
                if (state?.language) {
                    i18n.changeLanguage(state.language);
                }
                state?.setHydrated(true);
            },
        },
    ),
);
