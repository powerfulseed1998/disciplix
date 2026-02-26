import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '../../types/profile';
import { getTitleByLevel } from '../../utils/level-utils';

// 用户信息卡片组件
interface UserProfileCardProps {
    profile: UserProfile;
    isDark: boolean;
    isGuest?: boolean;
    onLoginPress?: () => void;
}

export default function UserProfileCard({
    profile,
    isDark,
    isGuest,
    onLoginPress,
}: UserProfileCardProps) {
    const { t } = useTranslation();

    return (
        <Animated.View
            entering={FadeInDown.delay(100).springify()}
            className={`rounded-3xl p-6 mt-5 mb-5 overflow-hidden shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'
                }`}
        >
            {/* 装饰背景 */}
            <View
                className="absolute w-[120px] h-[120px] rounded-full"
                style={{
                    right: -40,
                    top: -40,
                    backgroundColor: '#8b5cf620',
                }}
            />

            {/* 头像和基本信息 */}
            <View className="flex-row items-center mb-4">
                <View className="relative">
                    {profile.avatar ? (
                        <Image
                            source={{ uri: profile.avatar }}
                            className="w-[72px] h-[72px] rounded-3xl shadow-lg"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-[72px] h-[72px] rounded-3xl items-center justify-center bg-violet-500 shadow-lg">
                            <Text className="text-2xl font-bold text-white">
                                {profile.name
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')
                                    .substring(0, 2)}
                            </Text>
                        </View>
                    )}
                    <View className="absolute -bottom-1 -right-1 w-7 h-7 rounded-[10px] bg-amber-500 items-center justify-center border-[3px] border-white">
                        <Text className="text-xs font-bold text-white">
                            {profile.level}
                        </Text>
                    </View>
                </View>

                <View className="flex-1 ml-4">
                    <View className="flex-row items-center gap-2 mb-0.5">
                        <Text
                            className={`text-[22px] font-bold ${isDark ? 'text-white' : 'text-slate-800'
                                }`}
                            numberOfLines={1}
                        >
                            {profile.name}
                        </Text>
                    </View>
                    <Text
                        className="text-sm font-semibold mb-1.5"
                        style={{ color: isGuest ? '#94a3b8' : getTitleByLevel(profile.level).color }}
                    >
                        {isGuest
                            ? profile.title
                            : t(`achievements.levelTitles.${getTitleByLevel(profile.level).id}`, getTitleByLevel(profile.level).title)}
                    </Text>
                    {profile.email && (
                        <View className="flex-row items-center gap-1.5">
                            <FontAwesome6
                                name="envelope"
                                size={12}
                                color={isDark ? '#94a3b8' : '#64748b'}
                            />
                            <Text
                                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'
                                    }`}
                                numberOfLines={1}
                            >
                                {profile.email}
                            </Text>
                        </View>
                    )}
                    {isGuest && (
                        <Pressable
                            // 容器样式：白色背景、左右内边距大、圆角、阴影、点击时透明度降低
                            className="w-[50%] bg-[#F0EBFE] dark:bg-[#334155] flex-row items-center justify-center px-2 py-2 rounded-full"
                            onPress={onLoginPress}
                        >
                            {/* 图标：颜色用跟背景一样的紫色，保持协调 */}
                            <FontAwesome6
                                name="arrow-right-to-bracket"
                                size={16}
                                color={isDark ? '#94a3b8' : '#64748b'}
                            />

                            {/* 文字：粗体、紫色 */}
                            <Text className="ml-2 text-indigo-600 dark:text-gray-400 font-bold text-base">
                                {t('common.signIn')}
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>

            {/* 加入时间 */}
            <View className="flex-row items-center gap-2 pt-4 border-t border-slate-200/20">
                <FontAwesome6
                    name="calendar"
                    size={12}
                    color={isDark ? '#94a3b8' : '#64748b'}
                />
                <Text
                    className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                >
                    {t('profile.memberSince', { date: profile.joinDate })}
                </Text>
            </View>
        </Animated.View>
    );
}
