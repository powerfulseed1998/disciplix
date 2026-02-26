import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
    createAnimatedComponent,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const AnimatedCircle = createAnimatedComponent(Circle);

interface ProgressRingProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    isDark: boolean;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
    progress,
    size = 120,
    strokeWidth = 10,
    isDark,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progressValue = useSharedValue(0);

    useEffect(() => {
        progressValue.value = withTiming(progress, {
            duration: 1000,
            easing: Easing.out(Easing.cubic),
        });
    }, [progress]);

    // 使用 useAnimatedProps 驱动 SVG 动画
    const animatedCircleProps = useAnimatedProps(() => {
        const strokeDashoffset =
            circumference - (progressValue.value / 100) * circumference;
        return {
            strokeDashoffset,
        };
    });

    return (
        <View
            style={{
                width: size,
                height: size,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Svg width={size} height={size} style={{ position: 'absolute' }}>
                <Defs>
                    <LinearGradient
                        id="progressGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <Stop offset="0%" stopColor="#8b5cf6" />
                        <Stop offset="100%" stopColor="#ec4899" />
                    </LinearGradient>
                </Defs>
                {/* Background circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={isDark ? '#334155' : '#e2e8f0'}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    animatedProps={animatedCircleProps}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
            <View style={{ alignItems: 'center' }}>
                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: 'bold',
                        color: isDark ? '#fff' : '#1e293b',
                    }}
                >
                    {Math.round(progress)}%
                </Text>
                <Text
                    style={{
                        fontSize: 10,
                        color: isDark ? '#94a3b8' : '#64748b',
                        marginTop: 2,
                    }}
                >
                    Today's Progress
                </Text>
            </View>
        </View>
    );
};

export default ProgressRing;
