import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { type Habit } from '../../constant/mockHabits';

type HabitCardProps = {
    habit: Habit;
    isDark: boolean;
    onToggle: () => void;
    isEditable?: boolean;
    isEditMode?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
    onLongPress?: () => void;
};

function darkenColor(hex: string, factor = 0.45): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const d = (v: number) => Math.max(0, Math.round(v * factor));
    return `#${d(r).toString(16).padStart(2, '0')}${d(g).toString(16).padStart(2, '0')}${d(b).toString(16).padStart(2, '0')}`;
}

export function HabitCard({
    habit,
    isDark,
    onToggle,
    isEditable = true,
    isEditMode = false,
    isSelected = false,
    onSelect,
    onLongPress,
}: HabitCardProps) {
    const { t } = useTranslation();
    const isPressed = useSharedValue(0);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function handlePressIn() {
        longPressTimer.current = setTimeout(() => {
            isPressed.value = withTiming(1, { duration: 150 });
        }, 300);
    }

    function handlePressOut() {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
        isPressed.value = withTiming(0, { duration: 250 });
    }

    function handlePress() {
        if (isEditMode && onSelect) {
            onSelect();
        } else {
            onToggle();
        }
    }

    function handleLongPress() {
        if (!isEditMode && onLongPress) {
            onLongPress();
        }
    }

    // 仅保留按压 scale 动画，避免与 completion 动画冲突
    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(isPressed.value, [0, 1], [1, 0.95]) }],
    }));

    const gradientColors: [string, string] = [habit.color, darkenColor(habit.color)];
    const isDisabled = !isEditable && !isEditMode;

    return (
        <Pressable
            onPress={handlePress}
            onLongPress={handleLongPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isDisabled}
            delayLongPress={400}
            style={[styles.pressable, { aspectRatio: 0.85, opacity: isDisabled ? 0.6 : 1, borderRadius: isEditMode ? 0 : 24 }]}
        >
            <Animated.View style={[StyleSheet.absoluteFill, cardStyle]}>
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />

                {/* 使用静态 opacity，避免 Reanimated 与 New Arch 导致内容消失 (5995bc0/0b2d749 引入) */}
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        styles.overlay,
                        { opacity: habit.completedToday ? 0 : 0.25 },
                    ]}
                    pointerEvents="none"
                />

                <View style={styles.content}>
                    <View style={styles.topRow}>
                        <View />
                        <View style={styles.checkBadge}>
                            {isEditMode ? (
                                <FontAwesome6
                                    name={isSelected ? 'square-check' : 'square'}
                                    size={20}
                                    color="rgba(255,255,255,0.9)"
                                    solid={isSelected}
                                />
                            ) : (
                                <>
                                    <View
                                        style={[
                                            styles.checkFill,
                                            { opacity: habit.completedToday ? 1 : 0 },
                                        ]}
                                    >
                                        <FontAwesome6 name="check" size={18} color="#fff" />
                                    </View>
                                    <View
                                        style={[
                                            styles.checkEmpty,
                                            { opacity: habit.completedToday ? 0 : 1 },
                                        ]}
                                        pointerEvents="none"
                                    />
                                </>
                            )}
                        </View>
                    </View>

                    <View style={styles.iconRow}>
                        <View style={styles.iconBox}>
                            <FontAwesome6 name={habit.icon} size={26} color="#fff" solid />
                        </View>
                    </View>

                    <View className='h-14'>
                        <Text
                            style={styles.habitName}
                            numberOfLines={1}
                        >
                            {habit.name}
                        </Text>
                        {habit.streak > 0 && (
                            <View style={styles.streakRow}>
                                <FontAwesome6
                                    name="fire"
                                    size={12}
                                    color="rgba(255,255,255,0.9)"
                                />
                                <Text style={styles.streakText}>
                                    {t('habits.streakDays', { count: habit.streak })}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    overlay: {
        backgroundColor: 'black',
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    checkBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    checkFill: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 20,
    },
    checkEmpty: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    iconRow: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    habitName: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    streakRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 4,
    },
    streakText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default HabitCard;
