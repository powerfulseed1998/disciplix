import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../providers/ThemeProvider';
import Animated, {
    useAnimatedStyle,
    withTiming,
    interpolate,
    useSharedValue,
} from 'react-native-reanimated';
import ContactUsContent from '../../components/help-support/ContactUsContent';

function RenderSectionHeader(title: string, isDark: boolean) {
    return (
        <Text
            className={`text-sm font-bold uppercase mb-3 ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
        >
            {title}
        </Text>
    );
}

interface ActionItemProps {
    label: string;
    icon: string;
    color: string;
    isDark: boolean;
    children?: React.ReactNode;
}

function ActionItem({ label, icon, color, isDark, children }: ActionItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const iconRotateProgress = useSharedValue(0);

    const contentHeight = useSharedValue(0);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        iconRotateProgress.value = withTiming(isOpen ? 0 : 1, {
            duration: 300,
        });
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(isOpen ? contentHeight.value : 0, {
                duration: 300,
            }),
        };
    });

    const chevronAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${interpolate(iconRotateProgress.value, [0, 1], [0, 90])}deg`,
                },
            ],
        };
    });

    return (
        <>
            <Pressable
                className={`
                    flex-row items-center justify-between p-4 rounded-xl mb-3
                    ${isDark ? 'bg-slate-800' : 'bg-white'}
                    ${isOpen ? 'rounded-b-none' : ''}
                `}
                onPress={handleToggle}
            >
                <View className="flex-row items-center gap-3">
                    <View
                        className={`
                            w-8 h-8 items-center justify-center bg-opacity-10
                            ${isDark ? 'bg-slate-700' : 'bg-slate-200'}
                        `}
                    >
                        <FontAwesome6 name={icon} size={14} color={color} />
                    </View>
                    <Text
                        className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}
                    >
                        {label}
                    </Text>
                </View>
                <Animated.View style={chevronAnimatedStyle}>
                    <FontAwesome6
                        name="chevron-right"
                        size={14}
                        color={isDark ? '#64748b' : '#94a3b8'}
                    />
                </Animated.View>
            </Pressable>

            {/* 带动画的下推view */}
            {children && (
                <Animated.View
                    className={`overflow-hidden -mt-3 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                    style={animatedStyle}
                >
                    <View
                        style={{ position: 'absolute', width: '100%', top: 0 }}
                        onLayout={event => {
                            // 获取内容的真实高度
                            contentHeight.value =
                                event.nativeEvent.layout.height;
                        }}
                    >
                        {children}
                    </View>
                </Animated.View>
            )}
        </>
    );
}

export default function HelpAndSupportScreen() {
    const { isDark } = useThemeContext();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    return (
        <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <ScrollView
                className="flex-1 px-5"
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Support */}
                <View className="mt-4 mb-6">
                    {RenderSectionHeader(t('settings.help.support'), isDark)}
                    <ActionItem
                        label={t('settings.help.contactUs')}
                        icon="envelope"
                        color="#10b981"
                        isDark={isDark}
                    >
                        <ContactUsContent isDark={isDark} />
                    </ActionItem>
                </View>

                {/* Legal */}
                {/* <View className="mb-6">
          {renderSectionHeader('Legal', isDark)}
          <ActionItem></ActionItem>
        </View> */}
            </ScrollView>
        </View>
    );
}
