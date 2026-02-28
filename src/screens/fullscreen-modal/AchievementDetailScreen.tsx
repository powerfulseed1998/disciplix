import { FontAwesome6 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';
import type { Achievement } from '../../constant/achievements';
import { useThemeContext } from '../../providers/ThemeProvider';
import { useAchievementUIStore } from '../../store/useAchievementUIStore';

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
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const opacity = useSharedValue(0);
  const bgOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    bgOpacity.value = withTiming(1, { duration: 250 });
  }, []);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startScaleX = useSharedValue(1);
  const startScaleY = useSharedValue(1);
  const isClosing = useSharedValue(false);

  const goBack = () => {
    setHiddenAchievementId(null);
    requestAnimationFrame(() => {
      router.back();
    });
  };

  const handleClose = useCallback(() => {
    scheduleOnUI(() => {
      if (isClosing.value) return;
      isClosing.value = true;

      const duration = 280;
      const easing = Easing.out(Easing.cubic);

      contentOpacity.value = withTiming(0, { duration: 120 });
      bgOpacity.value = withTiming(0, { duration, easing: Easing.in(Easing.quad) });

      translateX.value = withTiming(startX.value, { duration, easing });
      translateY.value = withTiming(startY.value, { duration, easing });
      scaleX.value = withTiming(startScaleX.value, { duration, easing });
      scaleY.value = withTiming(startScaleY.value, { duration, easing }, (finished) => {
        if (finished) {
          scheduleOnRN(goBack);
        }
      });
    });
  }, [startX, startY, startScaleX, startScaleY, isClosing, bgOpacity, contentOpacity, translateX, translateY, scaleX, scaleY, goBack]);

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

      const sxVal = originLayout.width / target.width;
      const syVal = originLayout.height / target.height;

      const initialTranslateX = originLayout.x - target.pageX + (target.width * (sxVal - 1)) / 2;
      const initialTranslateY = originLayout.y - target.pageY + (target.height * (syVal - 1)) / 2;

      startX.value = initialTranslateX;
      startY.value = initialTranslateY;
      startScaleX.value = sxVal;
      startScaleY.value = syVal;

      translateX.value = initialTranslateX;
      translateY.value = initialTranslateY;
      scaleX.value = sxVal;
      scaleY.value = syVal;
      opacity.value = 1;

      const springConfig = { damping: 22, stiffness: 220, mass: 1 };
      translateX.value = withSpring(0, springConfig);
      translateY.value = withSpring(0, springConfig);
      scaleX.value = withSpring(1, springConfig);
      scaleY.value = withSpring(1, springConfig);

      contentOpacity.value = withDelay(180, withTiming(1, { duration: 220 }));
    });
  }, [originLayout, cardRef, translateX, translateY, scaleX, scaleY, opacity, contentOpacity, startX, startY, startScaleX, startScaleY]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scaleX: scaleX.value },
      { scaleY: scaleY.value },
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
