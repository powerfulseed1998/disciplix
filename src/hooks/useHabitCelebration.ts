import { useState } from 'react';
import { type Habit } from '../constant/mockHabits';

export function useHabitCelebration() {
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationHabit, setCelebrationHabit] = useState<Habit | null>(null);

    const triggerCelebration = (habit: Habit) => {
        setCelebrationHabit(habit);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
    };

    return {
        showCelebration,
        celebrationHabit,
        triggerCelebration,
    };
}
