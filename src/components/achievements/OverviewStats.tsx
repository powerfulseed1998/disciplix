import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { format, differenceInCalendarDays, parseISO } from 'date-fns';
import { useHabitsStore } from '../../store/useHabitsStore';
import { useTasksStore } from '../../store/useTasksStore';
import { useAchievementStore } from '../../store/achievementStore';

interface OverviewStatsProps {
    isDark: boolean;
    textColor: string;
    secondaryTextColor: string;
}

export default function OverviewStats({
    isDark,
    textColor,
    secondaryTextColor,
}: OverviewStatsProps) {
    const { t } = useTranslation();
    const habits = useHabitsStore(state => state.habits);
    const tasks = useTasksStore(state => state.tasks);
    const { streak, xpToday } = useAchievementStore();

    // Compute habits stats for today
    const habitsStats = useMemo(() => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const total = habits.length;
        const completedCount = habits.filter(
            h => h.completedDates?.[todayStr],
        ).length;
        const completionRate = total === 0 ? 0 : (completedCount / total) * 100;

        // Best streak: consecutive days where at least one habit was completed
        const allDates = new Set<string>();
        habits.forEach(h => {
            if (h.completedDates) {
                Object.keys(h.completedDates).forEach(date => {
                    if (h.completedDates![date]) allDates.add(date);
                });
            }
        });
        const sortedDates = Array.from(allDates)
            .filter(d => d <= todayStr)
            .sort();

        let bestStreak = 0;
        if (sortedDates.length > 0) {
            let currentStreak = 1;
            bestStreak = 1;
            for (let i = 1; i < sortedDates.length; i++) {
                const prev = parseISO(sortedDates[i - 1]);
                const curr = parseISO(sortedDates[i]);
                if (differenceInCalendarDays(curr, prev) === 1) {
                    currentStreak++;
                } else {
                    bestStreak = Math.max(bestStreak, currentStreak);
                    currentStreak = 1;
                }
            }
            bestStreak = Math.max(bestStreak, currentStreak);
        }

        return { completedCount, total, completionRate, bestStreak };
    }, [habits]);

    // Compute tasks stats
    const tasksStats = useMemo(() => {
        const total = tasks.length;
        const completedCount = tasks.filter(t => t.completed).length;
        const completionRate = total === 0 ? 0 : (completedCount / total) * 100;
        return { completedCount, total, completionRate };
    }, [tasks]);

    const cardBg = isDark ? '#1e293b' : '#fff';

    return (
        <View className="mb-5">
            <Text
                className="text-xl font-bold mb-3"
                style={{ color: textColor }}
            >
                {t('achievements.statistics')}
            </Text>

            <View className="flex-row gap-3">
                {/* Habits Card */}
                <Animated.View
                    entering={FadeInDown.delay(200).springify()}
                    className="flex-1 rounded-2xl p-4 overflow-hidden"
                    style={{ backgroundColor: cardBg }}
                >
                    <View className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-emerald-500/10" />

                    <View className="flex-row items-center gap-2 mb-3">
                        <View className="w-7 h-7 rounded-lg bg-emerald-500/15 items-center justify-center">
                            <FontAwesome6
                                name="repeat"
                                size={12}
                                color="#10b981"
                            />
                        </View>
                        <Text
                            className="text-xs font-semibold"
                            style={{ color: secondaryTextColor }}
                        >
                            {t('tabs.habits')}
                        </Text>
                    </View>

                    <View className="flex-row items-baseline mb-1">
                        <Text
                            className="text-3xl font-bold"
                            style={{ color: textColor }}
                        >
                            {habitsStats.completedCount}
                        </Text>
                        <Text
                            className="text-lg font-medium ml-0.5"
                            style={{ color: secondaryTextColor }}
                        >
                            /{habitsStats.total}
                        </Text>
                    </View>
                    <Text
                        className="text-xs mb-3"
                        style={{ color: secondaryTextColor }}
                    >
                        {t('common.completed')}
                    </Text>

                    {/* Progress bar */}
                    <View
                        className="h-1.5 rounded-full mb-3"
                        style={{
                            backgroundColor: isDark ? '#334155' : '#e2e8f0',
                        }}
                    >
                        <View
                            className="h-full rounded-full bg-emerald-500"
                            style={{
                                width: `${Math.min(habitsStats.completionRate, 100)}%`,
                            }}
                        />
                    </View>

                </Animated.View>

                {/* Tasks Card */}
                <Animated.View
                    entering={FadeInDown.delay(300).springify()}
                    className="flex-1 rounded-2xl p-4 overflow-hidden"
                    style={{ backgroundColor: cardBg }}
                >
                    <View className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-violet-500/10" />

                    <View className="flex-row items-center gap-2 mb-3">
                        <View className="w-7 h-7 rounded-lg bg-violet-500/15 items-center justify-center">
                            <FontAwesome6
                                name="list-check"
                                size={12}
                                color="#8b5cf6"
                            />
                        </View>
                        <Text
                            className="text-xs font-semibold"
                            style={{ color: secondaryTextColor }}
                        >
                            {t('tabs.todo')}
                        </Text>
                    </View>

                    <View className="flex-row items-baseline mb-1">
                        <Text
                            className="text-3xl font-bold"
                            style={{ color: textColor }}
                        >
                            {tasksStats.completedCount}
                        </Text>
                        <Text
                            className="text-lg font-medium ml-0.5"
                            style={{ color: secondaryTextColor }}
                        >
                            /{tasksStats.total}
                        </Text>
                    </View>
                    <Text
                        className="text-xs mb-3"
                        style={{ color: secondaryTextColor }}
                    >
                        {t('common.completed')}
                    </Text>

                    {/* Progress bar */}
                    <View
                        className="h-1.5 rounded-full mb-3"
                        style={{
                            backgroundColor: isDark ? '#334155' : '#e2e8f0',
                        }}
                    >
                        <View
                            className="h-full rounded-full bg-violet-500"
                            style={{
                                width: `${Math.min(tasksStats.completionRate, 100)}%`,
                            }}
                        />
                    </View>

                </Animated.View>
            </View>

            {/* XP Today strip */}
            <Animated.View
                entering={FadeInDown.delay(400).springify()}
                className="flex-row items-center justify-between mt-3 px-4 py-3 rounded-2xl"
                style={{ backgroundColor: cardBg }}
            >
                <View className="flex-row items-center gap-2">
                    <View className="w-6 h-6 rounded-md bg-amber-400/15 items-center justify-center">
                        <FontAwesome6
                            name="bolt"
                            size={11}
                            color="#fbbf24"
                        />
                    </View>
                    <Text
                        className="text-sm font-semibold"
                        style={{ color: textColor }}
                    >
                        {t('todo.xpToday', { count: xpToday })}
                    </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                    <FontAwesome6
                        name="fire"
                        size={12}
                        color="#f97316"
                    />
                    <Text
                        className="text-sm font-medium"
                        style={{ color: secondaryTextColor }}
                    >
                        {t('todo.dayStreak', { count: streak })}
                    </Text>
                </View>
            </Animated.View>
        </View>
    );
}
