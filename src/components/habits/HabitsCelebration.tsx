import React from 'react';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { type Habit } from '../../constant/mockHabits';

interface HabitsCelebrationProps {
    show: boolean;
    habit: Habit | null;
}

export default function HabitsCelebration({ show, habit }: HabitsCelebrationProps) {
    if (!show || !habit) return null;

    return (
        <Animated.View
            className="absolute inset-0 items-center justify-center z-50"
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(500)}
        >
            <LinearGradient
                colors={['#fbbf24', '#fb923c', '#f59e0b']} // 金色到橙色的渐变
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="p-6 items-center shadow-2xl"
                style={{ borderRadius: 16 }}
            >
                <Animated.Text
                    className="text-2xl mb-4 text-white font-bold"
                    entering={ZoomIn.duration(400).delay(200)}
                >
                    Congratulations!
                </Animated.Text>
                <Animated.Text
                    className="text-white text-xl mb-2 text-center"
                    entering={FadeIn.duration(300).delay(400)}
                >
                    You've completed all your habits!
                </Animated.Text>
            </LinearGradient>
        </Animated.View>
    );
}
