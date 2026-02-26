import React, { useCallback } from 'react';
import { View, Text, Pressable, Switch } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    FadeInDown,
} from 'react-native-reanimated';
import { MenuItem } from '../../types/profile';

// 设置菜单项组件
interface SettingsMenuItemProps {
    item: MenuItem;
    index: number;
    isDark: boolean;
    onPress?: () => void;
}

export default function SettingsMenuItem({
    item,
    index,
    isDark,
    onPress,
}: SettingsMenuItemProps) {
    const scale = useSharedValue(1);

    const handlePress = useCallback(() => {
        if (item.hasToggle) return;
        onPress?.();
    }, [onPress, item.hasToggle]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
            <Animated.View style={animatedStyle}>
                <Pressable
                    onPress={handlePress}
                    className={`flex-row items-center justify-between p-4 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'
                        }`}
                >
                    <View className="flex-row items-center gap-3.5">
                        <View
                            className="w-10 h-10 rounded-xl items-center justify-center"
                            style={{
                                backgroundColor: (item.color || '#8b5cf6') + '20',
                            }}
                        >
                            <FontAwesome6
                                name={item.icon}
                                size={16}
                                color={item.color || '#8b5cf6'}
                                solid
                            />
                        </View>
                        <Text
                            className={`text-[15px] font-semibold ${isDark ? 'text-white' : 'text-slate-800'
                                }`}
                        >
                            {item.label}
                        </Text>
                    </View>

                    {item.hasToggle ? (
                        <Switch
                            value={item.toggleValue}
                            onValueChange={onPress}
                            trackColor={{
                                false: isDark ? '#334155' : '#e2e8f0',
                                true: '#8b5cf6',
                            }}
                            thumbColor="#fff"
                        />
                    ) : (
                        <View className="flex-row items-center gap-2">
                            {item.value && (
                                <Text
                                    className={`text-[13px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'
                                        }`}
                                >
                                    {item.value}
                                </Text>
                            )}
                            <FontAwesome6
                                name="chevron-right"
                                size={14}
                                color={isDark ? '#475569' : '#cbd5e1'}
                            />
                        </View>
                    )}
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
}
