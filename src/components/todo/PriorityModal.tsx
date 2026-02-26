import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, BackHandler } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, {
    FadeIn,
    FadeOut,
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';

type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface PriorityOption {
    value: Priority | undefined;
    label: string;
    icon: string;
    color: string;
    description: string;
}

const PRIORITY_OPTIONS: PriorityOption[] = [
    {
        value: undefined,
        label: 'No Priority',
        icon: 'minus',
        color: '#64748b',
        description: 'No special priority',
    },
    {
        value: 'low',
        label: 'Low',
        icon: 'flag',
        color: '#22c55e',
        description: 'Can be done later',
    },
    {
        value: 'medium',
        label: 'Medium',
        icon: 'flag',
        color: '#f59e0b',
        description: 'Should be done soon',
    },
    {
        value: 'high',
        label: 'High',
        icon: 'flag',
        color: '#f97316',
        description: 'Important task',
    },
    {
        value: 'urgent',
        label: 'Urgent',
        icon: 'flag',
        color: '#ef4444',
        description: 'Critical task',
    },
];

interface PriorityModalProps {
    isVisible: boolean;
    currentPriority?: Priority;
    onSelectPriority: (priority: Priority | undefined) => void;
    onClose: () => void;
    isDark: boolean;
}

export default function PriorityModal({
    isVisible,
    currentPriority,
    onSelectPriority,
    onClose,
    isDark,
}: PriorityModalProps) {
    const bgColor = isDark ? '#0f172a' : '#f8fafc';
    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryTextColor = isDark ? '#94a3b8' : '#64748b';
    const cardBg = isDark ? '#1e293b' : '#fff';

    useEffect(() => {
        const onBackPress = () => {
            if (isVisible) {
                onClose();
                return true;
            }
            return false;
        };

        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress,
        );
        return () => subscription.remove();
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[
                styles.overlay,
                StyleSheet.absoluteFill,
                { zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.5)' },
            ]}
        >
            <Pressable style={styles.overlayPressable} onPress={onClose} />

            <Animated.View
                entering={FadeInUp.springify()}
                style={[styles.modal, { backgroundColor: bgColor }]}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: textColor }]}>
                        Set Priority
                    </Text>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <FontAwesome6
                            name="x"
                            size={16}
                            color={secondaryTextColor}
                        />
                    </Pressable>
                </View>

                <View style={styles.optionsContainer}>
                    {PRIORITY_OPTIONS.map((option, index) => {
                        const isSelected = currentPriority === option.value;

                        return (
                            <Animated.View
                                key={option.value || 'none'}
                                entering={FadeInDown.delay(
                                    index * 50,
                                ).springify()}
                            >
                                <Pressable
                                    onPress={() => {
                                        onSelectPriority(option.value);
                                        onClose();
                                    }}
                                    style={[
                                        styles.option,
                                        {
                                            backgroundColor: isSelected
                                                ? option.color + '15'
                                                : cardBg,
                                            borderColor: isSelected
                                                ? option.color
                                                : isDark
                                                    ? '#334155'
                                                    : '#e2e8f0',
                                            borderWidth: isSelected ? 1.5 : 1,
                                        },
                                    ]}
                                >
                                    <View style={styles.optionLeft}>
                                        <View
                                            style={[
                                                styles.iconContainer,
                                                {
                                                    backgroundColor:
                                                        option.color + '20',
                                                },
                                            ]}
                                        >
                                            <FontAwesome6
                                                name={option.icon as any}
                                                size={16}
                                                color={option.color}
                                                solid={
                                                    option.value !== undefined
                                                }
                                            />
                                        </View>
                                        <View style={styles.optionText}>
                                            <Text
                                                style={[
                                                    styles.optionLabel,
                                                    { color: textColor },
                                                ]}
                                            >
                                                {option.label}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.optionDescription,
                                                    {
                                                        color: secondaryTextColor,
                                                    },
                                                ]}
                                            >
                                                {option.description}
                                            </Text>
                                        </View>
                                    </View>

                                    {isSelected && (
                                        <View
                                            style={[
                                                styles.selectedIndicator,
                                                {
                                                    backgroundColor:
                                                        option.color,
                                                },
                                            ]}
                                        >
                                            <FontAwesome6
                                                name="check"
                                                size={12}
                                                color="#fff"
                                            />
                                        </View>
                                    )}
                                </Pressable>
                            </Animated.View>
                        );
                    })}
                </View>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayPressable: {
        ...StyleSheet.absoluteFillObject,
    },
    modal: {
        margin: 20,
        borderRadius: 20,
        padding: 20,
        width: '85%',
        maxWidth: 400,
        maxHeight: '70%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 8,
        borderRadius: 8,
    },
    optionsContainer: {
        gap: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        justifyContent: 'space-between',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    optionText: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    optionDescription: {
        fontSize: 14,
    },
    selectedIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
