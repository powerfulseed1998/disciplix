import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, BackHandler } from 'react-native';
import Animated, {
    measure,
    useAnimatedRef,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useThemeContext } from '../../providers/ThemeProvider';
import { useRouter, useLocalSearchParams } from 'expo-router';
import type { Achievement } from '../../constant/achievements';
import { useAchievementUIStore } from '../../store/useAchievementUIStore';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // 左右 margin 24

export default function AchievementDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        achievement?: string;
        originLayout?: string;
    }>();
    const originLayout = params.originLayout
        ? (JSON.parse(params.originLayout) as { x: number; y: number; width: number; height: number })
        : undefined;
    const achievement: Achievement | null = params.achievement
        ? JSON.parse(params.achievement)
        : null;

    const { t } = useTranslation();
    const { isDark } = useThemeContext();
    const setHiddenAchievementId = useAchievementUIStore((state) => state.setHiddenAchievementId);

    useEffect(() => {
        if (achievement?.id) {
            setHiddenAchievementId(achievement.id);
        }
        return () => {
            setHiddenAchievementId(null);
        };
    }, [achievement?.id, setHiddenAchievementId]);

    const cardRef = useAnimatedRef<Animated.View>();
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0);
    const bgOpacity = useSharedValue(0);
    const contentOpacity = useSharedValue(0);

    useEffect(() => {
        bgOpacity.value = withTiming(1, { duration: 250 });
    }, []);

    const startX = useSharedValue(0);
    const startY = useSharedValue(0);
    const startScale = useSharedValue(1);
    const isClosing = useSharedValue(false);

    const goBack = useCallback(() => {
        router.back();
    }, [router]);

    const handleClose = useCallback(() => {
        setHiddenAchievementId(null);

        scheduleOnUI(() => {
            if (isClosing.value) return;
            isClosing.value = true;

            const duration = 280;
            const easing = Easing.out(Easing.cubic);

            contentOpacity.value = withTiming(0, { duration: 120 });
            bgOpacity.value = withTiming(0, { duration, easing: Easing.in(Easing.quad) });

            translateX.value = withTiming(startX.value, { duration, easing });
            translateY.value = withTiming(startY.value, { duration, easing });
            scale.value = withTiming(startScale.value, { duration, easing });

            opacity.value = withDelay(200, withTiming(0, { duration: 80 }, (finished) => {
                if (finished) {
                    scheduleOnRN(goBack);
                }
            }));
        });
    }, [startX, startY, startScale, isClosing, bgOpacity, contentOpacity, opacity, translateX, translateY, scale, setHiddenAchievementId, goBack]);

    useEffect(() => {
        const onBackPress = () => {
            handleClose();
            return true;
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove();
    }, [handleClose]);

    const handleLayout = useCallback(() => {
        if (!originLayout) {
            opacity.value = withTiming(1);
            contentOpacity.value = withDelay(100, withTiming(1, { duration: 200 }));
            return;
        }

        scheduleOnUI(() => {
            const target = measure(cardRef);
            if (!target) {
                opacity.value = withTiming(1);
                contentOpacity.value = withDelay(100, withTiming(1, { duration: 200 }));
                return;
            }

            const uniformScale = originLayout.width / target.width;

            const initialTranslateX = originLayout.x - target.pageX + (target.width * (uniformScale - 1)) / 2;
            const initialTranslateY = originLayout.y - target.pageY + (target.height * (uniformScale - 1)) / 2;

            startX.value = initialTranslateX;
            startY.value = initialTranslateY;
            startScale.value = uniformScale;

            translateX.value = initialTranslateX;
            translateY.value = initialTranslateY;
            scale.value = uniformScale;
            opacity.value = 1;

            const springConfig = { damping: 22, stiffness: 220, mass: 1 };
            translateX.value = withSpring(0, springConfig);
            translateY.value = withSpring(0, springConfig);
            scale.value = withSpring(1, springConfig);

            contentOpacity.value = withDelay(180, withTiming(1, { duration: 220 }));
        });
    }, [originLayout, cardRef, translateX, translateY, scale, opacity, contentOpacity, startX, startY, startScale]);

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    const bgAnimatedStyle = useAnimatedStyle(() => ({
        opacity: bgOpacity.value,
    }));

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
    }));

    if (!achievement) return null;

    return (
        <View style={styles.container}>

            {/* 1. 背景遮罩 (FadeIn 负责渐入) */}
            <Animated.View
                style={[StyleSheet.absoluteFill, bgAnimatedStyle]}
            >
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' }} />

                {/* 点击背景关闭 */}
                <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
            </Animated.View>

            {/* 2. 主卡片内容 */}
            <View style={styles.cardWrapper}>
                <Animated.View
                    ref={cardRef}
                    onLayout={handleLayout}
                    style={[
                        styles.card,
                        { backgroundColor: isDark ? '#1e293b' : '#fff' },
                        containerAnimatedStyle
                    ]}
                >

                    {/* 关闭按钮 */}
                    <Animated.View style={[styles.closeBtn, contentAnimatedStyle]}>
                        <Pressable onPress={handleClose}>
                            <FontAwesome6 name="xmark" size={20} color="#94a3b8" />
                        </Pressable>
                    </Animated.View>

                    <View
                        style={styles.iconContainer}
                    >
                        <View
                            style={[
                                styles.iconBox,
                                { backgroundColor: achievement.color + '20' },
                            ]}
                        >
                            <FontAwesome6 name={achievement.icon} size={50} color={achievement.color} />
                        </View>
                    </View>

                    <Text
                        style={[
                            styles.detailName,
                            { color: isDark ? '#fff' : '#000' },
                        ]}
                    >
                        {t(`achievements.items.${achievement.id}.name`, achievement.name)}
                    </Text>

                    <Animated.View
                        style={[styles.detailContent, contentAnimatedStyle]}
                    >
                        <Text style={styles.detailDescription}>
                            {t(`achievements.items.${achievement.id}.description`, achievement.description)}
                        </Text>

                        <View style={[
                            styles.statusBadge,
                            achievement.unlockedAt
                                ? { backgroundColor: 'rgba(16, 185, 129, 0.1)' }
                                : { backgroundColor: 'rgba(242, 247, 252, 0.5)' },
                        ]}>
                            {achievement.unlockedAt ? (
                                <Text style={{ color: '#10b981', fontWeight: '600' }}>
                                    {t('achievements.unlockedOn', { date: new Date(achievement.unlockedAt).toLocaleDateString() })}
                                </Text>
                            ) : (
                                <Text style={{ color: '#94a3b8', fontWeight: '600' }}>
                                    {t('achievements.notUnlocked')}
                                </Text>
                            )}
                        </View>
                    </Animated.View>

                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    cardWrapper: {
        width: CARD_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        borderRadius: 40,
        alignItems: 'center',
        overflow: 'hidden',
    },
    closeBtn: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
        padding: 5,
    },
    iconContainer: {
        marginTop: 32,
        marginBottom: 24,
    },
    iconBox: {
        width: 112,
        height: 112,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailName: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    detailContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    detailDescription: {
        textAlign: 'center',
        color: '#94a3b8',
        lineHeight: 22,
    },
    statusBadge: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
});
