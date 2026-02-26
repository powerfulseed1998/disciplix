import React, { RefObject, useCallback, useRef } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { useThemeContext } from '../../providers/ThemeProvider';
import { Task } from '../../store/useTasksStore';
import TaskCard from './TaskCard';
import { TasksHeader } from './TasksHeader';

const EmptyState = () => {
    const { isDark } = useThemeContext();
    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryTextColor = isDark ? '#94a3b8' : '#64748b';

    return (
        <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={{ alignItems: 'center', paddingVertical: 48 }}
        >
            <View
                className="w-20 h-20 rounded-3xl items-center justify-center mb-4"
                style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
            >
                <FontAwesome6
                    name="clipboard-check"
                    size={32}
                    color={isDark ? '#334155' : '#cbd5e1'}
                />
            </View>

            <Text
                className="text-lg font-semibold mb-2"
                style={{ color: textColor }}
            >
                No tasks yet
            </Text>
            <Text
                className="text-sm text-center"
                style={{ color: secondaryTextColor }}
            >
                Tap the + button to create your first task
            </Text>
        </Animated.View>
    );
};

interface TasksSectionProps {
    filteredTasks: Task[];
    sortBy: 'priority' | 'time';
    handleToggleSortMenu: () => void;
    sortButtonRef: RefObject<View | null>;
    onToggleDetail: (task: Task, startInEdit?: boolean) => void;
    onSetPriority: (taskId: string) => void;
}

// Define a minimal interface for the Swipeable ref
interface SwipeableRef {
    close: () => void;
}

const TasksSection = (props: TasksSectionProps) => {
    const {
        filteredTasks,
        sortBy,
        handleToggleSortMenu,
        sortButtonRef,
        onToggleDetail,
        onSetPriority,
    } = props;

    const activeSwipeableRef = useRef<SwipeableRef | null>(null);

    const onSwipeStart = useCallback((ref: SwipeableRef | null) => {
        if (activeSwipeableRef.current && activeSwipeableRef.current !== ref) {
            activeSwipeableRef.current?.close();
        }
        activeSwipeableRef.current = ref;
    }, []);

    return (
        <>
            <TasksHeader
                sortBy={sortBy}
                handleToggleSortMenu={handleToggleSortMenu}
                sortButtonRef={sortButtonRef}
            />

            <View className="w-full gap-3 items-center">
                {filteredTasks.map((item, index) => (
                    <TaskCard
                        key={item.id}
                        item={item}
                        index={index}
                        onToggleDetail={onToggleDetail}
                        onSetPriority={onSetPriority}
                        onSwipeStart={onSwipeStart}
                    />
                ))}

                {filteredTasks.length === 0 && <EmptyState />}
            </View>
        </>
    );
};

export default TasksSection;
