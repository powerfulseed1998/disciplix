import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

type TaskInputFieldsProps = {
    taskTitle: string;
    setTaskTitle: (text: string) => void;
    taskDescription: string;
    setTaskDescription: (text: string) => void;
    isDark: boolean;
};

export function TaskInputFields({
    taskTitle,
    setTaskTitle,
    taskDescription,
    setTaskDescription,
    isDark,
}: TaskInputFieldsProps) {
    const { t } = useTranslation();
    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryColor = isDark ? '#94a3b8' : '#64748b';
    const inputBg = isDark ? '#0f172a' : '#f8fafc';
    const inputBorder = isDark ? '#334155' : '#e2e8f0';

    return (
        <View className="gap-4">
            {/* Title Input */}
            <View>
                <View className="flex-row items-center gap-2 mb-3">
                    <FontAwesome6 name="pen" size={12} color="#8b5cf6" />
                    <Text className="text-sm font-semibold" style={{ color: textColor }}>{t('todo.title')}</Text>
                </View>
                <TextInput
                    className="p-4 rounded-[16px] border text-base"
                    style={{
                        backgroundColor: inputBg,
                        borderColor: inputBorder,
                        color: textColor,
                    }}
                    placeholder={t('todo.whatToDone')}
                    placeholderTextColor={secondaryColor}
                    value={taskTitle}
                    onChangeText={setTaskTitle}
                />
            </View>

            {/* Description Input */}
            <View>
                <View className="flex-row items-center gap-2 mb-3">
                    <FontAwesome6 name="align-left" size={12} color="#8b5cf6" />
                    <Text className="text-sm font-semibold" style={{ color: textColor }}>{t('todo.description')}</Text>
                    <Text className="text-xs" style={{ color: secondaryColor }}>{t('todo.optional')}</Text>
                </View>
                <TextInput
                    className="p-4 rounded-[16px] border text-base min-h-[80px]"
                    style={{
                        backgroundColor: inputBg,
                        borderColor: inputBorder,
                        color: textColor,
                    }}
                    placeholder={t('todo.addDetails')}
                    placeholderTextColor={secondaryColor}
                    value={taskDescription}
                    onChangeText={setTaskDescription}
                    multiline
                    textAlignVertical="top"
                />
            </View>
        </View>
    );
}
