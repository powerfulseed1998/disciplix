import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useAchievementStore } from './achievementStore';

export type Category = {
    id: string;
    label: string;
    icon: string;
    color: string;
};
type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    category?: Category;
    priority?: Priority;
    time?: Date;
    isAllDay?: boolean; // 是否为全天任务
    pinnedAt?: Date; // 置顶时间戳，undefined表示未置顶
};

type TasksState = {
    tasks: Task[];
    addTask: (task: Task) => void;
    updateTask: (task: Task) => void;
    deleteTask: (id: string) => boolean;
    setPriority: (id: string, priority: Priority | undefined) => void;
    togglePin: (id: string) => void; // 切换置顶状态
};

export const useTasksStore = create<TasksState>()(
    persist(
        (set, get) => ({
            tasks: [],
            addTask: task => set(state => ({ tasks: [...state.tasks, task] })),
            updateTask: task => {
                const { tasks } = get();
                const oldTask = tasks.find(t => t.id === task.id);
                const wasCompleted = oldTask?.completed;
                const isCompleted = task.completed;

                if (!wasCompleted && isCompleted) {
                    useAchievementStore.getState().addXP(300);
                    useAchievementStore.getState().checkIn();
                } else if (wasCompleted && !isCompleted) {
                    useAchievementStore.getState().addXP(-300);
                }

                set(state => ({
                    tasks: state.tasks.map(t => (t.id === task.id ? task : t)),
                }));
            },
            deleteTask: id => {
                const { tasks } = get();
                if (tasks.some(t => t.id === id)) {
                    set({ tasks: tasks.filter(t => t.id !== id) });
                    return true;
                }
                return false;
            },
            setPriority: (id, priority) =>
                set(state => ({
                    tasks: state.tasks.map(t =>
                        t.id === id ? { ...t, priority } : t,
                    ),
                })),
            togglePin: id =>
                set(state => ({
                    tasks: state.tasks.map(t =>
                        t.id === id
                            ? {
                                ...t,
                                pinnedAt: t.pinnedAt ? undefined : new Date(), // 置顶时设置时间戳，取消置顶时清除
                            }
                            : t,
                    ),
                })),
        }),
        {
            name: 'tasks-store',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
