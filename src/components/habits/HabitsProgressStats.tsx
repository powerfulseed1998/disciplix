import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ProgressRing from './ProgressRing';

interface HabitsProgressStatsProps {
    isDark: boolean;
    textColor: string;
    secondaryTextColor: string;
    completionRate: number;
    completedCount: number;
    bestStreak: number;
}

export default function HabitsProgressStats({
    isDark,
    textColor,
    secondaryTextColor,
    completionRate,
    completedCount,
    bestStreak,
}: HabitsProgressStatsProps) {
    const { t } = useTranslation();

    return (
        <View className="flex-row items-center justify-between mb-6 px-2">
            <ProgressRing progress={completionRate} isDark={isDark} />
            <View className="flex-1 ml-6 gap-3">
                <View
                    className="flex-row items-center p-4 rounded-2xl gap-3"
                    style={{ backgroundColor: isDark ? '#1e293b' : '#fff' }}
                >
                    <FontAwesome6
                        name="check-circle"
                        size={20}
                        color="#10b981"
                    />
                    <Text
                        className="text-2xl font-bold"
                        style={{ color: textColor }}
                    >
                        {completedCount}
                    </Text>
                    <Text
                        className="text-xs flex-1"
                        style={{ color: secondaryTextColor }}
                    >
                        {t('habits.done')}
                    </Text>
                </View>
                <View
                    className="flex-row items-center p-4 rounded-2xl gap-3"
                    style={{ backgroundColor: isDark ? '#1e293b' : '#fff' }}
                >
                    <FontAwesome6
                        name="fire"
                        size={20}
                        color="#f59e0b"
                    />
                    <Text
                        className="text-2xl font-bold"
                        style={{ color: textColor }}
                    >
                        {bestStreak}
                    </Text>
                    <Text
                        className="text-xs flex-1"
                        style={{ color: secondaryTextColor }}
                    >
                        {t('habits.bestStreak')}
                    </Text>
                </View>
            </View>
        </View>
    );
}
