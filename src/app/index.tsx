import { Redirect } from 'expo-router';
import { usePreferencesStore } from '../store/usePreferencesStore';

export default function Index() {
    const hasCompletedOnboarding = usePreferencesStore(
        (state) => state.hasCompletedOnboarding,
    );
    const hydrated = usePreferencesStore((state) => state.hydrated);

    if (!hydrated) return null;
    if (!hasCompletedOnboarding) return <Redirect href="/onboarding" />;
    return <Redirect href="/(tabs)/habits" />;
}
