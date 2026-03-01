import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';
import AchievementUnlockAnimation from '../components/achievements/AchievementUnlockAnimation';
import GlobalModal from '../components/common/GlobalModal';
import LoadingIndicator from '../components/common/LoadingIndicator';
import { useAchievementUnlockListener } from '../hooks/useAchievementUnlockListener';
import '../i18n';
import '../lib/nativewind/global.css';
import { ThemeProvider, useThemeContext } from '../providers/ThemeProvider';
import { useAchievementStore } from '../store/achievementStore';
import { useHabitsStore } from '../store/useHabitsStore';
import { useLoadingStore } from '../store/useLoadingStore';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { calculateActiveHabitsCount, checkAllAchievements } from '../utils/achievement-helpers';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
        <ThemeProvider>
          <BottomSheetModalProvider>
            <HydrationWrapper>
              <AppContent />
            </HydrationWrapper>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
