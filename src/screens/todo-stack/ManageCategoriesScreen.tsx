import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Sortable from 'react-native-sortables';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../providers/ThemeProvider';
import { useCategoriesStore, Category, MAX_CATEGORIES } from '../../store/useCategoriesStore';
import CustomCategoryModal from '../../components/todo/CustomCategoryModal';
import { usePreferencesStore } from '../../store/usePreferencesStore';

export default function ManageCategoriesScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { isDark } = useThemeContext();
    const { categories, setCategories, deleteCategories, addCategory } = useCategoriesStore();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const { hasShownReorderHint, markReorderHintShown } = usePreferencesStore();

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    }, []);

    const handleBulkDelete = useCallback(() => {
        if (categories.length - selectedIds.length < 1) {
            Alert.alert(
                t('todo.categories.actionBlocked'),
                t('todo.categories.atLeastOne'),
                [{ text: t('common.ok') }]
            );
            return;
        }

        Alert.alert(
            t('todo.categories.deleteTitle'),
            t('todo.categories.deleteConfirm', { count: selectedIds.length }),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: () => {
                        deleteCategories(selectedIds);
                        setSelectedIds([]);
                    },
                },
            ]
        );
    }, [selectedIds, deleteCategories, categories.length, t]);

    const handleCreateCustomCategory = (newCategory: { id: string; label: string; icon: string; color: string }) => {
        addCategory(newCategory);
        setShowCustomModal(false);
    };

    const handlePressAdd = useCallback(() => {
        if (categories.length >= MAX_CATEGORIES) {
            Alert.alert(
                t('todo.categories.limitReached'),
                t('todo.categories.limitReachedDesc', { max: MAX_CATEGORIES }),
                [{ text: t('common.ok') }]
            );
            return;
        }
        setShowCustomModal(true);
    }, [categories.length, t]);

    const renderItem = useCallback(({ item }: { item: Category }) => {
        const isSelected = selectedIds.includes(item.id);
        return (
            <View
                className="h-16 flex-row items-center px-4 mx-6 rounded-2xl shadow-sm"
                style={{ backgroundColor: isDark ? '#1e293b' : '#fff' }}
            >
                {/* Checkbox */}
                <TouchableOpacity
                    onPress={() => toggleSelection(item.id)}
                    className="w-8 h-16 justify-center mr-2"
                    activeOpacity={0.6}
                >
                    <View
                        className={`w-5 h-5 rounded-md border items-center justify-center ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-gray-400'}`}
                        style={{ borderColor: isSelected ? '#6366f1' : (isDark ? '#475569' : '#cbd5e1') }}
                    >
                        {isSelected && <FontAwesome6 name="check" size={12} color="#fff" />}
                    </View>
                </TouchableOpacity>

                <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: item.color + '20' }}
                >
                    <FontAwesome6 name={item.icon as any} size={18} color={item.color} />
                </View>
                <Text
                    className="flex-1 text-base font-semibold"
                    style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                >
                    {t(`todo.categories.${item.id}`, item.label)}
                </Text>

                <FontAwesome6 name="grip-lines" size={20} color={isDark ? '#475569' : '#cbd5e1'} />
            </View>
        );
    }, [isDark, selectedIds, toggleSelection, t]);

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 mb-2">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: isDark ? '#1e293b' : '#fff' }}
                >
                    <FontAwesome6 name="chevron-left" size={16} color={isDark ? '#f8fafc' : '#0f172a'} />
                </TouchableOpacity>
                <Text className="text-xl font-bold" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>
                    {t('todo.categories.manage')}
                </Text>
                <TouchableOpacity
                    onPress={handlePressAdd}
                    className="w-10 h-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: isDark ? '#1e293b' : '#fff' }}
                >
                    <FontAwesome6 name="plus" size={16} color={isDark ? '#f8fafc' : '#0f172a'} />
                </TouchableOpacity>
            </View>

            {/* Reorder Hint */}
            {!hasShownReorderHint && (
                <View className="mx-6 mb-4 rounded-xl p-4 flex-row items-center justify-between"
                    style={{ backgroundColor: isDark ? '#422006' : '#fefce8' }}>
                    <View className="flex-row items-center flex-1">
                        <FontAwesome6 name="circle-info" size={16} color={isDark ? '#fbbf24' : '#d97706'} solid />
                        <Text className="ml-3 text-sm font-medium"
                            style={{ color: isDark ? '#fefce8' : '#92400e' }}>
                            {t('todo.categories.reorderHint')}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={markReorderHintShown} hitSlop={10}>
                        <FontAwesome6 name="xmark" size={14} color={isDark ? '#fefce8' : '#92400e'} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Sortable List */}
            <View className="flex-1">
                <Sortable.Grid
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    columns={1}
                    rowGap={12}
                    onDragEnd={({ data }) => setCategories(data)}
                    inactiveItemOpacity={1}
                />
            </View>

            {/* Floating Delete Button */}
            {selectedIds.length > 0 && (
                <View className="absolute bottom-10 left-0 right-0 items-center px-6">
                    <TouchableOpacity
                        onPress={handleBulkDelete}
                        className="w-full bg-red-500 h-14 rounded-2xl flex-row items-center justify-center shadow-lg"
                        activeOpacity={0.8}
                        style={{ shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                    >
                        <FontAwesome6 name="trash-can" size={18} color="#fff" style={{ marginRight: 8 }} />
                        <Text className="text-white font-bold text-lg">
                            {t('common.delete')} ({selectedIds.length})
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Custom Category Modal */}
            <CustomCategoryModal
                isVisible={showCustomModal}
                onCreateCategory={handleCreateCustomCategory}
                onClose={() => setShowCustomModal(false)}
                isDark={isDark}
            />
        </SafeAreaView>
    );
}
