import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { type Habit } from '../constant/mockHabits';
import { useUIStore } from '../store/uiStore';
import { usePreferencesStore } from '../store/usePreferencesStore';

interface UseHabitCelebrationTriggerProps {
    habits: Habit[];
    selectedDate: string;
    todayIndex: number;
    toggleHabitToday: (habitId: string, dayIndex: number) => void;
    triggerCelebration: (habit: Habit) => void;
}

export function useHabitCelebrationTrigger({
    habits,
    selectedDate,
    todayIndex,
    toggleHabitToday,
    triggerCelebration,
}: UseHabitCelebrationTriggerProps) {
    // 跟踪刚刚完成的习惯，用于庆祝逻辑
    const [justCompletedHabit, setJustCompletedHabit] = useState<Habit | null>(null);

    // 监听 habits 变化，检查是否所有习惯都完成了
    useEffect(() => {
        if (justCompletedHabit) {
            // 基础检查：是否所有习惯都已完成，且习惯总数至少为 2
            const todayCompletedCount = habits.filter(h => h.completedToday).length;
            
            if (todayCompletedCount !== habits.length || habits.length < 2) {
                 setJustCompletedHabit(null);
                 return;
            }

            // 延迟执行以等待成就解锁动画状态更新（避免冲突）
            const timer = setTimeout(() => {
                // 1. 检查是否有成就动画正在播放
                const isAchievementAnimating = useUIStore.getState().isUnlockAnimationActive;
                if (isAchievementAnimating) {
                     setJustCompletedHabit(null);
                     return;
                }
                
                // 2. 检查今天是否已经庆祝过
                const today = format(new Date(), 'yyyy-MM-dd');
                const lastCelebration = usePreferencesStore.getState().lastHabitCelebrationDate;
                
                if (lastCelebration !== today) {
                    triggerCelebration(justCompletedHabit);
                    usePreferencesStore.getState().setLastHabitCelebrationDate(today);
                }
                
                setJustCompletedHabit(null);
            }, 500);
            
            return () => clearTimeout(timer);
        }
    }, [habits, justCompletedHabit, triggerCelebration]);

    const toggleHabit = useCallback(
        (habitId: string) => {
            const habit = habits.find(h => h.id === habitId);
            const wasCompleted = habit?.completedToday;

            // 如果是今天且习惯之前没完成，标记为刚刚完成
            if (selectedDate === format(new Date(), 'yyyy-MM-dd') && habit && !wasCompleted) {
                setJustCompletedHabit(habit);
            }

            toggleHabitToday(habitId, todayIndex);
        },
        [habits, selectedDate, todayIndex, toggleHabitToday],
    );

    return toggleHabit;
}
