import React, { useMemo, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import {
    HABIT_COLOR_PRESETS,
    HABIT_ICON_CANDIDATES,
} from '../../constant/habitCreateOptions';

type CreateHabitSheetProps = {
    isDark: boolean;
    onCreate: (input: {
        name: string;
        icon: string;
        color: string;
        targetDays: number;
    }) => void;
    onClose: () => void;
};

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

const CreateHabitSheet: React.FC<CreateHabitSheetProps> = ({
    isDark,
    onCreate,
    onClose,
}) => {
    const insets = useSafeAreaInsets();

    const [name, setName] = useState('');
    const [query, setQuery] = useState('');
    const [icon, setIcon] = useState<string>('');
    const [color, setColor] = useState<string>(HABIT_COLOR_PRESETS[0]);
    const [targetDays, setTargetDays] = useState(7);

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

    const card = isDark ? '#111c2f' : '#ffffff';
    const text = isDark ? '#ffffff' : '#0f172a';
    const subText = isDark ? '#94a3b8' : '#64748b';
    const border = isDark ? '#334155' : '#e2e8f0';

    const handleSave = () => {
        if (!canSave) return;
        onCreate({
            name: name.trim(),
            icon,
            color,
            targetDays,
        });
        onClose();
    };

    return (
        <BottomSheetScrollView
            className="px-5"
            contentContainerStyle={{ paddingBottom: insets.bottom + 12 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={true}
            overScrollMode="always"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View className="flex-row justify-between items-center pt-1.5 pb-2.5">
                    <View>
                        <Text
                            className="text-xl font-extrabold mt-4"
                            style={{ color: text }}
                        >
                            Create Habit
                        </Text>
                        <Text
                            className="mt-1 text-xs font-medium"
                            style={{ color: subText }}
                        >
                            Pick an action icon to make it more intuitive
                        </Text>
                    </View>
                    <Pressable
                        onPress={onClose}
                        className="w-9 h-9 rounded-xl items-center justify-center"
                        style={[
                            {
                                backgroundColor: isDark
                                    ? '#1f2b44'
                                    : '#f1f5f9',
                            },
                        ]}
                    >
                        <FontAwesome6
                            name="xmark"
                            size={16}
                            color={isDark ? '#cbd5e1' : '#475569'}
                            solid
                        />
                    </Pressable>
                </View>

                {/* Preview */}
                <View
                    className="flex-row items-center gap-3 border rounded-2xl p-3.5 mb-3.5"
                    style={[
                        { backgroundColor: card, borderColor: border },
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
                                { color: text },
                            ]}
                            numberOfLines={1}
                        >
                            {name.trim() ? name.trim() : 'Your new habit'}
                        </Text>
                        <Text
                            className="mt-0.5 text-xs font-medium"
                            style={{ color: subText }}
                        >
                            Weekly goal: {targetDays} days
                        </Text>
                    </View>
                </View>

                {/* Name */}
                <Text
                    className="mt-2 mb-2 text-[13px] font-extrabold"
                    style={{ color: text }}
                >
                    Name
                </Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Drink water / Run / Read"
                    placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                    style={[
                        {
                            backgroundColor: isDark ? '#0b1220' : '#f8fafc',
                            borderColor: border,
                            color: text,
                        },
                    ]}
                    className="border rounded-2xl px-3 py-2.5 text-sm"
                    returnKeyType="done"
                />

                {/* Target days */}
                <Text
                    className="mt-2 mb-2 text-[13px] font-extrabold"
                    style={{ color: text }}
                >
                    Weekly goal
                </Text>
                <View className="flex-row flex-wrap gap-2.5 mb-1.5">
                    {Array.from({ length: 7 }).map((_, idx) => {
                        const v = idx + 1;
                        const active = v === targetDays;
                        return (
                            <Pressable
                                key={v}
                                onPress={() => setTargetDays(v)}
                                className="min-w-[42px] px-3 py-2.5 rounded-2xl border items-center"
                                style={[
                                    {
                                        backgroundColor: active
                                            ? '#8b5cf6'
                                            : isDark
                                                ? '#0b1220'
                                                : '#f8fafc',
                                        borderColor: active
                                            ? '#8b5cf6'
                                            : border,
                                    },
                                ]}
                            >
                                <Text
                                    className="text-[13px] font-extrabold"
                                    style={{
                                        color: active
                                            ? '#fff'
                                            : isDark
                                                ? '#cbd5e1'
                                                : '#475569',
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
                    className="mt-2 mb-2 text-[13px] font-extrabold"
                    style={{ color: text }}
                >
                    Color
                </Text>
                <View className="flex-row gap-2.5 mb-1.5">
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
                <View className="flex-row justify-between items-center mt-1.5">
                    <Text
                        className="mt-2 mb-2 text-[13px] font-extrabold"
                        style={{ color: text }}
                    >
                        Action icon
                    </Text>
                    <Text
                        className="text-xs font-semibold"
                        style={{ color: subText }}
                    >
                        {filteredIcons.length} icons
                    </Text>
                </View>
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search icons (e.g. run / book / water)"
                    placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                    style={[
                        {
                            backgroundColor: isDark ? '#0b1220' : '#f8fafc',
                            borderColor: border,
                            color: text,
                        },
                    ]}
                    className="border rounded-2xl px-3 py-2.5 text-sm mb-2"
                />

                {/* Icon grid */}
                <View className="flex-row flex-wrap gap-2.5 pb-3">
                    {filteredIcons.map(i => (
                        <IconOption
                            key={i}
                            icon={i}
                            selected={i === icon}
                            isDark={isDark}
                            onPress={() => setIcon(i)}
                        />
                    ))}
                </View>

                {/* Footer */}
                <View className="flex-row gap-3 pt-2.5 pb-2">
                    <Pressable
                        onPress={onClose}
                        className="flex-1 h-12 rounded-2xl border items-center justify-center"
                        style={[
                            {
                                borderColor: border,
                                backgroundColor: isDark
                                    ? '#0b1220'
                                    : '#ffffff',
                            },
                        ]}
                    >
                        <Text style={{ color: text, fontWeight: '600' }}>
                            Cancel
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={handleSave}
                        disabled={!canSave}
                        className="flex-1 h-12 rounded-2xl items-center justify-center"
                        style={[
                            {
                                opacity: canSave ? 1 : 0.5,
                                backgroundColor: '#8b5cf6',
                            },
                        ]}
                    >
                        <Text style={{ color: '#fff', fontWeight: '700' }}>
                            Save
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </BottomSheetScrollView>
    );
};

export default CreateHabitSheet;
