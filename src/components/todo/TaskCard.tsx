import React, { memo, useRef } from 'react';
import Animated, {
    useSharedValue,
    withSequence,
    withSpring,
    useAnimatedStyle,
    FadeInDown,
    useAnimatedProps,
    withTiming,
    createAnimatedComponent,
    interpolate,
    SharedValue,
} from 'react-native-reanimated';
import { Pressable, View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import { Task, useTasksStore } from '../../store/useTasksStore';
import { useThemeContext } from '../../providers/ThemeProvider';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { useTranslation } from 'react-i18next';
import SwipeHintOverlay from './SwipeHintOverlay';

const AnimatedPath = createAnimatedComponent(Path);

interface TaskCardProps {
    item: Task;
    index: number;
    // 只保留涉及 UI 交互（弹窗）的回调，数据操作内部解决
    onToggleDetail: (task: Task, startInEdit: boolean) => void;
    onSetPriority: (id: string) => void;
    onSwipeStart: (ref: any) => void;
}

interface RightActionsProps {
    progress: SharedValue<number>;
    drag: SharedValue<number>;
    item: Task;
    onEdit: () => void;
    onSetPriority: () => void;
    onTogglePin: () => void;
    onDelete: () => void;
}

const RightActions = ({
    progress,
    drag,
    item,
    onEdit,
    onSetPriority,
    onTogglePin,
    onDelete,
}: RightActionsProps) => {
    const animatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            progress.value,
            [0, 1],
            [200, 0],
        );

        const opacity = interpolate(
            progress.value,
            [0, 0.15],
            [0, 1],
        );

        return {
            transform: [{ translateX }],
            opacity,
        };
    });

    return (
        <Animated.View style={[{ flexDirection: 'row' }, animatedStyle]}>
            <Pressable
                onPress={onEdit}
                className="w-14 bg-blue-500 justify-center items-center"
            >
                <FontAwesome6 name="pencil" size={16} color="white" />
            </Pressable>
            <Pressable
                onPress={onSetPriority}
                className="w-14 bg-orange-500 justify-center items-center"
            >
                <FontAwesome6 name="flag" size={16} color="white" />
            </Pressable>
            <Pressable
                onPress={onTogglePin}
                className="w-14 bg-purple-500 justify-center items-center"
            >
                <FontAwesome6
                    name="thumbtack"
                    size={16}
                    color="white"
                    style={{
                        transform: [
                            { rotate: item.pinnedAt ? '45deg' : '0deg' },
                        ],
                    }}
                />
            </Pressable>
            <Pressable
                onPress={onDelete}
                className="w-14 bg-red-500 justify-center items-center rounded-r-[20px]"
            >
                <FontAwesome6 name="trash" size={16} color="white" />
            </Pressable>
        </Animated.View>
    );
};

// Task Card Component with animation
const TaskCard = memo(
    ({ item, index, onToggleDetail, onSetPriority, onSwipeStart }: TaskCardProps) => {
        const { t } = useTranslation();
        const { isDark } = useThemeContext();
        const textColor = isDark ? '#fff' : '#1e293b';
        const secondaryTextColor = isDark ? '#64748b' : '#94a3b8';

        const updateTask = useTasksStore(state => state.updateTask);
        const deleteTask = useTasksStore(state => state.deleteTask);
        const togglePin = useTasksStore(state => state.togglePin);

        const { hasShownSwipeHint, hydrated, markSwipeHintShown } = usePreferencesStore();
        const showHint = hydrated && !hasShownSwipeHint && index === 0;

        const swipeableRef = useRef<any>(null);

        const handleToggleCompleted = () => {
            updateTask({ ...item, completed: !item.completed });
        };

        const scale = useSharedValue(1);
        const checkProgress = useSharedValue(item.completed ? 1 : 0);

        // 对勾路径的长度
        const checkPathLength = 18;

        const handlePressCheckbox = () => {
            scale.value = withSequence(
                withSpring(0.97, { damping: 10, stiffness: 400 }),
                withSpring(1, { damping: 10, stiffness: 400 }),
            );

            if (!item.completed) {
                checkProgress.value = withTiming(1, { duration: 350 });
            } else {
                checkProgress.value = withTiming(0, { duration: 280 });
            }

            handleToggleCompleted();
        };

        const cardStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
        }));

        // SVG对勾路径动画属性
        const checkPathProps = useAnimatedProps(() => {
            const dashOffset =
                checkPathLength - checkProgress.value * checkPathLength;
            return {
                strokeDashoffset: dashOffset,
            };
        });

        // item.category 现在已经是完整的Category对象
        const category = item.category;
        const categoryColor = category?.color || '#6366f1';

        const getPriorityColor = (priority: string) => {
            switch (priority) {
                case 'low':
                    return '#22c55e';
                case 'medium':
                    return '#f59e0b';
                case 'high':
                    return '#f97316';
                case 'urgent':
                    return '#ef4444';
                default:
                    return secondaryTextColor;
            }
        };

        return (
            <Animated.View
                style={{ width: '100%', marginBottom: 10 }}
                entering={FadeInDown.delay(index * 60).springify()}
            >
                <Animated.View style={cardStyle}>
                    <Swipeable
                        ref={swipeableRef}
                        friction={2}
                        rightThreshold={40}
                        overshootRight={false}
                        onSwipeableWillOpen={() => {
                            if (!hasShownSwipeHint) {
                                markSwipeHintShown();
                            }
                        }}
                        onSwipeableOpenStartDrag={() => onSwipeStart(swipeableRef.current)}
                        renderRightActions={(progress, drag) => (
                            <RightActions
                                progress={progress}
                                drag={drag}
                                item={item}
                                onEdit={() => onToggleDetail(item, true)}
                                onSetPriority={() => onSetPriority(item.id)}
                                onTogglePin={() => togglePin(item.id)}
                                onDelete={() => deleteTask(item.id)}
                            />
                        )}
                    >
                        <View
                            className="flex-row items-center p-4 rounded-[20px] border overflow-hidden"
                            style={{
                                backgroundColor: item.pinnedAt
                                    ? isDark
                                        ? 'rgba(88, 28, 135, 0.2)'
                                        : 'rgba(196, 181, 253, 0.3)'
                                    : isDark
                                        ? '#1e293b'
                                        : '#ffffff',
                                borderColor: item.pinnedAt
                                    ? isDark
                                        ? '#7c3aed'
                                        : '#c084fc'
                                    : isDark
                                        ? '#475569'
                                        : '#e2e8f0',
                            }}
                        >
                            {/* Category color indicator */}
                            <View
                                className="absolute left-0 top-0 bottom-0 w-1"
                                style={{ backgroundColor: categoryColor }}
                            />

                            {/* Checkbox */}
                            <Pressable
                                onPress={handlePressCheckbox}
                                className="w-6 h-6 rounded-lg border-2 items-center justify-center ml-2 mr-4"
                                style={{
                                    backgroundColor: item.completed
                                        ? '#8b5cf6'
                                        : 'transparent',
                                    borderColor: item.completed
                                        ? '#8b5cf6'
                                        : isDark
                                            ? '#475569'
                                            : '#cbd5e1',
                                }}
                            >
                                <Svg width={32} height={32} viewBox="0 0 24 24">
                                    <AnimatedPath
                                        d="M8 12l2 2l4-4"
                                        stroke="#fff"
                                        strokeWidth={2.1}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                        strokeDasharray={`${checkPathLength} ${checkPathLength}`}
                                        animatedProps={checkPathProps}
                                    />
                                </Svg>
                            </Pressable>

                            {/* Content */}
                            <Pressable
                                onPress={() => onToggleDetail(item, false)}
                                className="flex-1 ml-3.5 mr-4"
                            >
                                <Text
                                    className="text-[15px] font-semibold mb-1"
                                    style={{
                                        color: item.completed
                                            ? secondaryTextColor
                                            : textColor,
                                        textDecorationLine: item.completed
                                            ? 'line-through'
                                            : 'none',
                                    }}
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>
                                <View className="flex-row items-center gap-2.5">
                                    {item.time && (
                                        (() => {
                                            const date = new Date(item.time);
                                            const today = new Date();
                                            const tomorrow = new Date(today);
                                            tomorrow.setDate(today.getDate() + 1);

                                            const isToday = date.toDateString() === today.toDateString();
                                            const isTomorrow = date.toDateString() === tomorrow.toDateString();

                                            // Handle All Day tasks
                                            if (item.isAllDay) {
                                                if (isToday) return null; // Don't show anything for today's all-day tasks

                                                // For future all-day tasks, show date/tomorrow text
                                                let dateText = '';
                                                if (isTomorrow) {
                                                    dateText = 'Tomorrow';
                                                } else {
                                                    dateText = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                                }

                                                return (
                                                    <View className="flex-row items-center gap-1">
                                                        <FontAwesome6
                                                            name="calendar"
                                                            size={10}
                                                            color={secondaryTextColor}
                                                        />
                                                        <Text
                                                            className="text-xs font-medium"
                                                            style={{ color: secondaryTextColor }}
                                                        >
                                                            {dateText}
                                                        </Text>
                                                    </View>
                                                );
                                            }

                                            // Handle Regular tasks (with specific time)
                                            const timeStr = date.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            });

                                            let displayStr = '';
                                            if (isToday) {
                                                displayStr = timeStr;
                                            } else if (isTomorrow) {
                                                displayStr = `Tomorrow ${timeStr}`;
                                            } else {
                                                displayStr = `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
                                            }

                                            return (
                                                <View className="flex-row items-center gap-1">
                                                    <FontAwesome6
                                                        name="clock"
                                                        size={10}
                                                        color={secondaryTextColor}
                                                    />
                                                    <Text
                                                        className="text-xs font-medium"
                                                        style={{ color: secondaryTextColor }}
                                                    >
                                                        {displayStr}
                                                    </Text>
                                                </View>
                                            );
                                        })()
                                    )}
                                    {item.priority && (
                                        <View className="flex-row items-center gap-1">
                                            <FontAwesome6
                                                name="flag"
                                                size={10}
                                                color={getPriorityColor(
                                                    item.priority,
                                                )}
                                                solid
                                            />
                                            <Text
                                                className="text-[11px] font-semibold capitalize"
                                                style={{
                                                    color: getPriorityColor(
                                                        item.priority,
                                                    ),
                                                }}
                                            >
                                                {item.priority}
                                            </Text>
                                        </View>
                                    )}
                                    {item.category && (
                                        <View
                                            className="px-2 py-0.5 rounded-md"
                                            style={{
                                                backgroundColor:
                                                    categoryColor + '15',
                                            }}
                                        >
                                            <Text
                                                className="text-[11px] font-semibold capitalize"
                                                style={{ color: categoryColor }}
                                            >
                                                {t(`todo.categories.${item.category.id}`, item.category.label)}
                                            </Text>
                                        </View>
                                    )}
                                    {/* 置顶状态指示器 */}
                                    {item.pinnedAt && (
                                        <View className="flex-row items-center">
                                            <FontAwesome6
                                                name="thumbtack"
                                                size={10}
                                                color="#8b5cf6"
                                                solid
                                            />
                                            <Text className="text-[10px] font-medium ml-1 text-purple-600 dark:text-purple-400">
                                                PINNED
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </Pressable>

                            {showHint && <SwipeHintOverlay />}
                        </View>
                    </Swipeable>
                </Animated.View>
            </Animated.View>
        );
    },
);

export default TaskCard;
