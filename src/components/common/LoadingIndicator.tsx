import React, { useEffect } from 'react';
import { View, Text, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
    FadeIn,
    FadeOut,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useThemeContext } from '../../providers/ThemeProvider';

interface LoadingIndicatorProps {
    visible: boolean;
    text?: string;
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
}

export default function LoadingIndicator({
    visible,
    text = 'Loading...',
    size = 60,
    strokeWidth = 4,
    color,
    backgroundColor,
}: LoadingIndicatorProps) {
    const { isDark } = useThemeContext();

    // 旋转动画
    const rotation = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    useEffect(() => {
        if (visible) {
            rotation.value = withRepeat(
                withTiming(360, { duration: 1000, easing: Easing.linear }),
                -1,
                false,
            );
        }
    }, [visible]);

    if (!visible) return null;

    const defaultColor = isDark ? '#60a5fa' : '#3b82f6';
    const defaultBgColor = isDark ? '#374151' : '#f3f4f6';

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            presentationStyle="overFullScreen"
        >
            <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(150)}
                className="flex-1 justify-center items-center"
            >
                {/* 半透明背景 */}
                <BlurView
                    intensity={25}
                    tint={isDark ? 'dark' : 'light'}
                    className="absolute inset-0"
                />

                {/* 内容容器 */}
                <Animated.View
                    entering={FadeIn.duration(300).delay(100)}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 mx-6 shadow-2xl border border-white/20 dark:border-gray-700/50"
                    style={{
                        minWidth: size + 80,
                        minHeight: size + 80,
                    }}
                >
                    <View className="flex-1 justify-center items-center gap-y-6">
                        {/* 圆形进度指示器 */}
                        <Animated.View style={animatedStyle}>
                            <AnimatedCircularProgress
                                size={size}
                                width={strokeWidth}
                                fill={75}
                                tintColor={color || defaultColor}
                                backgroundColor={
                                    backgroundColor || defaultBgColor
                                }
                                rotation={0}
                                lineCap="round"
                            />
                        </Animated.View>

                        {/* 文本 */}
                        {text && (
                            <Text className="text-gray-700 dark:text-gray-300 text-center text-base font-medium tracking-wide">
                                {text}
                            </Text>
                        )}
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}
