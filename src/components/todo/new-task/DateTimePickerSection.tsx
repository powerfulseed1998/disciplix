import React from 'react';
import { View, Text, Pressable, Platform, Switch } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

type DateTimePickerSectionProps = {
    taskTime: Date;
    isAllDay: boolean;
    setIsAllDay: (val: boolean) => void;
    addToAlarm: boolean;
    setAddToAlarm: (val: boolean) => void;
    onOpenPicker: (mode: 'date' | 'time') => void;
    isDark: boolean;
};

export function DateTimePickerSection({
    taskTime,
    isAllDay,
    setIsAllDay,
    addToAlarm,
    setAddToAlarm,
    onOpenPicker,
    isDark,
}: DateTimePickerSectionProps) {
    const { t } = useTranslation();
    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryColor = isDark ? '#94a3b8' : '#64748b';
    const inputBg = isDark ? '#0f172a' : '#f8fafc';
    const inputBorder = isDark ? '#334155' : '#e2e8f0';

    const formattedTime = taskTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const formatDate = (date: Date) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return t('common.today');
        if (date.toDateString() === tomorrow.toDateString()) return t('common.tomorrow');
        return date.toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
        });
    };

    return (
        <View className="gap-4">
            {/* Date Picker */}
            <View>
                <View className="flex-row items-center gap-2 mb-3">
                    <FontAwesome6 name="calendar-days" size={12} color="#8b5cf6" />
                    <Text className="text-sm font-semibold" style={{ color: textColor }}>{t('todo.date')}</Text>
                </View>
                <Pressable
                    onPress={() => onOpenPicker('date')}
                    className="flex-row items-center justify-between px-4 py-3 rounded-[16px] border"
                    style={{ backgroundColor: inputBg, borderColor: inputBorder }}
                >
                    <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-[12px] items-center justify-center bg-[#8b5cf620]">
                            <FontAwesome6 name="calendar" size={16} color="#8b5cf6" />
                        </View>
                        <Text className="text-lg font-semibold" style={{ color: textColor }}>
                            {formatDate(taskTime)}
                        </Text>
                    </View>
                    <FontAwesome6 name="chevron-right" size={12} color={secondaryColor} />
                </Pressable>
            </View>

            {/* Time Picker */}
            <View>
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-2">
                        <FontAwesome6 name="clock" size={12} color="#8b5cf6" />
                        <Text className="text-sm font-semibold" style={{ color: textColor }}>{t('todo.time')}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Text className="text-xs" style={{ color: secondaryColor }}>{t('common.allDay')}</Text>
                        <Switch
                            value={isAllDay}
                            onValueChange={setIsAllDay}
                            trackColor={{ false: inputBorder, true: '#8b5cf6' }}
                            thumbColor="#fff"
                            style={{ transform: [{ scale: 0.8 }] }}
                        />
                    </View>
                </View>
                <Pressable
                    onPress={isAllDay ? undefined : () => onOpenPicker('time')}
                    className="flex-row items-center justify-between px-4 py-3 rounded-[16px] border"
                    style={{
                        backgroundColor: inputBg,
                        borderColor: inputBorder,
                        opacity: isAllDay ? 0.6 : 1,
                    }}
                    disabled={isAllDay}
                >
                    <View className="flex-row items-center gap-3">
                        <View
                            className="w-10 h-10 rounded-[12px] items-center justify-center"
                            style={{ backgroundColor: isAllDay ? '#94a3b820' : '#8b5cf620' }}
                        >
                            <FontAwesome6
                                name="clock"
                                size={16}
                                color={isAllDay ? secondaryColor : '#8b5cf6'}
                            />
                        </View>
                        <Text
                            className="text-lg font-semibold"
                            style={{ color: isAllDay ? secondaryColor : textColor }}
                        >
                            {isAllDay ? t('common.allDay') : formattedTime}
                        </Text>
                    </View>
                    {!isAllDay && <FontAwesome6 name="chevron-right" size={12} color={secondaryColor} />}
                </Pressable>

                {Platform.OS === 'android' && !isAllDay && (
                    <Pressable
                        onPress={() => setAddToAlarm(!addToAlarm)}
                        className="flex-row items-center justify-between mt-3 pl-1"
                    >
                        <View className="flex-row items-center gap-2">
                            <FontAwesome6
                                name="bell"
                                size={12}
                                color={addToAlarm ? '#8b5cf6' : secondaryColor}
                            />
                            <Text className="text-sm font-medium" style={{ color: textColor }}>
                                {t('todo.setSystemAlarm')}
                            </Text>
                        </View>
                        <Switch
                            value={addToAlarm}
                            onValueChange={setAddToAlarm}
                            trackColor={{ false: inputBorder, true: '#8b5cf6' }}
                            thumbColor="#fff"
                            style={{ transform: [{ scale: 0.8 }] }}
                        />
                    </Pressable>
                )}
            </View>
        </View>
    );
}
