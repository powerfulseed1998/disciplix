import { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { useColorScheme, View } from 'react-native';
import {
    ThemeSetting,
    usePreferencesStore,
} from '../store/usePreferencesStore';

type ThemeContextValue = {
    theme: ThemeSetting;
    resolvedTheme: ThemeSetting;
    isDark: boolean;
    hydrated: boolean;
    setTheme: (theme: ThemeSetting) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
    const colorScheme = useColorScheme();
    const theme = usePreferencesStore(state => state.theme);
    const hydrated = usePreferencesStore(state => state.hydrated);
    const setTheme = usePreferencesStore(state => state.setTheme);
    const toggleTheme = usePreferencesStore(state => state.toggleTheme);

    const resolvedTheme: ThemeSetting =
        theme ?? (colorScheme === 'dark' ? 'dark' : 'light');

    const value = useMemo<ThemeContextValue>(
        () => ({
            theme: theme ?? 'light',
            resolvedTheme,
            isDark: resolvedTheme === 'dark',
            hydrated,
            setTheme,
            toggleTheme,
        }),
        [hydrated, resolvedTheme, setTheme, theme, toggleTheme],
    );

    if (!hydrated) {
        return <View style={{ flex: 1, backgroundColor: '#f8fafc' }} />;
    }

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useThemeContext must be used within ThemeProvider');
    }
    return ctx;
}
