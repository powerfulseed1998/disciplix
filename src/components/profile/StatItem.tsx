import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

// 统计卡片组件
interface StatItemProps {
    label: string;
    value: number;
    icon: string;
    color: string;
    isDark: boolean;
    index: number;
}

export default function StatItem({
    label,
    value,
    icon,
    color,
    isDark,
    index,
}: StatItemProps) {
    const { t } = useTranslation();

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 80).springify()}
            className={`flex-1 p-3 rounded-2xl items-center justify-center ${
                isDark ? 'bg-slate-800' : 'bg-white'
            }`}
        >
            <View
                className="w-9 h-9 rounded-xl items-center justify-center mb-2"
                style={{ backgroundColor: color + '20' }}
            >
                <FontAwesome6 name={icon} size={14} color={color} solid />
            </View>
            <Text
                className={`text-xl font-bold mb-0.5 text-center ${
                    isDark ? 'text-white' : 'text-slate-800'
                }`}
            >
                {value}
            </Text>
            <Text
                className={`text-[10px] font-medium text-center ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
                numberOfLines={1}
            >
                {t(label)}
            </Text>
        </Animated.View>
    );
}
