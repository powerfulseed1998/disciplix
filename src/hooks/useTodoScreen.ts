import { useRef, useMemo, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useHomeState } from './useHomeState';
import { useTasksStore, Task } from '../store/useTasksStore';
import { useAchievementStore } from '../store/achievementStore';

interface SwipeableRef {
    close: () => void;
}

export type TodoListItem =
    { type: 'task'; key: string; data: Task; index: number };

export function useTodoScreen() {
    const { tasks, setPriority } = useTasksStore();
    const { checkDailyReset } = useAchievementStore();
    const activeSwipeableRef = useRef<SwipeableRef | null>(null);

    const { state, actions, refs, animations } = useHomeState();

    useEffect(() => {
        checkDailyReset();
        const interval = setInterval(checkDailyReset, 60000);
        return () => clearInterval(interval);
    }, [checkDailyReset]);

    function onSwipeStart(ref: SwipeableRef | null) {
        if (activeSwipeableRef.current && activeSwipeableRef.current !== ref) {
            activeSwipeableRef.current?.close();
        }
        activeSwipeableRef.current = ref;
    }

    function handleTaskDetail(task: Task, startInEdit: boolean) {
        actions.selectTask(task, startInEdit ? 'edit' : 'view');
        refs.bottomSheetModalRef.current?.present();
    }

    function handleToggleSortMenu() {
        if (state.isSortMenuVisible) {
            animations.sortMenuAnimation.value = withTiming(0, { duration: 150 }, () => {
                scheduleOnRN(actions.toggleSortMenu);
            });
        } else {
            refs.sortButtonRef.current?.measureInWindow((x, y, width, height) => {
                actions.setSortButtonPosition({ x, y, width, height });
                actions.toggleSortMenu();
                animations.sortMenuAnimation.value = withTiming(1, { duration: 200 });
            });
        }
    }

    function handleSelectSort(sort: 'time' | 'priority') {
        actions.setSortBy(sort);
        animations.sortMenuAnimation.value = withTiming(0, { duration: 150 }, () => {
            scheduleOnRN(actions.toggleSortMenu);
        });
    }

    function handleOpenNewTask() {
        actions.openNewTaskModal();
        animations.expandProgress.value = withSpring(1, {
            damping: 14,
            stiffness: 100,
            overshootClamping: true,
        });
    }

    function handleCloseNewTask() {
        Keyboard.dismiss();
        animations.expandProgress.value = withTiming(0, { duration: 300 }, finished => {
            if (finished) scheduleOnRN(actions.closeNewTaskModal);
        });
    }

    function handlePrioritySelect(priority: 'low' | 'medium' | 'high' | 'urgent' | undefined) {
        if (state.priorityTaskId) {
            setPriority(state.priorityTaskId, priority);
            actions.closePriorityModal();
        }
    }

    const filteredTasks = useMemo(() => {
        let filtered = tasks.filter(t => state.activeCategory === 'all' || (t.category && t.category.id === state.activeCategory));
        const pinnedTasks = filtered.filter(t => t.pinnedAt);
        const unpinnedTasks = filtered.filter(t => !t.pinnedAt);

        pinnedTasks.sort((a, b) => {
            const aTime = a.pinnedAt ? new Date(a.pinnedAt).getTime() : 0;
            const bTime = b.pinnedAt ? new Date(b.pinnedAt).getTime() : 0;
            return bTime - aTime;
        });

        if (state.sortBy === 'priority') {
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            unpinnedTasks.sort((a, b) => {
                const aPriority = a.priority ? priorityOrder[a.priority] : 0;
                const bPriority = b.priority ? priorityOrder[b.priority] : 0;
                return bPriority - aPriority;
            });
        } else if (state.sortBy === 'time') {
            unpinnedTasks.sort((a, b) => {
                if (!a.time && !b.time) return 0;
                if (!a.time) return 1;
                if (!b.time) return -1;
                return new Date(a.time).getTime() - new Date(b.time).getTime();
            });
        }
        return [...pinnedTasks, ...unpinnedTasks];
    }, [tasks, state.activeCategory, state.sortBy]);

    const listData = useMemo<TodoListItem[]>(() =>
        filteredTasks.map((task, index) => ({
            type: 'task' as const,
            key: task.id,
            data: task,
            index,
        })),
    [filteredTasks]);

    return {
        state,
        actions,
        refs,
        animations,
        listData,
        onSwipeStart,
        handleTaskDetail,
        handleToggleSortMenu,
        handleSelectSort,
        handleOpenNewTask,
        handleCloseNewTask,
        handlePrioritySelect,
        tasks,
    };
}
