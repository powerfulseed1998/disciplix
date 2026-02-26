import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, {
    FadeInUp,
    measure,
    useAnimatedRef,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Achievement } from '../../constant/achievements';
import { useRouter } from 'expo-router';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';
import { useAchievementUIStore } from '../../store/useAchievementUIStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type OriginLayout = {
    x: number;
    y: number;
    width: number;
    height: number;
};

const AchievementCard = ({
    achievement,
    isDark,
    index,
}: {
    achievement: Achievement;
    isDark: boolean;
    index: number;
}) => {
    const { t } = useTranslation();
    const router = useRouter();
    const cardRef = useAnimatedRef<Animated.View>();
    const hiddenAchievementId = useAchievementUIStore((state) => state.hiddenAchievementId);
    const isHidden = hiddenAchievementId === achievement.id;

    const progressPercent =
        achievement.progress && achievement.maxProgress
            ? (achievement.progress / achievement.maxProgress) * 100
            : 0;

    const navigateToDetail = (originLayout: OriginLayout) => {
        router.push({
            pathname: '/achievement-detail',
            params: {
                achievement: JSON.stringify(achievement),
                originLayout: JSON.stringify(originLayout),
            },
        });
    };

    const handlePress = () => {
        scheduleOnUI(() => {
            const measurement = measure(cardRef);
            if (measurement === null) return;

            const originLayout = {
                x: measurement.pageX,
                y: measurement.pageY,
                width: measurement.width,
                height: measurement.height,
            };
            scheduleOnRN(navigateToDetail, originLayout);
        });
    };

    return (
        <Animated.View entering={FadeInUp.delay(index * 80).springify()}>
            <Animated.View
                ref={cardRef}
                style={[
                    styles.achievementCard,
                    {
                        backgroundColor: isDark ? '#1e293b' : '#fff',
                        opacity: isHidden ? 0 : (achievement.unlocked ? 1 : 0.7),
                    },
                ]}
            >
                <Pressable
                    onPress={handlePress}
                    style={styles.achievementCardInner}
                >
                    <View
                        style={[
                            styles.achievementIcon,
                            {
                                backgroundColor: achievement.unlocked
                                    ? achievement.color + '20'
                                    : isDark
                                        ? '#334155'
                                        : '#f1f5f9',
                            },
                        ]}
                    >
                        {achievement.unlocked ? (
                            <FontAwesome6
                                name={achievement.icon}
                                size={24}
                                color={achievement.color}
                                solid
                            />
                        ) : (
                            <FontAwesome6
                                name="lock"
                                size={20}
                                color={isDark ? '#64748b' : '#94a3b8'}
                            />
                        )}
                    </View>

                    <Text
                        style={[
                            styles.achievementName,
                            {
                                color: achievement.unlocked
                                    ? isDark
                                        ? '#fff'
                                        : '#1e293b'
                                    : isDark
                                        ? '#64748b'
                                        : '#94a3b8',
                            },
                        ]}
                        numberOfLines={1}
                    >
                        {t(`achievements.items.${achievement.id}.name`, achievement.name)}
                    </Text>

                    {!achievement.unlocked &&
                        achievement.progress !== undefined && (
                            <View style={styles.progressContainer}>
                                <View
                                    style={[
                                        styles.progressBar,
                                        {
                                            backgroundColor: isDark
                                                ? '#334155'
                                                : '#e2e8f0',
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${progressPercent}%`,
                                                backgroundColor: achievement.color,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.progressText,
                                        { color: isDark ? '#64748b' : '#94a3b8' },
                                    ]}
                                >
                                    {achievement.progress}/{achievement.maxProgress}
                                </Text>
                            </View>
                        )}

                    {achievement.unlocked && (
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar} />
                            <Text style={styles.progressText}> </Text>
                        </View>
                    )}
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    achievementCard: {
        width: (SCREEN_WIDTH - 52) / 2,
        borderRadius: 20,
        overflow: 'hidden',
    },
    achievementCardInner: {
        padding: 16,
        alignItems: 'center',
    },
    achievementIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    achievementName: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 4,
    },
    progressBar: {
        width: '100%',
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 10,
        fontWeight: '500',
    },
});

export default AchievementCard;
