import React from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Task, useTasksStore } from '../../../store/useTasksStore';

type TaskDetailViewProps = {
    task: Task;
    title: string;
    description: string;
    time: Date;
    category: any;
    completed: boolean;
    isAllDay: boolean;
    setCompleted: (val: boolean) => void;
    onEdit: () => void;
    onDelete: () => void;
    isDark: boolean;
};

export function TaskDetailView({
    task, title, description, time, category, completed, isAllDay,
    setCompleted, onEdit, onDelete, isDark
}: TaskDetailViewProps) {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const { updateTask } = useTasksStore();
    const textColor = isDark ? '#ffffff' : '#1e293b';
    const secondaryColor = isDark ? '#94a3b8' : '#64748b';

    function formatTimeDisplay() {
        const date = new Date(time);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const isToday = date.toDateString() === today.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        if (isAllDay) {
            if (isToday) return `${t('common.today')}, ${t('common.allDay')}`;
            if (isTomorrow) return `${t('common.tomorrow')}, ${t('common.allDay')}`;
            return `${date.toLocaleDateString([], { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined })}, ${t('common.allDay')}`;
        }

        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        if (isToday) return timeStr;
        if (isTomorrow) return `${t('common.tomorrow')}, ${timeStr}`;
        return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
    }

    return (
        <View className="flex-1">
            <View className="flex-row justify-between items-center px-6 pt-6 pb-4">
                <Text className="text-2xl font-bold" style={{ color: textColor }}>{t('todo.taskDetails')}</Text>
                <Pressable onPress={onEdit} className="flex-row items-center gap-2 px-3 py-1.5 rounded-xl">
                    <FontAwesome6 name="pencil" size={14} color={secondaryColor} />
                    <Text className="text-sm font-semibold" style={{ color: secondaryColor }}>{t('common.edit')}</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}>
                <View
                    className="flex-row justify-between items-center p-4 rounded-2xl border mb-6"
                    style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderColor: isDark ? '#334155' : '#e2e8f0' }}
                >
                    <Text className="text-base font-semibold" style={{ color: textColor }}>
                        {t('todo.status', { status: completed ? t('common.completed') : t('common.pending') })}
                    </Text>
                    <Switch
                        value={completed}
                        onValueChange={newVal => {
                            setCompleted(newVal);
                            updateTask({ ...task, completed: newVal });
                        }}
                        trackColor={{ false: isDark ? '#334155' : '#e2e8f0', true: '#8b5cf6' }}
                        thumbColor={isDark ? '#1e293b' : '#fff'}
                    />
                </View>

                <View className="mb-6 gap-3">
                    <View className="flex-row items-center gap-2">
                        <FontAwesome6 name="pen" size={12} color="#8b5cf6" />
                        <Text className="text-sm font-semibold" style={{ color: textColor }}>{t('todo.title')}</Text>
                    </View>
                    <Text className="text-base font-medium" style={{ color: textColor }}>{title}</Text>
                </View>

                {description ? (
                    <View className="mb-6 gap-3">
                        <View className="flex-row items-center gap-2">
                            <FontAwesome6 name="align-left" size={12} color="#8b5cf6" />
                            <Text className="text-sm font-semibold" style={{ color: textColor }}>{t('todo.description')}</Text>
                        </View>
                        <Text className="text-base font-medium leading-6" style={{ color: secondaryColor }}>{description}</Text>
                    </View>
                ) : null}

                <View className="mb-6 gap-3">
                    <View className="flex-row items-center gap-2">
                        <FontAwesome6 name="tag" size={12} color="#8b5cf6" />
                        <Text className="text-sm font-semibold" style={{ color: textColor }}>{t('todo.category')}</Text>
                    </View>
                    <View
                        className="flex-row items-center py-2 px-3 rounded-xl gap-2 self-start"
                        style={{ backgroundColor: `${category?.color || '#8b5cf6'}20` }}
                    >
                        <FontAwesome6 name={category?.icon || 'tag'} size={12} color={category?.color || '#8b5cf6'} solid />
                        <Text className="text-sm font-semibold" style={{ color: category?.color || '#8b5cf6' }}>
                            {category?.id ? t(`todo.categories.${category.id}`, category.label) : (category?.label || t('common.unknown'))}
                        </Text>
                    </View>
                </View>

                <View className="mb-6 gap-3">
                    <View className="flex-row items-center gap-2">
                        <FontAwesome6 name={isAllDay ? "calendar" : "clock"} size={12} color="#8b5cf6" />
                        <Text className="text-sm font-semibold" style={{ color: textColor }}>
                            {isAllDay ? t('todo.date') : t('todo.time')}
                        </Text>
                    </View>
                    <Text className="text-base font-medium" style={{ color: textColor }}>{formatTimeDisplay()}</Text>
                </View>
            </ScrollView>

            <View className="px-6 pt-4 border-t" style={{ borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', paddingBottom: Math.max(insets.bottom, 20) }}>
                <Pressable onPress={onDelete} className="flex-row items-center justify-center bg-red-500/10 py-4 rounded-2xl gap-2">
                    <FontAwesome6 name="trash" size={14} color="#ef4444" />
                    <Text className="text-red-500 text-base font-bold">{t('todo.deleteTask')}</Text>
                </Pressable>
            </View>
        </View>
    );
}
