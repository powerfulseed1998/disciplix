import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useThemeContext } from '../../providers/ThemeProvider';
import { format } from 'date-fns';

interface FullCalendarContentProps {
    selectedDate: Date;
    onDateChange: (dateString: string) => void;
}

export default function FullCalendarContent({ selectedDate, onDateChange }: FullCalendarContentProps) {
    const { isDark } = useThemeContext();
    const currentSelectedString = format(selectedDate, 'yyyy-MM-dd');

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <Calendar
                // Initially visible month. Default = now
                current={currentSelectedString}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day: DateData) => {
                    onDateChange(day.dateString);
                }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'yyyy MM'}
                // Hide month navigation arrows. Default = false
                hideArrows={false}
                // Do not show days of other months in month page. Default = false
                hideExtraDays={true}
                // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                disableMonthChange={true}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
                firstDay={1}
                // Enable the option to swipe between months. Default = false
                enableSwipeMonths={true}
                
                // Theme
                theme={{
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    calendarBackground: isDark ? '#1e293b' : '#ffffff',
                    textSectionTitleColor: isDark ? '#94a3b8' : '#b6c1cd',
                    selectedDayBackgroundColor: isDark ? '#475569' : '#4b5563',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: isDark ? '#94a3b8' : '#4b5563',
                    dayTextColor: isDark ? '#e2e8f0' : '#3b4a5a',
                    textDisabledColor: isDark ? '#475569' : '#d9e1e8',
                    dotColor: '#7cb8d9',
                    selectedDotColor: '#ffffff',
                    arrowColor: isDark ? '#e2e8f0' : '#4b5563',
                    monthTextColor: isDark ? '#e2e8f0' : '#3b4a5a',
                    indicatorColor: 'blue',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 16
                }}
                
                // Marking
                markedDates={{
                    [currentSelectedString]: {selected: true, disableTouchEvent: true, selectedColor: isDark ? '#475569' : '#4b5563'}
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    containerDark: {
        backgroundColor: '#1e293b',
    }
});
