import React, { useEffect } from 'react';
import { View, Text, Modal, Dimensions, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    withDelay,
    Easing,
    runOnJS,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useThemeContext } from '../../providers/ThemeProvider';
import { Achievement, RARITY_COLORS } from '../../constant/achievements';

const { width, height } = Dimensions.get('window');

type Props = {
    visible: boolean;
    achievement: Achievement | null;
    xpReward?: number;
    onClose: () => void;
};

export default function AchievementUnlockAnimation({
    visible,
    achievement,
    xpReward = 500,
    onClose,
}: Props) {
    const { isDark } = useThemeContext();

    // 动画值
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const badgeRotate = useSharedValue(0);
    const badgeScale = useSharedValue(0);
    const sparkleScale = useSharedValue(0);
    const sparkleOpacity = useSharedValue(0);
    const textY = useSharedValue(50);
    const textOpacity = useSharedValue(0);
    const xpY = useSharedValue(30);
    const xpOpacity = useSharedValue(0);

    useEffect(() => {
        if (visible && achievement) {
            // 重置所有动画值
            scale.value = 0;
            opacity.value = 0;
            badgeRotate.value = 0;
            badgeScale.value = 0;
            sparkleScale.value = 0;
            sparkleOpacity.value = 0;
            textY.value = 50;
            textOpacity.value = 0;
            xpY.value = 30;
            xpOpacity.value = 0;

            // 开始动画序列
            // 1. 背景淡入
            opacity.value = withTiming(1, { duration: 300 });

            // 2. 徽章旋转放大入场（平滑无回弹）
            badgeRotate.value = withSequence(
                withTiming(-15, { duration: 0 }),
                withTiming(0, {
                    duration: 600,
                    easing: Easing.out(Easing.back(1.1)), // 轻微的回弹感但不震荡
                })
            );
            badgeScale.value = withDelay(
                100,
                withTiming(1, {
                    duration: 600,
                    easing: Easing.out(Easing.back(1.2)), // 轻微超调后停止
                })
            );

            // 3. 火花效果
            sparkleScale.value = withDelay(
                300,
                withSequence(
                    withTiming(1.5, { duration: 400, easing: Easing.out(Easing.cubic) }),
                    withTiming(0, { duration: 200 })
                )
            );
            sparkleOpacity.value = withDelay(
                300,
                withSequence(
                    withTiming(1, { duration: 200 }),
                    withTiming(0, { duration: 400 })
                )
            );

            // 4. 文字滑入（平滑无晃动）
            textY.value = withDelay(
                400,
                withTiming(0, {
                    duration: 500,
                    easing: Easing.out(Easing.cubic)
                })
            );
            textOpacity.value = withDelay(
                400,
                withTiming(1, { duration: 400 })
            );

            // 5. XP 奖励动画（平滑无晃动）
            xpY.value = withDelay(
                600,
                withTiming(0, {
                    duration: 400,
                    easing: Easing.out(Easing.cubic)
                })
            );
            xpOpacity.value = withDelay(
                600,
                withTiming(1, { duration: 400 })
            );

            const timer = setTimeout(() => {
                handleClose();
            }, 5 * 1000);

            return () => clearTimeout(timer);
        }
    }, [visible, achievement]);

    const handleClose = () => {
        // 淡出动画
        opacity.value = withTiming(0, { duration: 300 }, () => {
            runOnJS(onClose)();
        });
        badgeScale.value = withTiming(0.8, { duration: 300 });
        textOpacity.value = withTiming(0, { duration: 200 });
        xpOpacity.value = withTiming(0, { duration: 200 });
    };

    // 动画样式
    const containerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const badgeContainerStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${badgeRotate.value}deg` },
            { scale: badgeScale.value },
        ],
    }));

    const sparkleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: sparkleScale.value }],
        opacity: sparkleOpacity.value,
    }));

    const textStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: textY.value }],
        opacity: textOpacity.value,
    }));

    const xpStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: xpY.value }],
        opacity: xpOpacity.value,
    }));

    if (!achievement) return null;

    const rarityConfig = RARITY_COLORS[achievement.rarity];
    const textColor = isDark ? '#fff' : '#1e293b';

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
        >
            <Animated.View style={[styles.container, containerStyle]}>
                <BlurView
                    intensity={100}
                    tint={'dark'}
                    style={StyleSheet.absoluteFill}
                />

                {/* 点击背景关闭 */}
                <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

                {/* 装饰性背景圆圈 */}
                <View style={styles.decorativeCirclesContainer} pointerEvents="none">
                    <Animated.View
                        style={[
                            styles.decorativeCircle,
                            {
                                backgroundColor: `${rarityConfig.bg}20`,
                                width: 300,
                                height: 300,
                                top: height * 0.2,
                                left: -100,
                            },
                            sparkleStyle,
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.decorativeCircle,
                            {
                                backgroundColor: `${rarityConfig.bg}15`,
                                width: 200,
                                height: 200,
                                top: height * 0.5,
                                right: -50,
                            },
                            sparkleStyle,
                        ]}
                    />
                </View>
                {/* Card Container */}
                <Animated.View className="
                  bg-white dark:bg-[#1e293b] p-10 rounded-[48px] shadow-2xl items-center
                    w-[92%] border border-slate-100 dark:border-slate-800
                ">
                    <Pressable
                        onPress={handleClose}
                        className="absolute top-6 right-6 z-50 p-2"
                        hitSlop={12}
                    >
                        <FontAwesome6 name="xmark" size={24} color={isDark ? '#fff' : '#000'} />
                    </Pressable>
                    <View style={styles.content}>
                        {/* 徽章容器 */}
                        <Animated.View style={[styles.badgeContainer, badgeContainerStyle]}>
                            {/* 火花效果 */}
                            <Animated.View
                                style={[
                                    styles.sparkleContainer,
                                    { backgroundColor: `${rarityConfig.bg}30` },
                                    sparkleStyle,
                                ]}
                            />

                            {/* 徽章背景 */}
                            <View
                                style={[
                                    styles.badgeBackground,
                                    {
                                        backgroundColor: isDark ? '#1e293b' : '#fff',
                                        shadowColor: rarityConfig.bg,
                                    },
                                ]}
                            >
                                {/* 稀有度边框 */}
                                <View
                                    style={[
                                        styles.rarityBorder,
                                        { borderColor: rarityConfig.bg },
                                    ]}
                                />

                                {/* 图标 */}
                                <FontAwesome6
                                    name={achievement.icon as any}
                                    size={64}
                                    color={achievement.color}
                                    solid
                                />
                            </View>
                        </Animated.View>

                        {/* 文字信息 */}
                        <Animated.View style={[styles.textContainer, textStyle]}>
                            <Text style={[styles.unlockText, { color: rarityConfig.bg }]}>
                                🎉 Badge Unlocked!
                            </Text>
                            <Text style={[styles.achievementName, { color: textColor }]}>
                                {achievement.name}
                            </Text>
                            <Text
                                style={[
                                    styles.achievementDescription,
                                    { color: isDark ? '#94a3b8' : '#64748b' },
                                ]}
                            >
                                {achievement.description}
                            </Text>
                        </Animated.View>

                        {/* XP 奖励 */}
                        <Animated.View
                            style={[
                                styles.xpContainer,
                                { backgroundColor: `${rarityConfig.bg}20` },
                                xpStyle,
                            ]}
                        >
                            <FontAwesome6 name="star" size={16} color={rarityConfig.bg} solid />
                            <Text style={[styles.xpText, { color: rarityConfig.bg }]}>
                                +{xpReward} XP
                            </Text>
                        </Animated.View>
                    </View>
                </Animated.View>

            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    decorativeCirclesContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    decorativeCircle: {
        position: 'absolute',
        borderRadius: 9999,
    },
    content: {
        alignItems: 'center',
        width: width * 0.85,
    },
    badgeContainer: {
        marginBottom: 32,
    },
    sparkleContainer: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        top: -20,
        left: -20,
    },
    badgeBackground: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    rarityBorder: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 4,
    },
    textContainer: {
        alignItems: 'center',
    },
    unlockText: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 12,
    },
    achievementName: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 8,
        textAlign: 'center',
    },
    achievementDescription: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    rarityBadge: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    rarityText: {
        fontSize: 20,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    xpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 20,
    },
    xpText: {
        fontSize: 14,
        fontWeight: '800',
    },
    closeHint: {
        position: 'absolute',
        bottom: 60,
    },
    closeHintText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
