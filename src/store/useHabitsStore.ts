import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { format } from 'date-fns';
import { type Habit } from '../constant/mockHabits';
import { useAchievementStore } from './achievementStore';

type NewHabitInput = {
    name: string;
    icon: string;
    color: string;
    targetDays: number;
};

type HabitsState = {
    habits: Habit[];
    addHabit: (input: NewHabitInput) => void;
    toggleHabitToday: (id: string, todayIndex: number) => void;
    deleteHabits: (ids: string[]) => void;
};

function makeId() {
    // 足够稳定且无需额外依赖；用于本地数据唯一性
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useHabitsStore = create<HabitsState>()(
    persist(
        set => ({
            habits: [],
            addHabit: input =>
                set(state => ({
                    habits: [
                        ...state.habits,
                        {
                            id: makeId(),
                            name: input.name.trim(),
                            icon: input.icon,
                            color: input.color,
                            streak: 0,
                            completedToday: false,
                            completedDates: {},
                            targetDays: input.targetDays,
                            lastCompletedDate: undefined,
                        },
                    ],
                })),
            deleteHabits: ids =>
                set(state => ({
                    habits: state.habits.filter(h => !ids.includes(h.id)),
                })),
            toggleHabitToday: (id, todayIndex) =>
                set(state => {
                    let shouldCheckIn = false;
                    let isEarlyBirdHabit = false;
                    const today = format(new Date(), 'yyyy-MM-dd'); // YYYY-MM-DD

                    const newHabits = state.habits.map(h => {
                        if (h.id !== id) return h;
                        const nextCompleted = !h.completedToday;

                        // 检查是否是早起习惯（包含"早起"、"早晨"、"morning"等关键词）
                        const earlyBirdKeywords = ['早起', '早晨', 'morning', 'wake up', '起床'];
                        isEarlyBirdHabit = earlyBirdKeywords.some(keyword =>
                            h.name.toLowerCase().includes(keyword.toLowerCase())
                        );

                        if (nextCompleted) {
                            shouldCheckIn = true;
                            useAchievementStore.getState().addXP(120);
                        } else {
                            useAchievementStore.getState().addXP(-120);
                        }

                        // 更新按日期记录
                        const prevCompletedDates = h.completedDates ?? {};
                        const nextCompletedDates: Record<string, boolean> = {
                            ...prevCompletedDates,
                        };

                        if (nextCompleted) {
                            nextCompletedDates[today] = true;
                        } else {
                            delete nextCompletedDates[today];
                        }

                        // 基于 completedDates 重新计算 streak 和 lastCompletedDate
                        const todayDate = new Date(today);
                        todayDate.setHours(0, 0, 0, 0);

                        const hasToday = !!nextCompletedDates[today];
                        let nextStreak = 0;
                        let nextLastCompletedDate: string | undefined;

                        const maxLookBackDays = 365;
                        const startOffset = hasToday ? 0 : 1;

                        for (let offset = startOffset; offset < maxLookBackDays; offset++) {
                            const d = new Date(todayDate);
                            d.setDate(d.getDate() - offset);
                            const key = format(d, 'yyyy-MM-dd');

                            if (nextCompletedDates[key]) {
                                if (!nextLastCompletedDate) {
                                    nextLastCompletedDate = key;
                                }
                                nextStreak += 1;
                            } else {
                                break;
                            }
                        }

                        if (hasToday) {
                            // 如果今天打卡，今天一定是连续链的最后一天
                            nextLastCompletedDate = today;
                        }

                        return {
                            ...h,
                            completedToday: nextCompleted,
                            streak: nextStreak,
                            completedDates: nextCompletedDates,
                            lastCompletedDate: nextLastCompletedDate,
                        };
                    });

                    if (shouldCheckIn) {
                        const achievementStore = useAchievementStore.getState();

                        // 打卡
                        achievementStore.checkIn();

                        // 如果是早起习惯，增加早起计数
                        if (isEarlyBirdHabit) {
                            const currentCount = achievementStore.earlyBirdCount;
                            useAchievementStore.setState({ earlyBirdCount: currentCount + 1 });
                            achievementStore.checkEarlyBird();
                        }

                        // 检查 All-Rounder 成就（同时维持5个习惯）
                        const activeHabitsCount = newHabits.filter(h => h.completedToday && h.streak >= 30).length;
                        achievementStore.checkAllRounder(activeHabitsCount);
                    }

                    return { habits: newHabits };
                }),
        }),
        {
            name: 'habits-store',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);


