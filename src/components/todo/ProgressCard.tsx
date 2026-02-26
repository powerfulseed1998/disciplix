import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { CountUpText } from './CountUpRenderer';
import ProgressRing from './ProgressRing';

interface ProgressCardProps {
    totalTasks: number;
    completedTasks: number;
    progressValue: number;
    streak?: number;
    xpToday?: number;
    onPress?: () => void;
}

const ProgressCard = memo(({
    totalTasks,
    completedTasks,
    progressValue,
    streak = 0,
    xpToday = 0,
    onPress,
}: ProgressCardProps) => {
    const { t } = useTranslation();

    return (
        <Animated.View
            entering={FadeInDown.delay(100).springify()}
            className="rounded-3xl mb-6 bg-violet-500 overflow-hidden shadow-lg shadow-violet-500/30"
            style={{ elevation: 8 }}
        >
            <Pressable
                onPress={onPress}
                className="p-6"
            >
                {/* Decorations */}
                <View className="absolute -right-[30px] -top-[30px] w-[120px] h-[120px] rounded-full bg-white/10" />
                <View className="absolute -left-[20px] -bottom-[40px] w-[100px] h-[100px] rounded-full bg-white/[0.08]" />
                <View className="absolute right-[60px] -bottom-[20px] w-[60px] h-[60px] rounded-full bg-white/[0.05]" />

                <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-sm font-medium mb-2 text-white/80">
                            {t('todo.dailyProgress')}
                        </Text>
                        <View className="flex-row items-baseline mb-1">
                            <CountUpText
                                style={{
                                    fontSize: 42,
                                    fontWeight: 'bold',
                                    color: '#fff',
                                }}
                                value={completedTasks}
                            />
                            <Text className="text-3xl mx-1 text-white/50">/</Text>
                            <Text className="text-3xl font-semibold text-white/70">
                                {totalTasks}
                            </Text>
                        </View>
                        <Text className="text-[13px] text-white/70">
                            {completedTasks === totalTasks && totalTasks > 0
                                ? t('todo.allDone')
                                : t('todo.tasksRemaining', { count: totalTasks - completedTasks })}
                        </Text>
                    </View>
                    <ProgressRing progress={progressValue} />
                </View>

                <View className="flex-row items-center mt-5 pt-4 border-t border-white/15">
                    <View className="flex-row items-center gap-2">
                        <FontAwesome6
                            name="fire"
                            size={14}
                            color="rgba(255,255,255,0.8)"
                        />
                        <Text className="text-[13px] font-medium text-white/80">
                            {t('todo.dayStreak', { count: streak })}
                        </Text>
                    </View>
                    <View className="w-[1px] h-4 bg-white/20 mx-4" />
                    <View className="flex-row items-center gap-2">
                        <FontAwesome6
                            name="bolt"
                            size={14}
                            color="rgba(255,255,255,0.8)"
                        />
                        <Text className="text-[13px] font-medium text-white/80">
                            {t('todo.xpToday', { count: xpToday })}
                        </Text>
                    </View>
                    {/* 向右箭头图标 */}
                    {/* <View className="ml-auto">
                        <FontAwesome6
                            name="chevron-right"
                            size={14}
                            color="rgba(255,255,255,0.8)"
                        />
                    </View> */}
                </View>
            </Pressable>
        </Animated.View>
    );
});

export default ProgressCard;
