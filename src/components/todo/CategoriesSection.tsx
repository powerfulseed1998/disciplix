import React, { memo } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useCategoriesStore, MAX_CATEGORIES } from '../../store/useCategoriesStore';
import { Task } from '../../store/useTasksStore';
import { useRouter } from 'expo-router';

interface CategoriesSectionProps {
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    tasks: Task[];
    isDark: boolean;
    textColor: string;
    secondaryTextColor: string;
    cardBg: string;
    inputBorder: string;
    compact?: boolean;
}

const CategoriesSection = memo(({
    activeCategory,
    setActiveCategory,
    tasks,
    isDark,
    textColor,
    secondaryTextColor,
    cardBg,
    inputBorder,
    compact = false,
}: CategoriesSectionProps) => {
    const { t } = useTranslation();
    const categories = useCategoriesStore(state => state.categories);
    const router = useRouter();

    // Create display categories with "All" prepended
    const displayCategories = [
        { id: 'all', label: t('todo.categories.all'), icon: 'layer-group', color: '#8b5cf6' },
        ...categories
    ];

    return (
        <>
            {/* Top row: title + manage button (or manage-only in compact) */}
            <View className={compact ? 'flex-row justify-between items-center mb-2' : 'flex-row justify-between items-center mb-4'}>
                {!compact ? (
                    <Text
                        className="text-xl font-bold"
                        style={{ color: textColor }}
                    >
                        {t('todo.category')}
                    </Text>
                ) : (
                    <Text
                        className="text-base font-semibold"
                        style={{ color: textColor }}
                    >
                        {t('todo.category')}
                    </Text>
                )}
                <View className="flex-row items-center gap-3">
                    <Text
                        className="text-sm font-medium"
                        style={{ color: secondaryTextColor }}
                    >
                        {categories.length} / {MAX_CATEGORIES}
                    </Text>
                    <TouchableOpacity
                        className="p-2 -mr-2"
                        hitSlop={8}
                        onPress={() => router.push('/(tabs)/todo/manage-categories')}
                    >
                        <FontAwesome6
                            name="gear"
                            size={20}
                            color={isDark ? '#94a3b8' : '#64748b'}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -20, marginBottom: 10 }}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
            >
                {displayCategories.map((cat, index) => {
                    const isActive = activeCategory === cat.id;
                    return (
                        <Animated.View
                            key={cat.id}
                            entering={FadeInRight.delay(index * 80).springify()}
                        >
                            <Pressable
                                onPress={() => setActiveCategory(cat.id)}
                                className={`flex-row items-center py-2.5 px-3.5 rounded-2xl border gap-2.5`}
                                style={{
                                    backgroundColor: isActive
                                        ? '#8b5cf6'
                                        : cardBg,
                                    borderColor: isActive
                                        ? '#8b5cf6'
                                        : inputBorder,
                                }}
                            >
                                <View
                                    className="w-7 h-7 rounded-xl items-center justify-center"
                                    style={{
                                        backgroundColor: isActive
                                            ? 'rgba(255,255,255,0.2)'
                                            : cat.color + '20',
                                    }}
                                >
                                    <FontAwesome6
                                        name={cat.icon}
                                        size={12}
                                        color={isActive ? '#fff' : cat.color}
                                        solid
                                    />
                                </View>
                                <Text
                                    className="text-sm font-semibold"
                                    style={{
                                        color: isActive ? '#fff' : textColor,
                                    }}
                                >
                                    {t(`todo.categories.${cat.id}`, cat.label)}
                                </Text>
                                <View
                                    className="px-2 py-0.5 rounded-lg"
                                    style={{
                                        backgroundColor: isActive
                                            ? 'rgba(255,255,255,0.2)'
                                            : isDark
                                                ? '#334155'
                                                : '#f1f5f9',
                                    }}
                                >
                                    <Text
                                        className="text-xs font-semibold"
                                        style={{
                                            color: isActive ? '#fff' : secondaryTextColor,
                                        }}
                                    >
                                        {cat.id === 'all'
                                            ? tasks.length
                                            : tasks.filter(
                                                t =>
                                                    t.category?.id === cat.id,
                                            ).length}
                                    </Text>
                                </View>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </ScrollView>
        </>
    );
});

export default CategoriesSection;
