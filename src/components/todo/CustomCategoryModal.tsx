import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

type CustomCategoryModalProps = {
    isVisible: boolean;
    onCreateCategory: (category: { id: string; label: string; icon: string; color: string }) => void;
    onClose: () => void;
    isDark: boolean;
};

// 预设图标选项
const ICON_OPTIONS = [
    'star', 'heart', 'bell', 'book', 'music',
    'gamepad', 'camera', 'plane', 'car', 'house',
];

// 预设颜色选项
const COLOR_OPTIONS = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'
];

export default function CustomCategoryModal({
    isVisible,
    onCreateCategory,
    onClose,
    isDark,
}: CustomCategoryModalProps) {
    const { t } = useTranslation();
    const [categoryName, setCategoryName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('star');
    const [selectedColor, setSelectedColor] = useState('#3b82f6');

    // 每次打开模态框时重置状态
    useEffect(() => {
        if (isVisible) {
            setCategoryName('');
            setSelectedIcon('star');
            setSelectedColor('#3b82f6');
        }
    }, [isVisible]);

    function generateId() {
        return `custom_${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function handleCreate() {
        if (!categoryName.trim()) return;

        onCreateCategory({
            id: generateId(),
            label: categoryName.trim(),
            icon: selectedIcon,
            color: selectedColor,
        });
        onClose();
    }

    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryTextColor = isDark ? '#94a3b8' : '#64748b';
    const inputBg = isDark ? '#1e293b' : '#f8fafc';
    const inputBorder = isDark ? '#334155' : '#e2e8f0';

    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View className="flex-1 items-center justify-center bg-black/50">
                <Pressable className="absolute inset-0" onPress={onClose} />

                <Animated.View
                    entering={FadeInUp.springify()}
                    className="w-[90%] max-w-[400px] max-h-[85%] rounded-[20px] p-5 shadow-2xl"
                    style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}
                >
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-xl font-bold" style={{ color: textColor }}>
                            {t('todo.createCustomCategory')}
                        </Text>
                        <Pressable onPress={onClose} className="p-2">
                            <FontAwesome6 name="xmark" size={16} color={secondaryTextColor} />
                        </Pressable>
                    </View>

                    <ScrollView
                        className="max-h-[300px]"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 10 }}
                    >
                        {/* Category Name Input */}
                        <View className="mb-6">
                            <Text className="text-base font-semibold mb-3" style={{ color: textColor }}>
                                {t('todo.categoryName')}
                            </Text>
                            <TextInput
                                className="rounded-xl border p-4 text-base"
                                style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textColor }}
                                placeholder={t('todo.enterCategoryName')}
                                placeholderTextColor={secondaryTextColor}
                                value={categoryName}
                                onChangeText={setCategoryName}
                            />
                        </View>

                        {/* Icon Selection */}
                        <View className="mb-6">
                            <Text className="text-base font-semibold mb-3" style={{ color: textColor }}>
                                {t('todo.chooseIcon')}
                            </Text>
                            <View className="flex-row flex-wrap gap-2">
                                {ICON_OPTIONS.map((icon) => (
                                    <Pressable
                                        key={icon}
                                        onPress={() => setSelectedIcon(icon)}
                                        className="w-12 h-12 rounded-xl border items-center justify-center"
                                        style={{
                                            backgroundColor: selectedIcon === icon ? selectedColor + '20' : (isDark ? '#1e293b' : '#fff'),
                                            borderColor: selectedIcon === icon ? selectedColor : inputBorder
                                        }}
                                    >
                                        <FontAwesome6 
                                            name={icon as any} 
                                            size={20} 
                                            color={selectedIcon === icon ? selectedColor : secondaryTextColor} 
                                        />
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Color Selection */}
                        <View className="mb-6">
                            <Text className="text-base font-semibold mb-3" style={{ color: textColor }}>
                                {t('todo.chooseColor')}
                            </Text>
                            <View className="flex-row flex-wrap gap-3">
                                {COLOR_OPTIONS.map((color) => (
                                    <Pressable
                                        key={color}
                                        onPress={() => setSelectedColor(color)}
                                        className="w-10 h-10 rounded-full"
                                        style={{
                                            backgroundColor: color,
                                            borderWidth: selectedColor === color ? 3 : 0,
                                            borderColor: isDark ? '#fff' : '#000'
                                        }}
                                    />
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View className="flex-row gap-3 mt-5">
                        <Pressable
                            onPress={onClose}
                            className="flex-1 py-3.5 rounded-xl border items-center"
                            style={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderColor: inputBorder }}
                        >
                            <Text className="text-base font-semibold" style={{ color: textColor }}>{t('common.cancel')}</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleCreate}
                            disabled={!categoryName.trim()}
                            className="flex-1 py-3.5 rounded-xl items-center bg-violet-500"
                            style={{ opacity: categoryName.trim() ? 1 : 0.5 }}
                        >
                            <Text className="text-white font-bold text-base">{t('common.create')}</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}