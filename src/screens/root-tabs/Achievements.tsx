import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../providers/ThemeProvider';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withDelay,
    withTiming,
    Easing,
    FadeInDown,
} from 'react-native-reanimated';
import AchievementCard from '../../components/achievements/AchievementCard';
import OverviewStats from '../../components/achievements/OverviewStats';
import {
    USER_LEVEL,
    ACHIEVEMENTS,
    RARITY_COLORS,
} from '../../constant/achievements';
import { useAchievementStore } from '../../store/achievementStore';
import { getRequiredXPForLevel, getTitleByLevel } from '../../utils/level-utils';

// XP Bar Component
const XPBar = ({
    current,
    max,
    isDark,
}: {
    current: number;
    max: number;
    isDark: boolean;
}) => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(
            500,
            withTiming((current / max) * 100, {
                duration: 1000,
                easing: Easing.out(Easing.cubic),
            }),
        );
    }, [current, max]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`,
    }));

    return (
        <View className="gap-2">
            <View
                className="h-2.5 rounded overflow-hidden"
                style={{ backgroundColor: isDark ? '#334155' : '#e2e8f0' }}
            >
                <Animated.View className="h-full rounded overflow-hidden" style={animatedStyle}>
                    <View className="flex-1 bg-violet-500" />
                </Animated.View>
            </View>
            <Text
                className="text-xs font-semibold text-right"
                style={{ color: isDark ? '#94a3b8' : '#64748b' }}
            >
                {current.toLocaleString()} / {max.toLocaleString()} XP
            </Text>
        </View>
    );
};

export default function AchievementsScreen() {
    const { isDark } = useThemeContext();
    const { t } = useTranslation();
    const { level, currentXP, userAchievements } = useAchievementStore();
    const insets = useSafeAreaInsets();

    const displayAchievements = useMemo(() => {
        return ACHIEVEMENTS.map((staticItem) => {
            const dynamicState = userAchievements[staticItem.id];

            return {
                ...staticItem, // 即使没解锁，也要有名字、图标等信息
                unlocked: dynamicState?.unlocked ?? false, // 没找到就是未解锁
                progress: dynamicState?.progress ?? 0,
                unlockedAt: dynamicState?.unlockedAt ? new Date(dynamicState.unlockedAt) : undefined,
            };
        });
    }, [userAchievements]);

    const unlockedCount = displayAchievements.filter(a => a.unlocked).length;
    const requiredXP = getRequiredXPForLevel(level);

    // Theme styles
    const bgColor = isDark ? '#0f172a' : '#f8fafc';
    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryTextColor = isDark ? '#94a3b8' : '#64748b';

    return (
        <View className="flex-1" style={{ backgroundColor: bgColor }}>
            {/* Header */}
            <View className="absolute w-full z-10 overflow-hidden pb-5" style={{ paddingTop: insets.top }}>
                {Platform.OS === 'ios' ? (
                    <BlurView
                        intensity={80}
                        tint={isDark ? 'dark' : 'light'}
                        className="absolute inset-0"
                    />
                ) : (
                    <View
                        className="absolute inset-0"
                        style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}
                    />
                )}
                <View className="flex-row justify-between items-center px-6 pt-5">
                    <View>
                        <Text
                            className="text-sm font-medium mb-1"
                            style={{ color: secondaryTextColor }}
                        >
                            {t('achievements.keepGoing')}
                        </Text>
                        <Text
                            className="text-3xl font-bold"
                            style={{ color: textColor }}
                        >
                            {t('achievements.title')}
                        </Text>
                    </View>
                    <View
                        className="w-11 h-11 rounded-3xl items-center justify-center"
                        style={{ backgroundColor: isDark ? '#334155' : '#f1f5f9' }}
                    >
                        <FontAwesome6
                            name="ranking-star"
                            size={18}
                            color={isDark ? '#fbbf24' : '#f59e0b'}
                        />
                    </View>
                </View>
                <View
                    className="absolute bottom-0 w-full h-0.5"
                    style={{
                        backgroundColor: isDark
                            ? 'rgba(71, 85, 105, 0.5)'
                            : 'rgba(226, 232, 240, 0.5)',
                    }}
                />
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: insets.top + 100,
                    paddingBottom: 100,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Level card */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    className="rounded-3xl p-6 mt-5 mb-5 overflow-hidden shadow-black shadow-lg shadow-opacity-8 shadow-radius-12 elevation-4"
                    style={{ backgroundColor: isDark ? '#1e293b' : '#fff' }}
                >
                    {/* Decorative background */}
                    <View className="absolute right-[-40] top-[-40] w-30 h-30 rounded-full bg-violet-500/12.5" />
                    <View className="absolute left-[-20] bottom-[-30] w-20 h-20 rounded-full bg-amber-400/8" />

                    <View className="flex-row items-center mb-5">
                        <View className="w-14 h-14 rounded-2xl bg-violet-500 items-center justify-center shadow-violet-500 shadow-lg shadow-opacity-30 shadow-radius-8 elevation-4">
                            <Text className="text-2xl font-bold text-white">
                                {level}
                            </Text>
                        </View>
                        <View className="flex-1 ml-4">
                            <Text
                                className="text-xl font-bold mb-1"
                                style={{ color: textColor }}
                            >
                                {t(`achievements.levelTitles.${getTitleByLevel(level).id}`, getTitleByLevel(level).title)}
                            </Text>
                            <Text
                                className="text-xs"
                                style={{ color: secondaryTextColor }}
                            >
                                {t('achievements.xpToLevel', { xp: requiredXP - currentXP, level: level + 1 })}
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-0.5">
                            <FontAwesome6
                                name="star"
                                size={12}
                                color="#fbbf24"
                                solid
                            />
                            <FontAwesome6
                                name="star"
                                size={16}
                                color="#fbbf24"
                                solid
                            />
                            <FontAwesome6
                                name="star"
                                size={12}
                                color="#fbbf24"
                                solid
                            />
                        </View>
                    </View>

                    <XPBar
                        current={currentXP}
                        max={requiredXP}
                        isDark={isDark}
                    />
                </Animated.View>

                {/* Statistics section */}
                <OverviewStats
                    isDark={isDark}
                    textColor={textColor}
                    secondaryTextColor={secondaryTextColor}
                />

                {/* Achievements section */}
                <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text
                            className="text-xl font-bold"
                            style={{ color: textColor }}
                        >
                            {t('achievements.badges')}
                        </Text>
                        <View className="bg-violet-500 px-3 py-1 rounded-xl">
                            <Text className="text-white text-xs font-semibold">
                                {unlockedCount}/{ACHIEVEMENTS.length}
                            </Text>
                        </View>
                    </View>

                    {/* Rarity legend */}
                    <View className="flex-row gap-4 mb-4">
                        {Object.entries(RARITY_COLORS).map(([key, value]) => (
                            <View key={key} className="flex-row items-center gap-1.5">
                                <View
                                    className="w-2 h-2 rounded"
                                    style={{ backgroundColor: value.bg }}
                                />
                                <Text
                                    className="text-xs font-medium"
                                    style={{ color: secondaryTextColor }}
                                >
                                    {t(`achievements.rarity.${key}`, value.label)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Achievements grid */}
                    <View className="flex-row flex-wrap gap-3">
                        {displayAchievements.map((achievement, index) => (
                            <AchievementCard
                                key={achievement.id}
                                achievement={achievement}
                                isDark={isDark}
                                index={index}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* 详情浮层 */}
            {/* <AchievementDetailOverlay
                achievement={selectedAchievement}
                measurement={cardMeasurement}
                isDark={isDark}
                onClose={handleCloseDetail}
            /> */}
        </View>
    );
}
