import React, { useEffect } from 'react';
import { View } from 'react-native';
import {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { CountUpText } from './CountUpRenderer';
import Animated from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Progress Ring Component
const ProgressRing = ({
    progress,
    size = 80,
    strokeWidth = 8,
}: {
    progress: number;
    size?: number;
    strokeWidth?: number;
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        animatedProgress.value = withTiming(progress, {
            duration: 350,
            easing: Easing.linear,
        });
    }, [progress]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset =
            circumference - (animatedProgress.value / 100) * circumference;
        return {
            strokeDashoffset,
        };
    });

    return (
        <View
            className="items-center justify-center"
            style={{ width: size, height: size }}
        >
            <Svg width={size} height={size} style={{ position: 'absolute' }}>
                <Defs>
                    <LinearGradient
                        id="ringGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <Stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                        <Stop
                            offset="100%"
                            stopColor="#fff"
                            stopOpacity="0.6"
                        />
                    </LinearGradient>
                </Defs>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#ringGradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    animatedProps={animatedProps}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
            <CountUpText
                style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}
                value={Math.round(progress)}
                suffix="%"
            />
        </View>
    );
};

export default ProgressRing;
