import '../lib/nativewind/global.css';
import '../i18n';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '../providers/ThemeProvider';
import { useThemeContext } from '../providers/ThemeProvider';
import { useAchievementStore } from '../store/achievementStore';
import { useHabitsStore } from '../store/useHabitsStore';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { useLoadingStore } from '../store/useLoadingStore';
import { useAchievementUnlockListener } from '../hooks/useAchievementUnlockListener';
import { checkAllAchievements, calculateActiveHabitsCount } from '../utils/achievement-helpers';
import Toast from 'react-native-toast-message';
import LoadingIndicator from '../components/common/LoadingIndicator';
import GlobalModal from '../components/common/GlobalModal';
import AchievementUnlockAnimation from '../components/achievements/AchievementUnlockAnimation';

SplashScreen.preventAutoHideAsync();

function AppContent() {
    const { resolvedTheme } = useThemeContext();
    const { isLoading, loadingText } = useLoadingStore();
    const { currentUnlock, clearUnlock } = useAchievementUnlockListener();

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="settings" />
                <Stack.Screen
                    name="achievement-detail"
                    options={{
                        presentation: 'transparentModal',
                        animation: 'none',
                    }}
                />
            </Stack>
            <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
            <Toast />
            <LoadingIndicator visible={isLoading} text={loadingText} />
            <GlobalModal />
            <AchievementUnlockAnimation
                visible={!!currentUnlock}
                achievement={currentUnlock}
                xpReward={currentUnlock?.xpReward}
                onClose={clearUnlock}
            />
        </>
    );
}

function HydrationWrapper({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        function checkHydration() {
            const habitsHydrated = useHabitsStore.persist.hasHydrated();
            const achievementsHydrated = useAchievementStore.persist.hasHydrated();
            const preferencesHydrated = usePreferencesStore.persist.hasHydrated();
            if (habitsHydrated && achievementsHydrated && preferencesHydrated) {
                setIsHydrated(true);
            }
        }
        checkHydration();
        const unsubHabits = useHabitsStore.persist.onFinishHydration(checkHydration);
        const unsubAchievements = useAchievementStore.persist.onFinishHydration(checkHydration);
        const unsubPrefs = usePreferencesStore.persist.onFinishHydration(checkHydration);
        return () => {
            unsubHabits();
            unsubAchievements();
            unsubPrefs();
        };
    }, []);

    useEffect(() => {
        if (!isHydrated) return;
        useAchievementStore.getState().checkDailyReset();
        const habits = useHabitsStore.getState().habits;
        const activeCount = calculateActiveHabitsCount(habits);
        checkAllAchievements({ activeHabitsCount: activeCount });
        SplashScreen.hideAsync();
    }, [isHydrated]);

    if (!isHydrated) return null;
    return <>{children}</>;
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaProvider>
                <BottomSheetModalProvider>
                    <ThemeProvider>
                        <HydrationWrapper>
                            <AppContent />
                        </HydrationWrapper>
                    </ThemeProvider>
                </BottomSheetModalProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
