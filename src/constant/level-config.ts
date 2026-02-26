import { ImageSourcePropType } from 'react-native';

// 1. 定义头衔结构
export type LevelTitle = {
    id: string;
    minLevel: number;
    title: string;
    // 未来可以扩展图标、颜色等
    color?: string;
};

// 2. 头衔配置表 (根据等级范围定义头衔)
export const LEVEL_TITLES: LevelTitle[] = [
    { id: 'novice', minLevel: 1, title: 'Novice', color: '#94a3b8' },       // 1-4级
    { id: 'apprentice', minLevel: 5, title: 'Apprentice', color: '#3b82f6' },   // 5-9级
    { id: 'habitMaster', minLevel: 10, title: 'Habit Master', color: '#8b5cf6' }, // 10-19级
    { id: 'grandmaster', minLevel: 20, title: 'Grandmaster', color: '#f59e0b' },  // 20-49级
    { id: 'legend', minLevel: 50, title: 'Legend', color: '#ec4899' },       // 50+级
];

// 3. 基础经验值配置
export const BASE_XP_PER_LEVEL = 360; // 基础升级经验 (约3次习惯或1.2次任务)
export const XP_GROWTH_FACTOR = 1.0;   // 1.0 表示线性增长 (Level * 1000)
