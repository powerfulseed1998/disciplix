import { Stack } from 'expo-router';
import { useThemeContext } from '../../providers/ThemeProvider';
import { useTranslation } from 'react-i18next';

function SettingsLayoutContent() {
    const { isDark } = useThemeContext();
    const { t } = useTranslation();

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerBackTitleVisible: false,
                contentStyle: {
                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                },
                headerStyle: {
                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                },
                headerTintColor: isDark ? '#fff' : '#000',
            }}
        >
            <Stack.Screen
                name="edit-profile"
                options={{ headerTitle: t('profile.editProfile') }}
            />
            <Stack.Screen
                name="help-support"
                options={{ headerTitle: t('profile.helpSupport') }}
            />
            <Stack.Screen
                name="about"
                options={{ headerTitle: t('profile.about') }}
            />
            <Stack.Screen
                name="language"
                options={{ headerTitle: t('language.title') }}
            />
        </Stack>
    );
}

export default function SettingsLayout() {
    return <SettingsLayoutContent />;
}
