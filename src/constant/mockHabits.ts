export type Habit = {
    id: string;
    name: string;
    icon: string;
    color: string;
    streak: number;
    completedToday: boolean;
    // 每个打卡日期的记录，key 为 'yyyy-MM-dd'
    completedDates?: Record<string, boolean>;
    targetDays: number;
    // 保留字段：用于 streak 计算的最后打卡日期
    lastCompletedDate?: string; // YYYY-MM-DD 格式
};

// 保留一个空的初始数组，方便类型推导或未来需要默认模板时扩展
export const INITIAL_HABITS: Habit[] = [];
