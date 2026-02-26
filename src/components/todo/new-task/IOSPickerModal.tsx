import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

type IOSPickerModalProps = {
    showPicker: boolean;
    pickerMode: 'date' | 'time';
    taskTime: Date;
    pickerProgress: Animated.SharedValue<number>;
    onTimeChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
    onCancel: () => void;
    onDone: () => void;
    isDark: boolean;
};

export function IOSPickerModal({
    showPicker,
    pickerMode,
    taskTime,
    pickerProgress,
    onTimeChange,
    onCancel,
    onDone,
    isDark,
}: IOSPickerModalProps) {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const cardBg = isDark ? '#1e293b' : '#ffffff';
    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryColor = isDark ? '#94a3b8' : '#64748b';
    const inputBorder = isDark ? '#334155' : '#e2e8f0';

    const pickerBackdropStyle = useAnimatedStyle(() => ({
        opacity: pickerProgress.value,
        zIndex: interpolate(pickerProgress.value, [0, 0.01], [-1, 101]),
    }));

    const pickerContainerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(pickerProgress.value, [0, 1], [350, 0]) },
        ],
    }));

    if (!showPicker) return null;

    return (
        <Animated.View
            className="absolute inset-0"
            style={pickerBackdropStyle}
            pointerEvents="box-none"
        >
            <Pressable
                className="absolute inset-0 bg-black/50"
                onPress={onCancel}
            />

            <Animated.View
                className="absolute bottom-0 left-0 right-0 rounded-t-[24px]"
                style={[
                    { backgroundColor: cardBg, paddingBottom: insets.bottom + 10 },
                    pickerContainerStyle,
                ]}
            >
                <View className="flex-row justify-between items-center py-4 px-5 border-b" style={{ borderBottomColor: inputBorder }}>
                    <Pressable onPress={onCancel} className="px-2 py-1">
                        <Text className="text-base" style={{ color: secondaryColor }}>{t('common.cancel')}</Text>
                    </Pressable>
                    <Text className="text-base font-semibold" style={{ color: textColor }}>
                        {pickerMode === 'date' ? t('todo.selectDate') : t('todo.selectTime')}
                    </Text>
                    <Pressable onPress={onDone} className="px-2 py-1">
                        <Text className="text-base font-semibold text-[#8b5cf6]">{t('common.done')}</Text>
                    </Pressable>
                </View>

                <DateTimePicker
                    key={pickerMode}
                    value={taskTime}
                    mode={pickerMode}
                    display="spinner"
                    onChange={onTimeChange}
                    textColor={textColor}
                    themeVariant={isDark ? 'dark' : 'light'}
                    style={{ height: 216 }}
                />
            </Animated.View>
        </Animated.View>
    );
}
