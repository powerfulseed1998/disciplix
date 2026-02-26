import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { Easing, withTiming, FadeInDown, useSharedValue } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTasksStore } from '../../../store/useTasksStore';
import { useAchievementStore } from '../../../store/achievementStore';
import ProgressCard from '../ProgressCard';
import CategoriesSection from '../CategoriesSection';

export function ProgressSection() {
    const tasks = useTasksStore(state => state.tasks);
    const { streak, xpToday } = useAchievementStore();
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const progressValue = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    const progressPercent = useSharedValue(0);

    useEffect(() => {
        progressPercent.value = withTiming(progressValue, {
            duration: 500,
            easing: Easing.out(Easing.cubic),
        });
    }, [progressValue]);

    return (
        <ProgressCard
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            progressValue={progressValue}
            streak={streak}
            xpToday={xpToday}
            onPress={() => {}}
        />
    );
}

type EmptySectionProps = {
    isDark: boolean;
};

export function EmptySection({ isDark }: EmptySectionProps) {
    const textColor = isDark ? '#fff' : '#1e293b';
    const { t } = useTranslation();

    return (
        <Animated.View
            entering={FadeInDown.delay(100).springify()}
            className="w-full items-center pt-8 pb-12"
        >
            <View
                className="w-20 h-20 rounded-3xl items-center justify-center mb-4"
                style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
            >
                <FontAwesome6
                    name="clipboard-check"
                    size={32}
                    color={isDark ? '#334155' : '#cbd5e1'}
                />
            </View>
            <Text className="text-lg font-semibold mb-2" style={{ color: textColor }}>
                {t('todo.noTasks')}
            </Text>
            <Text className="text-sm text-center" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {t('todo.noTasksDesc')}
            </Text>
        </Animated.View>
    );
}

type CategoriesSectionContainerProps = {
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    isDark: boolean;
    compact?: boolean;
};

export function CategoriesSectionContainer({
    activeCategory,
    setActiveCategory,
    isDark,
    compact = false,
}: CategoriesSectionContainerProps) {
    const tasks = useTasksStore(state => state.tasks);
    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryTextColor = isDark ? '#94a3b8' : '#64748b';
    const cardBg = isDark ? '#1e293b' : '#fff';
    const inputBorder = isDark ? '#334155' : '#e2e8f0';

    return (
        <CategoriesSection
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            tasks={tasks}
            isDark={isDark}
            textColor={textColor}
            secondaryTextColor={secondaryTextColor}
            cardBg={cardBg}
            inputBorder={inputBorder}
            compact={compact}
        />
    );
}
