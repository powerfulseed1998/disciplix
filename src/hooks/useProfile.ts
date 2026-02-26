import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { MenuItem, ProfileMenuId } from '../types/profile';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../providers/ThemeProvider';
import { useColorScheme } from "nativewind";
import { usePreferencesStore } from '../store/usePreferencesStore';
import { getLanguageNativeLabel } from '../i18n';

interface UseProfileProps {
    isDark: boolean;
}

export function useProfile({ isDark }: UseProfileProps = { isDark: false }) {
    const { t } = useTranslation();
    const language = usePreferencesStore((state) => state.language);
    const router = useRouter();
    const { toggleTheme } = useThemeContext();
    const { toggleColorScheme } = useColorScheme();

    // 菜单配置（已移除 Notifications、Security）
    const menuItems: MenuItem[] = [
        {
            id: ProfileMenuId.EDIT_PROFILE,
            icon: 'user-pen',
            label: t('profile.editProfile'),
            color: '#6366f1',
        },
        {
            id: ProfileMenuId.DARK_MODE,
            icon: 'moon',
            label: t('profile.darkMode'),
            hasToggle: true,
            toggleValue: isDark,
            color: '#8b5cf6',
        },
        {
            id: ProfileMenuId.LANGUAGE,
            icon: 'language',
            label: t('profile.language'),
            value: getLanguageNativeLabel(language),
            color: '#0ea5e9',
        },
        {
            id: ProfileMenuId.HELP_SUPPORT,
            icon: 'circle-question',
            label: t('profile.helpSupport'),
            color: '#64748b',
        },
        {
            id: ProfileMenuId.ABOUT,
            icon: 'circle-info',
            label: t('profile.about'),
            color: '#737373',
        },
    ];

    const handleMenuPress = useCallback(
        (itemId: ProfileMenuId) => {
            switch (itemId) {
                case ProfileMenuId.EDIT_PROFILE:
                    router.push('/settings/edit-profile');
                    break;

                case ProfileMenuId.DARK_MODE:
                    toggleTheme();
                    toggleColorScheme();
                    break;

                case ProfileMenuId.LANGUAGE:
                    router.push('/settings/language');
                    break;

                case ProfileMenuId.HELP_SUPPORT:
                    router.push('/settings/help-support');
                    break;

                case ProfileMenuId.ABOUT:
                    router.push('/settings/about');
                    break;

                default:
                    break;
            }
        },
        [router, toggleTheme, toggleColorScheme],
    );

    const handleToggle = useCallback((itemId: ProfileMenuId) => {
        console.log('Toggle pressed:', itemId);
        // TODO: 实现切换功能
    }, []);

    return {
        menuItems,
        handleMenuPress,
        handleToggle,
    };
}
