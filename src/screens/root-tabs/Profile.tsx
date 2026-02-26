import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { useThemeContext } from '../../providers/ThemeProvider';
import { useProfile } from '../../hooks/useProfile';
import { useAchievementStore } from '../../store/achievementStore';
import { useTasksStore } from '../../store/useTasksStore';
import { useHabitsStore } from '../../store/useHabitsStore';
import { useLocalProfileStore } from '../../store/useLocalProfileStore';
import {
    UserProfileCard,
    StatItem,
    SettingsMenuItem,
} from '../../components/profile';
import { STATS_CONFIG } from '../../constant/profile';
import { getTitleByLevel } from '../../utils/level-utils';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { isDark } = useThemeContext();
    const { t } = useTranslation();
    const { menuItems, handleMenuPress } = useProfile({ isDark });
    const {
        level,
        currentTitle,
        streak,
        userAchievements,
        totalHabitsCompleted,
    } = useAchievementStore();
    const tasks = useTasksStore((state) => state.tasks);
    const displayName = useLocalProfileStore((state) => state.displayName);
    const avatarUri = useLocalProfileStore((state) => state.avatarUri);

    const tasksCompleted = tasks.filter((t) => t.completed).length;
    const achievementsUnlocked = Object.values(userAchievements).filter(
        (a) => a?.unlocked
    ).length;

    const displayProfile = {
        name: displayName || t('profile.localUser'),
        email: '',
        avatar: avatarUri || '',
        joinDate: new Date().getFullYear().toString(),
        level,
        title: currentTitle,
        titleColor: getTitleByLevel(level).color,
    };

    const displayStats = {
        tasksCompleted,
        habitsStreak: streak,
        achievements: achievementsUnlocked,
        checkIns: totalHabitsCompleted,
    };

    return (
        <View
            className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}
        >
            <View
                className="absolute w-full z-10 overflow-hidden pb-5"
                style={{ paddingTop: insets.top }}
            >
                {Platform.OS === 'ios' ? (
                    <BlurView
                        intensity={80}
                        tint={isDark ? 'dark' : 'light'}
                        style={StyleSheet.absoluteFill}
                    />
                ) : (
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                            },
                        ]}
                    />
                )}
                <View className="flex-row justify-between items-center px-6 pt-5">
                    <View>
                        <Text
                            className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                        >
                            {t('profile.personalizeSetup')}
                        </Text>
                        <Text
                            className={`text-[28px] font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}
                        >
                            {t('profile.title')}
                        </Text>
                    </View>
                    <Pressable
                        className={`w-11 h-11 rounded-full items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}
                    >
                        <FontAwesome6
                            name="gear"
                            size={18}
                            color={isDark ? '#E2E8F0' : '#64748B'}
                        />
                    </Pressable>
                </View>
                <View
                    className="absolute bottom-0 w-full h-px"
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
                    paddingBottom: 20,
                }}
                showsVerticalScrollIndicator={false}
            >
                <UserProfileCard
                    profile={displayProfile}
                    isDark={isDark}
                    isGuest={false}
                />

                <View className="flex-row justify-around gap-3 mb-6 mt-6">
                    {STATS_CONFIG.map((stat, index) => (
                        <StatItem
                            key={stat.key}
                            label={stat.label}
                            value={displayStats[stat.key]}
                            icon={stat.icon}
                            color={stat.color}
                            isDark={isDark}
                            index={index}
                        />
                    ))}
                </View>

                <View className="mb-5">
                    <Text
                        className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}
                    >
                        {t('profile.settings')}
                    </Text>
                    <View className="gap-2.5">
                        {menuItems.map((item, index) => (
                            <SettingsMenuItem
                                key={item.id}
                                item={item}
                                index={index}
                                isDark={isDark}
                                onPress={() => handleMenuPress(item.id)}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
