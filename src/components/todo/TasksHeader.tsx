import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../providers/ThemeProvider';

interface TasksHeaderProps {
    sortBy: string;
    handleToggleSortMenu: () => void;
    sortButtonRef: any;
}

export const TasksHeader = memo(({
    sortBy,
    handleToggleSortMenu,
    sortButtonRef,
}: TasksHeaderProps) => {
    const { isDark } = useThemeContext();
    const { t } = useTranslation();
    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryTextColor = isDark ? '#94a3b8' : '#64748b';

    return (
        <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-3">
                <Text className="text-xl font-bold" style={{ color: textColor }}>
                    {t('todo.todaysTasks')}
                </Text>
            </View>
            <View ref={sortButtonRef}>
                <Pressable
                    className="flex-row items-center gap-1.5"
                    onPress={handleToggleSortMenu}
                >
                    <FontAwesome6
                        name="arrow-down-wide-short"
                        size={14}
                        color={secondaryTextColor}
                    />
                    <Text
                        className="text-[13px] font-medium"
                        style={{ color: secondaryTextColor }}
                    >
                        {sortBy === 'time' ? t('todo.byTime') : t('todo.byPriority')}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
});
