import { format } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { type Habit } from '../constant/mockHabits';
import i18n from '../i18n';

export function getDayIndex(date: Date): number {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
}

export function shouldShowCelebration(
    selectedDate: string,
    habit: Habit,
    wasCompleted: boolean
): boolean {
    const isTodaySelected = selectedDate === format(new Date(), 'yyyy-MM-dd');
    return isTodaySelected && !wasCompleted;
}

export function getHabitTitle(selectedDate: string, selectedDateObj: Date): string {
    const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');
    
    if (isToday) {
        return i18n.t('habits.todaysHabits');
    }

    const locale = i18n.language.startsWith('zh') ? zhCN : enUS;
    const formattedDate = format(selectedDateObj, 'MMM dd', { locale });
    
    return i18n.t('habits.dateHabits', { date: formattedDate });
}
