import React from 'react';
import { Pressable, View, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HABIT_SCREEN_CONSTANTS } from '../../constant/habits-constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HabitsFABProps {
    onPress: () => void;
    style?: StyleProp<ViewStyle> | any;
}

export default function HabitsFAB({ onPress, style }: HabitsFABProps) {
    const insets = useSafeAreaInsets();

    return (
        <AnimatedPressable
            onPress={onPress}
            className="absolute right-6 w-[48px] h-[48px] rounded-full overflow-hidden"
            style={[
                {
                    bottom: insets.bottom + 16,
                    ...HABIT_SCREEN_CONSTANTS.FAB_SHADOW_CONFIG,
                },
                style,
            ]}
        >
            <View className="w-full h-full bg-violet-500 items-center justify-center">
                <FontAwesome6 name="plus" size={19} color="#fff" />
            </View>
        </AnimatedPressable>
    );
}
