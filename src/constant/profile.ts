import { UserProfile, UserStats, StatConfig } from '../types/profile';

// 用户资料数据
export const USER_PROFILE: UserProfile = {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    joinDate: '2024-01',
    level: 12,
    title: 'Habit Master',
};

// 用户统计数据
export const USER_STATS: UserStats = {
    tasksCompleted: 486,
    habitsStreak: 68,
    achievements: 4,
    checkIns: 42,
};

// 统计配置（label 使用 i18n key，由组件调用 t() 翻译）
export const STATS_CONFIG: readonly StatConfig[] = [
    { key: 'tasksCompleted', label: 'profile.statsTasks', icon: 'check-circle', color: '#10b981' },
    { key: 'habitsStreak', label: 'profile.statsStreak', icon: 'fire', color: '#f59e0b' },
    { key: 'achievements', label: 'profile.statsBadges', icon: 'trophy', color: '#8b5cf6' },
    { key: 'checkIns', label: 'profile.statsCheckIns', icon: 'clipboard-check', color: '#ec4899' },
] as const;
