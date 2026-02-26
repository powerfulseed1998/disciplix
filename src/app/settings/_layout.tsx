import { HeaderBackButton } from '@react-navigation/elements';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { useThemeContext } from '../../providers/ThemeProvider';

function SettingsLayoutContent() {
  const { isDark } = useThemeContext();
  const { t } = useTranslation();
  const router = useRouter();

  // iOS 嵌套栈已知问题：当根 Stack headerShown=false 时，原生返回按钮不显示
  // 见 https://github.com/software-mansion/react-native-screens/issues/1460
  const headerLeft =
    Platform.OS === 'ios'
      ? (props: { tintColor?: string }) =>
        router.canGoBack() ? (
          <HeaderBackButton
            onPress={() => router.back()}
            tintColor={props.tintColor}
          />
        ) : null
      : undefined;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackButtonDisplayMode: 'minimal',
        headerLeft,
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
