import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeOutDown, useSharedValue, useAnimatedStyle, interpolate, withSpring, withTiming } from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { scheduleOnRN } from 'react-native-worklets';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../providers/ThemeProvider';
import { useHabitsStore } from '../../store/useHabitsStore';
import { HABIT_SCREEN_CONSTANTS, HABIT_THEME_COLORS } from '../../constant/habits-constants';
import { useHabitDateSelection } from '../../hooks/useHabitDateSelection';
import { useHabitCelebration } from '../../hooks/useHabitCelebration';
import { useHabitFiltering } from '../../hooks/useHabitFiltering';
import { useHabitCelebrationTrigger } from '../../hooks/useHabitCelebrationTrigger';
import WeeklyCalendar from '../../components/habits/WeeklyCalendar';
import HabitsHeader from '../../components/habits/HabitsHeader';

import HabitsList from '../../components/habits/HabitsList';
import HabitsCelebration from '../../components/habits/HabitsCelebration';
import HabitsFAB from '../../components/habits/HabitsFAB';
import CreateHabitModal from '../fullscreen-modal/CreateHabitScreen';
import Backdrop from '../../components/todo/Backdrop';

export default function HabitsScreen() {
    const { isDark } = useThemeContext();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { habits, toggleHabitToday, deleteHabits } = useHabitsStore();
    // Expo Router Tabs 可能不提供 bottom-tabs context，使用 fallback 计算
    const bottomTabBarHeight = insets.bottom + 49;

    // Modal State
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const expandProgress = useSharedValue(0);

    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // 使用自定义hooks
    const { selectedDate, setSelectedDate, todayIndex, selectedDateObj, isSelectedDateToday } = useHabitDateSelection();
    const { showCelebration, celebrationHabit, triggerCelebration } = useHabitCelebration();
    const { filteredHabits, completedCount } = useHabitFiltering({
        habits,
        isSelectedDateToday,
        selectedDateObj,
        selectedDate,
    });

    // 主题颜色
    const theme = isDark ? HABIT_THEME_COLORS.dark : HABIT_THEME_COLORS.light;

    // 使用庆祝触发hook
    const toggleHabit = useHabitCelebrationTrigger({
        habits,
        selectedDate,
        todayIndex,
        toggleHabitToday,
        triggerCelebration,
    });

    const handleOpenCreateModal = () => {
        if (habits.length >= HABIT_SCREEN_CONSTANTS.MAX_HABITS) {
            Alert.alert(
                t('habits.limitReached'),
                t('habits.limitReachedDesc', { max: HABIT_SCREEN_CONSTANTS.MAX_HABITS }),
                [{ text: t('common.ok') }]
            );
            return;
        }
        setIsCreateModalVisible(true);
        expandProgress.value = withSpring(1, {
            damping: 14,
            stiffness: 100,
            overshootClamping: true,
        });
    };

    const handleCloseCreateModal = () => {
        Keyboard.dismiss();
        expandProgress.value = withTiming(
            0,
            { duration: 300 },
            finished => {
                if (finished) {
                    scheduleOnRN(setIsCreateModalVisible, false);
                }
            },
        );
    };

    const scaleAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: interpolate(
                    expandProgress.value,
                    [0, 1],
                    [1, 0],
                ),
            },
            {
                rotate: `${interpolate(expandProgress.value, [0, 1], [0, 45])}deg`,
            },
        ],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            expandProgress.value,
            [0, 1],
            [0, 0.6],
        ),
        zIndex: expandProgress.value === 0 ? -1 : 90,
    }));

    // Long press to enter edit mode and select the pressed habit
    const handleLongPressHabit = useCallback((id: string) => {
        if (!isEditMode) {
            setIsEditMode(true);
            setSelectedIds([id]);
        }
    }, [isEditMode]);

    const handleSelectionChange = useCallback((id: string) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            }
            return [...prev, id];
        });
    }, []);

    const handleDelete = useCallback(() => {
        Alert.alert(
            t('habits.deleteHabits'),
            t('habits.deleteHabitsConfirm', { count: selectedIds.length }),
            [
                { text: t('common.cancel'), style: "cancel" },
                {
                    text: t('common.delete'),
                    style: "destructive",
                    onPress: () => {
                        deleteHabits(selectedIds);
                        setIsEditMode(false);
                        setSelectedIds([]);
                    }
                }
            ]
        );
    }, [selectedIds, deleteHabits, t]);

    return (
        <View className="flex-1" style={{ backgroundColor: theme.background }}>
            <HabitsHeader
                isDark={isDark}
                textColor={theme.text}
                secondaryTextColor={theme.secondaryText}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={[
                    { paddingHorizontal: 20 },
                    { paddingTop: insets.top + 100, paddingBottom: 100 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                <WeeklyCalendar
                    isDark={isDark}
                    habits={habits}
                    selectedDate={selectedDate}
                    onDateSelected={setSelectedDate}
                />

                <HabitsList
                    habits={filteredHabits}
                    selectedDate={selectedDate}
                    selectedDateObj={selectedDateObj}
                    textColor={theme.text}
                    isDark={isDark}
                    onToggleHabit={toggleHabit}
                    completedCount={completedCount}
                    isEditMode={isEditMode}
                    selectedIds={selectedIds}
                    onSelectionChange={handleSelectionChange}
                    onLongPressHabit={handleLongPressHabit}
                />
            </ScrollView>

            <HabitsCelebration
                show={showCelebration}
                habit={celebrationHabit}
            />

            {/* Floating Edit Mode Bar */}
            {isEditMode && (
                <Animated.View
                    entering={FadeInDown.springify()}
                    exiting={FadeOutDown.springify()}
                    style={{
                        position: 'absolute',
                        bottom: insets.bottom + 20,
                        left: 20,
                        right: 20,
                        zIndex: 100,
                    }}
                    className="flex-row gap-3"
                >
                    {/* Cancel button */}
                    <TouchableOpacity
                        onPress={() => { setIsEditMode(false); setSelectedIds([]); }}
                        className="flex-1 rounded-2xl p-4 flex-row justify-center items-center gap-2"
                        style={{ backgroundColor: isDark ? '#334155' : '#e2e8f0' }}
                        activeOpacity={0.8}
                    >
                        <FontAwesome6 name="xmark" size={18} color={isDark ? '#e2e8f0' : '#475569'} />
                        <Text className="font-bold text-base" style={{ color: isDark ? '#e2e8f0' : '#475569' }}>
                            {t('common.cancel')}
                        </Text>
                    </TouchableOpacity>

                    {/* Delete button */}
                    {selectedIds.length > 0 && (
                        <TouchableOpacity
                            onPress={handleDelete}
                            className="flex-1 bg-red-500 rounded-2xl p-4 flex-row justify-center items-center gap-2 shadow-lg shadow-red-500/30"
                            activeOpacity={0.8}
                        >
                            <FontAwesome6 name="trash-can" size={18} color="white" />
                            <Text className="text-white font-bold text-base">
                                {t('common.delete')} ({selectedIds.length})
                            </Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            )}

            {!isEditMode && (
                <HabitsFAB
                    onPress={handleOpenCreateModal}
                    style={scaleAnimatedStyle}
                />
            )}

            {/* Backdrop */}
            <Backdrop
                isVisible={isCreateModalVisible}
                backdropStyle={backdropStyle}
                onPress={handleCloseCreateModal}
            />

            {/* Create Habit Modal */}
            <CreateHabitModal
                isVisible={isCreateModalVisible}
                expandProgress={expandProgress}
                bottomTabBarHeight={bottomTabBarHeight}
                onClose={handleCloseCreateModal}
                isDark={isDark}
            />
        </View>
    );
}
