import React from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

interface SortMenuProps {
    isVisible: boolean;
    animatedStyle: any;
    buttonPosition: { x: number; y: number; width: number; height: number };
    sortBy: 'time' | 'priority';
    onSelectSort: (sort: 'time' | 'priority') => void;
    onToggleMenu: () => void;
    cardBg: string;
    textColor: string;
    secondaryTextColor: string;
}

const sortOptions = [
    { id: 'priority', labelKey: 'todo.byPriority', icon: 'flag' },
    { id: 'time', labelKey: 'todo.byTime', icon: 'clock' },
] as const;

const SortMenu = ({
    isVisible,
    animatedStyle,
    buttonPosition,
    sortBy,
    onSelectSort,
    onToggleMenu,
    cardBg,
    textColor,
    secondaryTextColor,
}: SortMenuProps) => {
    const { t } = useTranslation();

    if (!isVisible) return null;

    return (
        <>
            <Pressable
                className="absolute inset-0 z-[99]"
                onPress={onToggleMenu}
            />
            <Animated.View
                className="absolute rounded-xl p-2 shadow-sm shadow-black/10 z-[100]"
                style={[
                    {
                        top: buttonPosition.y + buttonPosition.height + 5,
                        right:
                            Dimensions.get('window').width -
                            buttonPosition.x -
                            buttonPosition.width,
                        backgroundColor: cardBg,
                        elevation: 5,
                    },
                    animatedStyle,
                ]}
            >
                {sortOptions.map(option => (
                    <Pressable
                        key={option.id}
                        className="flex-row items-center py-2.5 px-3 rounded-lg"
                        style={{
                            backgroundColor:
                                sortBy === option.id
                                    ? cardBg === '#1e293b'
                                        ? '#334155'
                                        : '#f1f5f9'
                                    : 'transparent',
                        }}
                        onPress={() => onSelectSort(option.id)}
                    >
                        <FontAwesome6
                            name={option.icon as any}
                            size={14}
                            color={
                                sortBy === option.id
                                    ? textColor
                                    : secondaryTextColor
                            }
                            style={{ width: 20 }}
                        />
                        <Text
                            className="ml-2.5 font-medium"
                            style={{
                                color:
                                    sortBy === option.id
                                        ? textColor
                                        : secondaryTextColor,
                            }}
                        >
                            {t(option.labelKey)}
                        </Text>
                    </Pressable>
                ))}
            </Animated.View>
        </>
    );
};

export default SortMenu;
