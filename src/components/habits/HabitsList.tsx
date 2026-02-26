import { View, Text, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Svg, { Circle } from 'react-native-svg';
import HabitCard from './HabitCard';
import { type FilteredHabit } from '../../hooks/useHabitFiltering';
import { getHabitTitle } from '../../utils/habit-utils';
import Animated, { FadeInDown } from 'react-native-reanimated';

type HabitsListProps = {
    habits: FilteredHabit[];
    selectedDate: string;
    selectedDateObj: Date;
    textColor: string;
    isDark: boolean;
    onToggleHabit: (habitId: string) => void;
    completedCount: number;
    isEditMode: boolean;
    selectedIds: string[];
    onSelectionChange: (id: string) => void;
    onLongPressHabit: (id: string) => void;
};

const GRID_GAP = 12;
const PARENT_HORIZONTAL_PADDING = 40;

// Mini progress ring component
const RING_SIZE = 32;
const RING_STROKE = 3;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function ProgressRing({ completed, total, isDark }: { completed: number; total: number; isDark: boolean }) {
    const progress = total === 0 ? 0 : completed / total;
    const strokeDashoffset = RING_CIRCUMFERENCE * (1 - progress);
    const isAllDone = total > 0 && completed === total;

    return (
        <View className="flex-row items-center gap-2">
            <View style={{ width: RING_SIZE, height: RING_SIZE }}>
                <Svg width={RING_SIZE} height={RING_SIZE}>
                    {/* Background circle */}
                    <Circle
                        cx={RING_SIZE / 2}
                        cy={RING_SIZE / 2}
                        r={RING_RADIUS}
                        stroke={isDark ? '#334155' : '#e2e8f0'}
                        strokeWidth={RING_STROKE}
                        fill="none"
                    />
                    {/* Progress circle */}
                    <Circle
                        cx={RING_SIZE / 2}
                        cy={RING_SIZE / 2}
                        r={RING_RADIUS}
                        stroke={isAllDone ? '#22c55e' : '#8b5cf6'}
                        strokeWidth={RING_STROKE}
                        fill="none"
                        strokeDasharray={`${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
                    />
                </Svg>
                {isAllDone && (
                    <View className="absolute inset-0 items-center justify-center">
                        <FontAwesome6 name="check" size={12} color="#22c55e" />
                    </View>
                )}
            </View>
            <Text
                className="text-sm font-semibold"
                style={{ color: isAllDone ? '#22c55e' : isDark ? '#94a3b8' : '#64748b' }}
            >
                {completed}/{total}
            </Text>
        </View>
    );
}

export default function HabitsList({
    habits,
    selectedDate,
    selectedDateObj,
    textColor,
    isDark,
    onToggleHabit,
    completedCount,
    isEditMode,
    selectedIds,
    onSelectionChange,
    onLongPressHabit,
}: HabitsListProps) {
    const { width: screenWidth } = useWindowDimensions();
    const cardWidth = (screenWidth - PARENT_HORIZONTAL_PADDING - GRID_GAP) / 2;

    return (
        <View className="flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold" style={{ color: textColor }}>
                    {getHabitTitle(selectedDate, selectedDateObj)}
                </Text>
                {habits.length > 0 && (
                    <ProgressRing
                        completed={completedCount}
                        total={habits.length}
                        isDark={isDark}
                    />
                )}
            </View>

            {/* Two-column grid */}
            <View className="flex-row flex-wrap" style={{ gap: GRID_GAP }}>
                {habits.map(habit => (
                    <View key={habit.id} style={{ width: cardWidth }}>
                        <HabitCard
                            habit={habit}
                            isDark={isDark}
                            isEditable={habit.isEditable}
                            onToggle={() => habit.isEditable && onToggleHabit(habit.id)}
                            isEditMode={isEditMode}
                            isSelected={selectedIds.includes(habit.id)}
                            onSelect={() => onSelectionChange(habit.id)}
                            onLongPress={() => onLongPressHabit(habit.id)}
                        />
                    </View>
                ))}
            </View>

            {habits.length === 0 && (
                <EmptyHabitsView isDark={isDark} textColor={textColor} />
            )}
        </View>
    );
}

type EmptyHabitsViewProps = {
    isDark: boolean;
    textColor: string;
};

function EmptyHabitsView({ isDark, textColor }: EmptyHabitsViewProps) {
    const { t } = useTranslation();

    return (
        <Animated.View
            entering={FadeInDown.delay(100).springify()}
            className="rounded-3xl overflow-hidden"
        >
            <LinearGradient
                colors={isDark ? ['#1e293b', '#0f172a'] : ['#f0fdf4', '#ecfdf5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View className="py-10 px-8">
                {/* Decorative circles */}
                <View
                    className="absolute -top-6 -right-6 w-24 h-24 rounded-full"
                    style={{ backgroundColor: isDark ? 'rgba(34,211,238,0.12)' : 'rgba(16,185,129,0.12)' }}
                />
                <View
                    className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full"
                    style={{ backgroundColor: isDark ? 'rgba(34,211,238,0.08)' : 'rgba(16,185,129,0.08)' }}
                />

                <View className="items-center">
                    <View
                        className="w-20 h-20 rounded-3xl items-center justify-center mb-5"
                        style={{ backgroundColor: isDark ? '#334155' : '#d1fae5' }}
                    >
                        <FontAwesome6
                            name="seedling"
                            size={34}
                            color={isDark ? '#34d399' : '#059669'}
                        />
                    </View>

                    <Text className="text-lg font-bold mb-2" style={{ color: textColor }}>
                        {t('habits.startJourney')}
                    </Text>
                    <Text
                        className="text-sm text-center leading-5"
                        style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                        {t('habits.startJourneyDesc')}
                    </Text>
                </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}
