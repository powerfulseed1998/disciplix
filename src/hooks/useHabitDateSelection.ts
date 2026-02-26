import { useState } from 'react';
import { format } from 'date-fns';

export function useHabitDateSelection() {
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1;

    // 计算选择日期对应的星期索引
    const selectedDateObj = new Date(selectedDate);
    const selectedDayIndex = selectedDateObj.getDay() === 0 ? 6 : selectedDateObj.getDay() - 1;

    const isSelectedDateToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

    return {
        selectedDate,
        setSelectedDate,
        todayIndex,
        selectedDayIndex,
        selectedDateObj,
        isSelectedDateToday,
    };
}
