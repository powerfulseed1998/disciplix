import React from 'react';
import { View, Text, Platform } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

interface HabitsHeaderProps {
    isDark: boolean;
    textColor: string;
    secondaryTextColor: string;
}

export default function HabitsHeader({ isDark, textColor, secondaryTextColor }: HabitsHeaderProps) {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    return (
        <View
            className="absolute w-full z-10 overflow-hidden pb-5"
            style={{ paddingTop: insets.top }}
        >
            {Platform.OS === 'ios' ? (
                <BlurView
                    intensity={80}
                    tint={isDark ? 'dark' : 'light'}
                    className="absolute inset-0"
                />
            ) : (
                <View
                    className="absolute inset-0"
                    style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}
                />
            )}
            <View className="flex-row justify-between items-center px-6 pt-5">
                <View>
                    <Text
                        className="text-sm font-medium mb-1"
                        style={{ color: secondaryTextColor }}
                    >
                        {t('habits.haveGreatDay')}
                    </Text>
                    <Text className="text-[28px] font-bold" style={{ color: textColor }}>
                        {t('habits.myHabits')}
                    </Text>
                </View>
                <View
                    className="w-11 h-11 rounded-full items-center justify-center"
                    style={{ backgroundColor: isDark ? '#334155' : '#f1f5f9' }}
                >
                    <FontAwesome6
                        name="calendar-check"
                        size={18}
                        color={isDark ? '#a78bfa' : '#8b5cf6'}
                    />
                </View>
            </View>
            <View
                className="absolute bottom-0 w-full h-px"
                style={{
                    backgroundColor: isDark
                        ? 'rgba(71, 85, 105, 0.5)'
                        : 'rgba(226, 232, 240, 0.5)',
                }}
            />
        </View>
    );
}
