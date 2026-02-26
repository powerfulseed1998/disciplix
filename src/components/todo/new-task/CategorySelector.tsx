import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Category, useCategoriesStore, MAX_CATEGORIES } from '../../../store/useCategoriesStore';
import CustomCategoryModal from '../CustomCategoryModal';

type CategorySelectorProps = {
    selectedCategoryId: string;
    onSelectCategory: (id: string) => void;
    isDark: boolean;
};

export function CategorySelector({
    selectedCategoryId,
    onSelectCategory,
    isDark,
}: CategorySelectorProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const categories = useCategoriesStore(state => state.categories);
    const addCategory = useCategoriesStore(state => state.addCategory);
    const [showCustomModal, setShowCustomModal] = useState(false);

    const selectableCategories = categories.filter(c => c.id !== 'all');

    function handleCreateCustomCategory(newCategory: Category) {
        addCategory(newCategory);
        onSelectCategory(newCategory.id);
    }

    return (
        <View className="mb-2">
            <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-2">
                    <FontAwesome6 name="tag" size={12} color="#8b5cf6" />
                    <Text className="text-sm font-semibold" style={{ color: isDark ? '#fff' : '#1e293b' }}>
                        {t('todo.category')}
                    </Text>
                </View>
                <View className="flex-row items-center gap-3">
                    <Text
                        className="text-sm font-medium"
                        style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                        {categories.length} / {MAX_CATEGORIES}
                    </Text>
                    <Pressable
                        onPress={() => router.push('/(tabs)/todo/manage-categories')}
                        className="w-9 h-9 items-center justify-center rounded-xl"
                        style={{ backgroundColor: isDark ? '#334155' : '#f1f5f9' }}
                    >
                        <FontAwesome6 name="gear" size={16} color={isDark ? '#94a3b8' : '#64748b'} />
                    </Pressable>
                </View>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
            >
                {selectableCategories.map(cat => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                        <Pressable
                            key={cat.id}
                            onPress={() => onSelectCategory(cat.id)}
                            className="flex-row items-center py-3 px-3 rounded-[14px] border-[1.5px] gap-2.5"
                            style={{
                                backgroundColor: isSelected
                                    ? cat.color + '15'
                                    : (isDark ? '#0f172a' : '#f8fafc'),
                                borderColor: isSelected
                                    ? cat.color
                                    : (isDark ? '#334155' : '#e2e8f0'),
                            }}
                        >
                            <View
                                className="w-8 h-8 rounded-[10px] items-center justify-center"
                                style={{ backgroundColor: `${cat.color}20` }}
                            >
                                <FontAwesome6 name={cat.icon} size={14} color={cat.color} solid />
                            </View>
                            <Text
                                className="text-sm font-semibold"
                                style={{
                                    color: isSelected
                                        ? cat.color
                                        : (isDark ? '#fff' : '#1e293b'),
                                }}
                            >
                                {t(`todo.categories.${cat.id}`, cat.label)}
                            </Text>
                        </Pressable>
                    );
                })}
                <Pressable
                    onPress={() => setShowCustomModal(true)}
                    className="flex-row items-center py-3 px-3 rounded-[14px] border-[1.5px] gap-2.5 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                >
                    <FontAwesome6 name="plus" size={14} color="#8b5cf6" />
                    <Text className="text-sm font-semibold dark:text-white">{t('todo.custom')}</Text>
                </Pressable>
            </ScrollView>

            <CustomCategoryModal
                isVisible={showCustomModal}
                onCreateCategory={handleCreateCustomCategory}
                onClose={() => setShowCustomModal(false)}
                isDark={isDark}
            />
        </View>
    );
}
