import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Switch, Platform } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollView as GHScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Animated from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Category, useCategoriesStore } from '../../../store/useCategoriesStore';

type TaskDetailEditProps = {
    title: string;
    setTitle: (text: string) => void;
    description: string;
    setDescription: (text: string) => void;
    time: Date;
    setTime: (date: Date) => void;
    category: any;
    setCategory: (cat: any) => void;
    isAllDay: boolean;
    setIsAllDay: (val: boolean) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: () => void;
    openPicker: () => void;
    closePicker: () => void;
    handleCancelPicker: () => void;
    showPicker: boolean;
    pickerContainerStyle: any;
    isDark: boolean;
};

export function TaskDetailEdit({
    title, setTitle, description, setDescription, time, setTime,
    category, setCategory, isAllDay, setIsAllDay, onSave, onCancel, onDelete,
    openPicker, closePicker, handleCancelPicker, showPicker, pickerContainerStyle, isDark
}: TaskDetailEditProps) {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const categories = useCategoriesStore(state => state.categories);
    const textColor = isDark ? '#ffffff' : '#1e293b';
    const secondaryColor = isDark ? '#94a3b8' : '#64748b';
    const inputBg = isDark ? '#0f172a' : '#f8fafc';
    const inputBorder = isDark ? '#334155' : '#e2e8f0';

    const selectableCategories = categories.filter(c => c.id !== 'all');
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    function onTimeChange(event: DateTimePickerEvent, selectedDate?: Date) {
        if (Platform.OS === 'android') closePicker();
        if (selectedDate) setTime(selectedDate);
    }

    return (
        <View className="flex-1">
            <View className="flex-row justify-between items-center px-6 pt-6 pb-4">
                <Text className="text-2xl font-bold" style={{ color: textColor }}>{t('todo.editTask')}</Text>
                <View className="flex-row items-center gap-4">
                    <Pressable onPress={onCancel}><Text className="text-base" style={{ color: secondaryColor }}>{t('common.cancel')}</Text></Pressable>
                    <Pressable onPress={onSave} className="bg-violet-500 px-4 py-2 rounded-xl" disabled={!title.trim()}>
                        <Text className="text-white font-bold text-base">{t('common.save')}</Text>
                    </Pressable>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
                <View className="mb-6">
                    <View className="flex-row items-center gap-2 mb-3">
                        <FontAwesome6 name="pen" size={12} color="#8b5cf6" /><Text className="text-sm font-semibold" style={{ color: textColor }}>{t('todo.title')}</Text>
                    </View>
                    <TextInput
                        className="p-4 rounded-2xl border text-base"
                        style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textColor }}
                        value={title} onChangeText={setTitle} placeholder={t('todo.title')} placeholderTextColor={secondaryColor}
                    />
                </View>

                <View className="mb-6">
                    <View className="flex-row items-center gap-2 mb-3">
                        <FontAwesome6 name="align-left" size={12} color="#8b5cf6" /><Text className="text-sm font-semibold" style={{ color: textColor }}>{t('todo.description')}</Text>
                    </View>
                    <TextInput
                        className="p-4 rounded-2xl border text-base min-h-[80px]"
                        style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textColor }}
                        value={description} onChangeText={setDescription} multiline textAlignVertical="top" placeholder={t('todo.description')} placeholderTextColor={secondaryColor}
                    />
                </View>

                <View className="mb-6">
                    <View className="flex-row items-center gap-2 mb-3">
                        <FontAwesome6 name="tag" size={12} color="#8b5cf6" /><Text className="text-sm font-semibold" style={{ color: textColor }}>{t('todo.category')}</Text>
                    </View>
                    <GHScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                        {selectableCategories.map(cat => {
                            const isSelected = category?.id === cat.id;
                            return (
                                <Pressable
                                    key={cat.id} onPress={() => setCategory(cat)}
                                    className="flex-row items-center py-3 px-3 rounded-[14px] border-[1.5px] gap-2.5"
                                    style={{ backgroundColor: isSelected ? `${cat.color}15` : inputBg, borderColor: isSelected ? cat.color : inputBorder }}
                                >
                                    <View className="w-8 h-8 rounded-[10px] items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                                        <FontAwesome6 name={cat.icon} size={14} color={cat.color} solid />
                                    </View>
                                    <Text className="text-sm font-semibold" style={{ color: isSelected ? cat.color : textColor }}>
                                        {t(`todo.categories.${cat.id}`, cat.label)}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </GHScrollView>
                </View>

                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center gap-2"><FontAwesome6 name="clock" size={12} color="#8b5cf6" /><Text className="text-sm font-semibold" style={{ color: textColor }}>{t('todo.time')}</Text></View>
                        <View className="flex-row items-center gap-2">
                            <Text style={{ fontSize: 12, color: secondaryColor }}>{t('common.allDay')}</Text>
                            <Switch value={isAllDay} onValueChange={setIsAllDay} trackColor={{ false: inputBorder, true: '#8b5cf6' }} thumbColor="#fff" />
                        </View>
                    </View>
                    <Pressable
                        onPress={isAllDay ? undefined : openPicker}
                        className="flex-row items-center justify-between p-4 rounded-2xl border"
                        style={{ backgroundColor: inputBg, borderColor: inputBorder, opacity: isAllDay ? 0.6 : 1 }}
                    >
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: isAllDay ? '#94a3b820' : '#8b5cf620' }}>
                                <FontAwesome6 name="clock" size={16} color={isAllDay ? secondaryColor : '#8b5cf6'} />
                            </View>
                            <Text className="text-lg font-semibold" style={{ color: isAllDay ? secondaryColor : textColor }}>{isAllDay ? t('common.allDay') : formattedTime}</Text>
                        </View>
                        {!isAllDay && <FontAwesome6 name="chevron-right" size={12} color={secondaryColor} />}
                    </Pressable>
                </View>
            </ScrollView>

            <View className="px-6 pt-4 border-t" style={{ borderTopColor: 'rgba(0,0,0,0.05)', paddingBottom: Math.max(insets.bottom, 20) }}>
                <Pressable onPress={onDelete} className="flex-row items-center justify-center bg-red-500/10 py-4 rounded-2xl gap-2">
                    <FontAwesome6 name="trash" size={14} color="#ef4444" /><Text className="text-red-500 text-base font-bold">{t('todo.deleteTask')}</Text>
                </Pressable>
            </View>

            {showPicker && Platform.OS === 'ios' && (
                <Animated.View className="absolute inset-0 z-50" style={pickerContainerStyle} pointerEvents="box-none">
                    <Pressable className="flex-1" onPress={handleCancelPicker} />
                    <View className="rounded-t-[32px] pb-8 items-center" style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
                        <View className="w-full flex-row justify-between items-center px-6 py-4 border-b" style={{ borderBottomColor: inputBorder }}>
                            <Pressable onPress={handleCancelPicker}><Text className="text-base" style={{ color: secondaryColor }}>{t('common.cancel')}</Text></Pressable>
                            <Text className="font-bold text-base" style={{ color: textColor }}>{t('todo.selectTime')}</Text>
                            <Pressable onPress={closePicker}><Text className="text-violet-500 font-bold text-base">{t('common.done')}</Text></Pressable>
                        </View>
                        <DateTimePicker value={time} mode="time" display="spinner" onChange={onTimeChange} textColor={isDark ? '#fff' : '#000'} themeVariant={isDark ? 'dark' : 'light'} />
                    </View>
                </Animated.View>
            )}
            {showPicker && Platform.OS === 'android' && (
                <DateTimePicker value={time} mode="time" display="spinner" onChange={onTimeChange} textColor={isDark ? '#fff' : '#000'} themeVariant={isDark ? 'dark' : 'light'} />
            )}
        </View>
    );
}
