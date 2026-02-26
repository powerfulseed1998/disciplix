import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, FlatList, TouchableOpacity, useWindowDimensions, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { format, addDays, startOfWeek, parseISO } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, type BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import type { Habit } from '../../constant/mockHabits';
import FullCalendarContent from './FullCalendarContent';

// --- Types ---

type WeeklyCalendarProps = {
    isDark: boolean;
    habits: Habit[];
    selectedDate: string;                    // 'yyyy-MM-dd'，受控，由父组件管理
    onDateSelected: (date: string) => void;
};

type DayData = {
    date: Date;
    key: string;       // 'yyyy-MM-dd'
    dayLabel: string;  // e.g. 'Mon' / '周一'
    dayOfMonth: string;
};

type WeekData = {
    weekOffset: number; // 相对本周的偏移量（本周 = 0）
    days: DayData[];
};

// --- Constants ---

const CELL_GAP = 12;
const CONTAINER_H_PADDING = 80; // 父级 paddingHorizontal(20×2) + 卡片 p-5(20×2)
const TOTAL_WEEKS = 105;        // ±52 周 + 当前周
const CENTER_INDEX = 52;        // 当前周在列表中的索引

// --- Component ---

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
    isDark,
    habits,
    selectedDate,
    onDateSelected,
}) => {
    const { i18n } = useTranslation();
    const flatListRef = useRef<FlatList<WeekData>>(null);
    const calendarSheetRef = useRef<BottomSheetModal>(null);
    const { width: screenWidth } = useWindowDimensions();

    // 布局计算
    const containerWidth = screenWidth - CONTAINER_H_PADDING;
    const cellWidth = Math.floor((containerWidth - CELL_GAP * 6) / 7);

    const dateLocale = useMemo(
        () => (i18n.language.startsWith('zh') ? zhCN : enUS),
        [i18n.language],
    );

    const colors = useMemo(() => ({
        bg: isDark ? '#1e293b' : '#eaeff5',
        text: isDark ? '#e2e8f0' : '#3b4a5a',
        subText: isDark ? '#94a3b8' : '#7b8a9a',
        primary: isDark ? '#475569' : '#4b5563',
        pillBg: isDark ? '#2d3748' : '#ffffff',
    }), [isDark]);

    const [titleDate, setTitleDate] = useState(selectedDate);

    // 锚点：组件挂载时本周一，作为稳定参照（不随日期变化）
    const todayWeekStart = useMemo(
        () => startOfWeek(new Date(), { weekStartsOn: 1 }),
        [],
    );

    // 预生成 ±52 周数据，每周固定 7 天，不再按月截断
    const weeksData: WeekData[] = useMemo(() => {
        return Array.from({ length: TOTAL_WEEKS }, (_, i) => {
            const weekOffset = i - CENTER_INDEX;
            const weekStart = addDays(todayWeekStart, weekOffset * 7);

            return {
                weekOffset,
                days: Array.from({ length: 7 }, (_, dayIndex) => {
                    const date = addDays(weekStart, dayIndex);
                    return {
                        date,
                        key: format(date, 'yyyy-MM-dd'),
                        dayLabel: format(date, 'EEE', { locale: dateLocale }),
                        dayOfMonth: format(date, 'd'),
                    };
                }),
            };
        });
    }, [todayWeekStart, dateLocale]);

    // 根据日期字符串计算其所在周的索引
    const getWeekIndexForDate = useCallback((dateStr: string) => {
        const dateWeekStart = startOfWeek(parseISO(dateStr), { weekStartsOn: 1 });
        const diffMs = dateWeekStart.getTime() - todayWeekStart.getTime();
        const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
        return Math.max(0, Math.min(TOTAL_WEEKS - 1, CENTER_INDEX + diffWeeks));
    }, [todayWeekStart]);

    // 初始滚动位置：仅在挂载时计算一次
    const initialWeekIndex = useMemo(
        () => getWeekIndexForDate(selectedDate),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    // 同步 selectedDate 到 titleDate
    useEffect(() => {
        setTitleDate(selectedDate);
    }, [selectedDate]);

    // 跟踪当前可见的周索引，用于判断是否需要滚动
    const visibleWeekIndexRef = useRef(initialWeekIndex);

    // FlatList getItemLayout：O(1) 计算任意 index 的位置，scrollToIndex 不再依赖渲染
    const getItemLayout = useCallback(
        (_: any, index: number) => ({
            length: containerWidth,
            offset: containerWidth * index,
            index,
        }),
        [containerWidth],
    );

    // --- Handlers ---

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        const index = Math.round(x / containerWidth);
        const clampedIndex = Math.max(0, Math.min(TOTAL_WEEKS - 1, index));
        const week = weeksData[clampedIndex];

        if (week) {
            // 取一周的中间一天（周四，index=3）来决定当前显示的月份
            const majorityDate = week.days[3].key;
            setTitleDate(majorityDate);
        }
    };

    const handleSelectDate = useCallback(
        (dateKey: string) => onDateSelected(dateKey),
        [onDateSelected],
    );

    const scrollToWeek = useCallback((index: number, animated = true) => {
        const clamped = Math.max(0, Math.min(TOTAL_WEEKS - 1, index));
        visibleWeekIndexRef.current = clamped; // 立即更新，防止 effect 重复滚动
        flatListRef.current?.scrollToIndex({ index: clamped, animated });
    }, []);

    // 用户手动滑动结束时，更新可见周索引
    const onMomentumScrollEnd = useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            visibleWeekIndexRef.current = Math.round(offsetX / containerWidth);
        },
        [containerWidth],
    );

    // 当 selectedDate 从外部变化且目标周不在视口时，自动滚动到该周
    useEffect(() => {
        const targetIndex = getWeekIndexForDate(selectedDate);
        if (targetIndex !== visibleWeekIndexRef.current) {
            scrollToWeek(targetIndex);
        }
    }, [selectedDate, getWeekIndexForDate, scrollToWeek]);

    const jumpToToday = useCallback(() => {
        const todayKey = format(new Date(), 'yyyy-MM-dd');
        onDateSelected(todayKey);
        scrollToWeek(CENTER_INDEX);
    }, [onDateSelected, scrollToWeek]);

    const handleShowCalendarModal = useCallback(() => {
        calendarSheetRef.current?.present();
    }, []);

    const handleCalendarDateChange = useCallback(
        (dateString: string) => {
            onDateSelected(dateString);
            const targetIndex = getWeekIndexForDate(dateString);
            scrollToWeek(targetIndex, false);
            setTimeout(() => calendarSheetRef.current?.dismiss(), 200);
        },
        [onDateSelected, getWeekIndexForDate, scrollToWeek],
    );

    const onScrollToIndexFailed = useCallback(
        (info: { index: number; highestMeasuredFrameIndex: number }) => {
            // 回退：先滚到已测量的最远位置，再重试
            flatListRef.current?.scrollToIndex({
                index: info.highestMeasuredFrameIndex,
                animated: false,
            });
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: false,
                });
            }, 100);
        },
        [],
    );

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                pressBehavior="close"
            />
        ),
        [],
    );

    // 用于判断"未来日期"
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    // --- Render ---

    const renderWeek = useCallback(
        ({ item: week }: { item: WeekData }) => (
            <View
                style={{
                    flexDirection: 'row',
                    width: containerWidth,
                    justifyContent: 'space-between',
                }}
            >
                {week.days.map((day) => {
                    const isSelected = selectedDate === day.key;
                    const isFutureDate = day.date > today;

                    // 任何非未来日期，只要有习惯在该天打卡就显示圈
                    const hasHabitCompleted =
                        !isFutureDate &&
                        habits.some(h => h.completedDates?.[day.key]);

                    return (
                        <View key={day.key} className="items-center" style={{ width: cellWidth }}>
                            <Pressable
                                onPress={() => handleSelectDate(day.key)}
                                className="items-center"
                                style={{
                                    width: cellWidth,
                                    paddingVertical: isSelected ? 10 : 8,
                                    borderRadius: cellWidth / 2,
                                    backgroundColor: isSelected ? colors.primary : colors.pillBg,
                                }}
                            >
                                <Text
                                    className="text-xs font-semibold"
                                    style={{
                                        color: isSelected ? 'rgba(255,255,255,0.8)' : colors.subText,
                                    }}
                                >
                                    {day.dayLabel}
                                </Text>
                                <View
                                    className="items-center justify-center mt-1"
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        borderWidth: hasHabitCompleted ? 2 : 0,
                                        borderColor: hasHabitCompleted ? '#7cb8d9' : 'transparent',
                                    }}
                                >
                                    <Text
                                        className="text-sm font-semibold"
                                        style={{ color: isSelected ? '#ffffff' : colors.text }}
                                    >
                                        {day.dayOfMonth}
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    );
                })}
            </View>
        ),
        [selectedDate, today, habits, containerWidth, cellWidth, colors, handleSelectDate],
    );

    return (
        <View className="mt-5 mb-5">
            <View
                className="rounded-[24px] p-5"
                style={{ backgroundColor: colors.bg }}
            >
                <View className="flex-row justify-between items-center mb-4">
                    <TouchableOpacity
                        className="flex-row items-center gap-2 px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: isDark ? '#334155' : '#d5dbe4' }}
                        activeOpacity={0.7}
                        onPress={handleShowCalendarModal}
                    >
                        <FontAwesome6 name="calendar" size={13} color={colors.text} />
                        <Text className="text-sm font-semibold" style={{ color: colors.text }}>
                            {format(parseISO(titleDate), 'MMM yyyy', { locale: dateLocale })}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="px-3 py-1 rounded-xl flex-row items-center gap-1"
                        style={{ backgroundColor: isDark ? '#334155' : '#d5dbe4' }}
                        onPress={jumpToToday}
                    >
                        <FontAwesome6 name="location-crosshairs" size={14} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    ref={flatListRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={weeksData}
                    keyExtractor={(item) => `week-${item.weekOffset}`}
                    renderItem={renderWeek}
                    getItemLayout={getItemLayout}
                    initialScrollIndex={initialWeekIndex}
                    snapToInterval={containerWidth}
                    decelerationRate="fast"
                    onScrollToIndexFailed={onScrollToIndexFailed}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    extraData={selectedDate}
                />
            </View>

            {/* 日历选择 Bottom Sheet */}
            <BottomSheetModal
                ref={calendarSheetRef}
                enableDynamicSizing
                enablePanDownToClose
                backdropComponent={renderBackdrop}
                handleIndicatorStyle={{
                    backgroundColor: isDark ? '#475569' : '#cbd5e1',
                    width: 40,
                }}
                backgroundStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                }}
            >
                <BottomSheetView style={{ paddingBottom: 32 }}>
                    <FullCalendarContent
                        selectedDate={parseISO(selectedDate)}
                        onDateChange={handleCalendarDateChange}
                    />
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
};

export default WeeklyCalendar;
