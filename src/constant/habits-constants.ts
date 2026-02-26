export const HABIT_SCREEN_CONSTANTS = {
    BOTTOM_SHEET_SNAP_POINTS: ['85%'] as string[],
    CELEBRATION_DURATION: 2000,
    FAB_SIZE: 60,
    FAB_SHADOW_CONFIG: {
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    MAX_HABITS: 10,
} as const;

export const HABIT_THEME_COLORS = {
    light: {
        background: '#f8fafc',
        surface: '#fff',
        text: '#1e293b',
        secondaryText: '#64748b',
        card: '#f1f5f9',
        border: 'rgba(226, 232, 240, 0.5)',
        bottomSheetBg: '#ffffff',
        handleIndicator: '#e2e8f0',
    },
    dark: {
        background: '#0f172a',
        surface: '#1e293b',
        text: '#fff',
        secondaryText: '#94a3b8',
        card: '#334155',
        border: 'rgba(71, 85, 105, 0.5)',
        bottomSheetBg: '#0f172a',
        handleIndicator: '#334155',
    },
} as const;
