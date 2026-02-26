// Achievement badge type
export type Achievement = {
    id: AchievementId;
    name: string;
    description: string;
    icon: string;
    color: string;
    unlocked: boolean;
    unlockedAt?: Date;
    progress?: number;
    maxProgress?: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

// User level data
export type UserLevel = {
    level: number;
    currentXP: number;
    requiredXP: number;
    title: string;
};

export const RARITY_COLORS = {
    common: { bg: '#94a3b8', border: '#64748b', label: 'Common' },
    rare: { bg: '#3b82f6', border: '#2563eb', label: 'Rare' },
    epic: { bg: '#a855f7', border: '#9333ea', label: 'Epic' },
    legendary: { bg: '#f59e0b', border: '#d97706', label: 'Legendary' },
};

export const USER_LEVEL: UserLevel = {
    level: 12,
    currentXP: 2450,
    requiredXP: 3000,
    title: 'Habit Master',
};

export enum AchievementId {
    FIRST_STEP = '1',
    PERSISTENT = '2',
    HABIT_BUILDER = '3',
    EARLY_BIRD = '4',
    CENTURY_CLUB = '5',
    ALL_ROUNDER = '6',
    LEGENDARY = '7',
    COMPLETIONIST = '8',
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: AchievementId.FIRST_STEP,
        name: 'First Step',
        description: 'Complete your first habit check-in',
        icon: 'seedling',
        color: '#10b981',
        unlocked: true,
        unlockedAt: new Date('2024-01-15'),
        progress: 0,
        maxProgress: 1,
        rarity: 'common',
    },
    {
        id: AchievementId.PERSISTENT,
        name: 'Persistent',
        description: '7-day streak',
        icon: 'fire',
        color: '#f59e0b',
        unlocked: true,
        unlockedAt: new Date('2024-01-22'),
        progress: 0,
        maxProgress: 7,
        rarity: 'common',
    },
    {
        id: AchievementId.HABIT_BUILDER,
        name: 'Habit Builder',
        description: '21-day streak',
        icon: 'trophy',
        color: '#8b5cf6',
        unlocked: true,
        unlockedAt: new Date('2024-02-05'),
        progress: 0,
        maxProgress: 21,
        rarity: 'rare',
    },
    {
        id: AchievementId.EARLY_BIRD,
        name: 'Early Bird',
        description: 'Wake up early for 30 days',
        icon: 'sun',
        color: '#f97316',
        unlocked: true,
        unlockedAt: new Date('2024-03-01'),
        progress: 0,
        maxProgress: 7,
        rarity: 'rare',
    },
    {
        id: AchievementId.CENTURY_CLUB,
        name: 'Century Club',
        description: '100-day streak',
        icon: 'medal',
        color: '#ec4899',
        unlocked: false,
        progress: 0,
        maxProgress: 100,
        rarity: 'epic',
    },
    {
        id: AchievementId.ALL_ROUNDER,
        name: 'All-Rounder',
        description: 'Maintain 5 habits for 30 days',
        icon: 'star',
        color: '#6366f1',
        unlocked: false,
        progress: 0,
        maxProgress: 30,
        rarity: 'epic',
    },
    {
        id: AchievementId.LEGENDARY,
        name: 'Legendary',
        description: '365-day streak',
        icon: 'crown',
        color: '#eab308',
        unlocked: false,
        progress: 0,
        maxProgress: 365,
        rarity: 'legendary',
    },
    {
        id: AchievementId.COMPLETIONIST,
        name: 'Completionist',
        description: 'Unlock all achievements',
        icon: 'gem',
        color: '#14b8a6',
        unlocked: false,
        progress: 0,
        maxProgress: 8,
        rarity: 'legendary',
    },
];
