import { useMemo } from 'react';
import { format, differenceInCalendarDays, parseISO } from 'date-fns';
import { type Habit } from '../constant/mockHabits';

export type FilteredHabit = Habit & {
    isEditable: boolean;
};

interface UseHabitFilteringProps {
    habits: Habit[];
    isSelectedDateToday: boolean;
    selectedDateObj: Date;
    selectedDate: string;
}

export function useHabitFiltering({
    habits,
    isSelectedDateToday,
    selectedDateObj,
    selectedDate,
}: UseHabitFilteringProps) {
    const filteredHabits: FilteredHabit[] = useMemo(() => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const isFutureDate = selectedDate > todayStr;
        const selectedKey = selectedDate;

        return habits.map(habit => {
            const completedOnSelectedDate = !!habit.completedDates?.[selectedKey];

            const completedFlag = isFutureDate ? false : completedOnSelectedDate;

            return {
                ...habit,
                completedToday: completedFlag,
                // 只有“今天”可以编辑，过去和未来日期只读
                isEditable: isSelectedDateToday,
            };
        });
    }, [habits, isSelectedDateToday, selectedDate]);

    const completedCount = filteredHabits.filter(h => h.completedToday).length;
    const completionRate = habits.length === 0 ? 0 : (completedCount / habits.length) * 100;
    
    // Calculate best streak based on days where at least one habit was completed
    const bestStreak = useMemo(() => {
        const allDates = new Set<string>();
        const todayStr = format(new Date(), 'yyyy-MM-dd');

        habits.forEach(h => {
            if (h.completedDates) {
                Object.keys(h.completedDates).forEach(date => {
                    if (h.completedDates![date]) {
                        allDates.add(date);
                    }
                });
            }
        });

        // Filter out future dates and sort
        const sortedDates = Array.from(allDates)
            .filter(date => date <= todayStr)
            .sort();

        if (sortedDates.length === 0) return 0;

        let maxStreak = 1;
        let currentStreak = 1;

        for (let i = 1; i < sortedDates.length; i++) {
            const prev = parseISO(sortedDates[i - 1]);
            const curr = parseISO(sortedDates[i]);
            
            const diff = differenceInCalendarDays(curr, prev);
            
            if (diff === 1) {
                currentStreak++;
            } else {
                maxStreak = Math.max(maxStreak, currentStreak);
                currentStreak = 1;
            }
        }
        
        return Math.max(maxStreak, currentStreak);
    }, [habits]);

    return {
        filteredHabits,
        completedCount,
        completionRate,
        bestStreak,
    };
}
