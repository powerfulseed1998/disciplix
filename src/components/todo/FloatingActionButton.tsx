import React from 'react';
import { Pressable, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { HABIT_SCREEN_CONSTANTS } from '../../constant/habits-constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FloatingActionButtonProps {
    onPress: () => void;
    scaleAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
    bottomInset: number;
}

const FloatingActionButton = ({
    onPress,
    scaleAnimatedStyle,
    bottomInset,
}: FloatingActionButtonProps) => {
    return (
        <AnimatedPressable
            onPress={onPress}
            className="absolute right-6 w-[48px] h-[48px] rounded-full overflow-hidden"
            style={[
                {
                    bottom: bottomInset + 16,
                    ...HABIT_SCREEN_CONSTANTS.FAB_SHADOW_CONFIG,
                },
                scaleAnimatedStyle,
            ]}
        >
            <View className="w-full h-full bg-violet-500 items-center justify-center">
                <FontAwesome6 name="plus" size={19} color="#fff" />
            </View>
        </AnimatedPressable>
    );
};

export default FloatingActionButton;
