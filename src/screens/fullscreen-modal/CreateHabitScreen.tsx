import React, { useMemo, useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    Dimensions,
    TextInput,
    Platform,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    SharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useHabitsStore } from '../../store/useHabitsStore';
import {
    HABIT_COLOR_PRESETS,
    HABIT_ICON_CANDIDATES,
} from '../../constant/habitCreateOptions';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Floating Action Button
const FAB_SIZE = 60;
const FAB_MARGIN_RIGHT = 24;
const FAB_MARGIN_BOTTOM = 16; // HabitsFAB uses insets.bottom + 16

const CARD_MARGIN_X = 6;
const CARD_HEIGHT_PERCENT = 0.765;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const IconOption = ({
    icon,
    selected,
    isDark,
    onPress,
}: {
    icon: string;
    selected: boolean;
    isDark: boolean;
    onPress: () => void;
}) => {
    const progress = useSharedValue(selected ? 1 : 0);

    React.useEffect(() => {
        progress.value = withSpring(selected ? 1 : 0, {
            damping: 14,
            stiffness: 140,
        });
    }, [selected]);

    const aStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: interpolate(progress.value, [0, 1], [1, 1.06]) }],
        };
    });

    return (
        <AnimatedPressable
            onPress={onPress}
            className="w-11 h-11 rounded-2xl items-center justify-center border"
            style={[
                {
                    backgroundColor: isDark ? '#0b1220' : '#f8fafc',
                    borderColor: selected
                        ? '#8b5cf6'
                        : isDark
                            ? '#334155'
                            : '#e2e8f0',
                },
                aStyle,
            ]}
        >
            <FontAwesome6
                name={icon as any}
                size={18}
                color={selected ? '#8b5cf6' : isDark ? '#cbd5e1' : '#475569'}
                solid
            />
        </AnimatedPressable>
    );
};

interface CreateHabitModalProps {
    isVisible: boolean;
    expandProgress: SharedValue<number>;
    bottomTabBarHeight: number;
    onClose: () => void;
    isDark: boolean;
}

export default function CreateHabitModal({
    isVisible,
    expandProgress,
    bottomTabBarHeight,
    onClose,
    isDark,
}: CreateHabitModalProps) {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const { addHabit } = useHabitsStore();

    const [name, setName] = useState('');
    const [query, setQuery] = useState('');
    const [icon, setIcon] = useState<string>('');
    const [color, setColor] = useState<string>(HABIT_COLOR_PRESETS[0]);
    const [targetDays, setTargetDays] = useState(7);

    useEffect(() => {
        if (!isVisible) {
            // Reset form when closed
            setName('');
            setQuery('');
            setIcon('');
            setColor(HABIT_COLOR_PRESETS[0]);
            setTargetDays(7);
        }
    }, [isVisible]);

    const CARD_TOP_PERCENT = useMemo(() => {
        const safeTabBarHeight = bottomTabBarHeight || 0;
        const cardHeight = SCREEN_HEIGHT * CARD_HEIGHT_PERCENT;
        return (
            (SCREEN_HEIGHT - safeTabBarHeight - cardHeight) / SCREEN_HEIGHT / 2
        );
    }, [bottomTabBarHeight]);

    const glyphMap = (FontAwesome6 as any).glyphMap as
        | Record<string, number>
        | undefined;

    const filteredIcons = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = HABIT_ICON_CANDIDATES.filter(i =>
            glyphMap ? glyphMap[i] != null : true,
        );
        if (!q) return base;
        return base.filter(i => i.toLowerCase().includes(q));
    }, [query, glyphMap]);

    const canSave = name.trim().length > 0 && icon.length > 0;

    // Theme colors
    const cardBg = isDark ? '#1e293b' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0f172a';
    const subTextColor = isDark ? '#94a3b8' : '#64748b';
    const borderColor = isDark ? '#334155' : '#e2e8f0';
    const inputBg = isDark ? '#0b1220' : '#f8fafc';

    const handleSave = () => {
        if (!canSave) return;
        addHabit({
            name: name.trim(),
            icon,
            color,
            targetDays,
        });
        onClose();
    };

    const END_WIDTH = SCREEN_WIDTH - CARD_MARGIN_X * 2;
    const END_HEIGHT = SCREEN_HEIGHT * CARD_HEIGHT_PERCENT;
    const END_TOP = SCREEN_HEIGHT * CARD_TOP_PERCENT;
    const END_LEFT = CARD_MARGIN_X;

    const START_TOP =
        SCREEN_HEIGHT - insets.bottom - FAB_MARGIN_BOTTOM - FAB_SIZE;
    const START_LEFT = SCREEN_WIDTH - FAB_MARGIN_RIGHT - FAB_SIZE;

    const overlayAnimatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            expandProgress.value,
            [0, 1],
            [START_LEFT - END_LEFT, 0],
        );
        const translateY = interpolate(
            expandProgress.value,
            [0, 1],
            [START_TOP - END_TOP, 0],
        );

        const scaleX = interpolate(
            expandProgress.value,
            [0, 1],
            [FAB_SIZE / END_WIDTH, 1],
        );
        const scaleY = interpolate(
            expandProgress.value,
            [0, 1],
            [FAB_SIZE / END_HEIGHT, 1],
        );

        return {
            width: END_WIDTH,
            height: END_HEIGHT,
            top: END_TOP,
            left: END_LEFT,
            transform: [{ translateX }, { translateY }, { scaleX }, { scaleY }],
            borderRadius: interpolate(expandProgress.value, [0, 1], [100, 28]),
            opacity: interpolate(expandProgress.value, [0, 0.1], [0, 1]),
        };
    });

    const contentStyle = useAnimatedStyle(() => ({
        opacity: interpolate(expandProgress.value, [0.6, 1], [0, 1]),
        transform: [
            { translateY: interpolate(expandProgress.value, [0, 1], [20, 0]) },
        ],
    }));

    if (!isVisible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor: cardBg },
                overlayAnimatedStyle,
            ]}
        >
            <Animated.View style={[styles.content, contentStyle]}>
                {/* Floating Close Button */}
                <View style={styles.floatingHeader}>
                    <Pressable
                        onPress={onClose}
                        style={[
                            styles.closeButton,
                            { backgroundColor: isDark ? '#334155' : '#f1f5f9' },
                        ]}
                    >
                        <FontAwesome6
                            name="xmark"
                            size={16}
                            color={subTextColor}
                        />
                    </Pressable>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={true}
                        persistentScrollbar={true}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Header Content */}
                        <View style={styles.headerTextContainer}>
                            <Text style={[styles.headerTitle, { color: textColor }]}>
                                {t('habits.create.title')}
                            </Text>
                            <Text style={[styles.headerSubtitle, { color: subTextColor }]}>
                                {t('habits.create.subtitle')}
                            </Text>
                        </View>

                        {/* Preview */}
                        <View
                            className="flex-row items-center gap-3 border rounded-2xl p-3.5 mb-5"
                            style={[
                                { backgroundColor: isDark ? '#111c2f' : '#ffffff', borderColor: borderColor },
                            ]}
                        >
                            <View
                                className="w-12 h-12 rounded-2xl items-center justify-center"
                                style={[
                                    { backgroundColor: color + '1f' },
                                ]}
                            >
                                <FontAwesome6
                                    name={(icon || 'bolt') as any}
                                    size={22}
                                    color={color}
                                    solid
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text
                                    className="text-base font-bold"
                                    style={[
                                        { color: textColor },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {name.trim() ? name.trim() : t('habits.create.previewName')}
                                </Text>
                                <Text
                                    className="mt-0.5 text-xs font-medium"
                                    style={{ color: subTextColor }}
                                >
                                    {t('habits.create.weeklyGoal', { days: targetDays })}
                                </Text>
                            </View>
                        </View>

                        {/* Name */}
                        <Text
                            className="mb-2 text-[13px] font-extrabold"
                            style={{ color: textColor }}
                        >
                            {t('habits.create.nameLabel')}
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder={t('habits.create.namePlaceholder')}
                            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                            style={[
                                {
                                    backgroundColor: inputBg,
                                    borderColor: borderColor,
                                    color: textColor,
                                },
                            ]}
                            className="border rounded-2xl px-3 py-2.5 text-sm mb-4"
                            returnKeyType="done"
                        />

                        {/* Target days */}
                        <Text
                            className="mb-2 text-[13px] font-extrabold"
                            style={{ color: textColor }}
                        >
                            {t('habits.create.weeklyGoalLabel')}
                        </Text>
                        <View className="flex-row flex-wrap gap-1 mb-4">
                            {Array.from({ length: 7 }).map((_, idx) => {
                                const v = idx + 1;
                                const active = v === targetDays;
                                return (
                                    <Pressable
                                        key={v}
                                        onPress={() => setTargetDays(v)}
                                        className="min-w-[34px] px-2 py-1.5 rounded-xl border items-center"
                                        style={[
                                            {
                                                backgroundColor: active
                                                    ? '#8b5cf6'
                                                    : inputBg,
                                                borderColor: active
                                                    ? '#8b5cf6'
                                                    : borderColor,
                                            },
                                        ]}
                                    >
                                        <Text
                                            className="text-[11px] font-extrabold"
                                            style={{
                                                color: active
                                                    ? '#fff'
                                                    : subTextColor,
                                            }}
                                        >
                                            {v}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {/* Color */}
                        <Text
                            className="mb-2 text-[13px] font-extrabold"
                            style={{ color: textColor }}
                        >
                            {t('habits.create.colorLabel')}
                        </Text>
                        <View className="flex-row gap-2.5 mb-4">
                            {HABIT_COLOR_PRESETS.map(c => {
                                const active = c === color;
                                return (
                                    <Pressable
                                        key={c}
                                        onPress={() => setColor(c)}
                                        className="w-7 h-7 rounded-full border-2 items-center justify-center"
                                        style={[
                                            {
                                                borderColor: active
                                                    ? c
                                                    : 'transparent',
                                            },
                                        ]}
                                    >
                                        <View
                                            className="w-5 h-5 rounded-full"
                                            style={{ backgroundColor: c }}
                                        />
                                    </Pressable>
                                );
                            })}
                        </View>

                        {/* Icon picker */}
                        <View className="flex-row justify-between items-center mb-2">
                            <Text
                                className="text-[13px] font-extrabold"
                                style={{ color: textColor }}
                            >
                                {t('habits.create.iconLabel')}
                            </Text>
                            <Text
                                className="text-xs font-semibold"
                                style={{ color: subTextColor }}
                            >
                                {t('habits.create.iconsCount', { count: filteredIcons.length })}
                            </Text>
                        </View>
                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholder={t('habits.create.searchPlaceholder')}
                            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                            style={[
                                {
                                    backgroundColor: inputBg,
                                    borderColor: borderColor,
                                    color: textColor,
                                },
                            ]}
                            className="border rounded-2xl px-3 py-2.5 text-sm mb-3"
                        />

                        {/* Icon grid */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={true}
                            persistentScrollbar={true}
                            className="pb-3 pt-1"
                            contentContainerStyle={{ paddingRight: 20 }}
                        >
                            {Array.from({ length: Math.ceil(filteredIcons.length / 3) }, (_, columnIndex) => (
                                <View key={`column-${columnIndex}`} className="flex-col gap-3.5 mr-3.5">
                                    {filteredIcons.slice(columnIndex * 3, (columnIndex + 1) * 3).map(i => (
                                        <IconOption
                                            key={i}
                                            icon={i}
                                            selected={i === icon}
                                            isDark={isDark}
                                            onPress={() => setIcon(i)}
                                        />
                                    ))}
                                </View>
                            ))}
                        </ScrollView>

                        <View style={{ height: 100 }} />
                    </ScrollView>
                </KeyboardAvoidingView>

                {/* Create Button */}
                <View
                    style={[
                        styles.footer,
                        { paddingBottom: Math.max(insets.bottom, 20) },
                    ]}
                >
                    <Pressable
                        onPress={handleSave}
                        disabled={!canSave}
                        style={[
                            styles.createButton,
                            {
                                backgroundColor: canSave
                                    ? '#8b5cf6'
                                    : (isDark ? '#334155' : '#e2e8f0'),
                                shadowColor: canSave ? '#8b5cf6' : 'transparent'
                            },
                        ]}
                    >
                        <Text style={[
                            styles.createButtonText,
                            { color: canSave ? "#fff" : subTextColor }
                        ]}>
                            {t('habits.create.save')}
                        </Text>
                    </Pressable>
                </View>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        overflow: 'hidden',
        zIndex: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 12,
    },
    content: {
        flex: 1,
    },
    floatingHeader: {
        position: 'absolute',
        top: 24,
        right: 24,
        zIndex: 10,
    },
    headerTextContainer: {
        marginTop: 4,
        marginBottom: 24,
        paddingRight: 60,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 24,
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 20,
    },
    createButton: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});