/**
 * 成就系统辅助工具
 * 
 * 这个文件提供了一些实用函数来帮助触发和管理成就
 */

import { useAchievementStore } from '../store/achievementStore';
import { AchievementId, ACHIEVEMENTS, type Achievement } from '../constant/achievements';
import { type Habit } from '../constant/mockHabits';

/**
 * 检查所有成就状态
 * 通常在应用启动或用户数据变化时调用
 */
export function checkAllAchievements(options?: {
    activeHabitsCount?: number;
}) {
    const store = useAchievementStore.getState();

    // 检查基础成就
    store.checkFirstStep();
    store.checkStreakAchievements();
    store.checkEarlyBird();

    // 如果提供了活跃习惯数，检查全能成就
    if (options?.activeHabitsCount !== undefined) {
        store.checkAllRounder(options.activeHabitsCount);
    }

    // 检查完成主义者成就
    store.checkCompletionist();
}

/**
 * 判断习惯名称是否为早起相关习惯
 */
export function isEarlyBirdHabit(habitName: string): boolean {
    const earlyBirdKeywords = [
        '早起', '早晨', '晨练', '早餐',
        'morning', 'wake up', 'wake', '起床',
        'breakfast', 'sunrise'
    ];

    const lowerName = habitName.toLowerCase();
    return earlyBirdKeywords.some(keyword => lowerName.includes(keyword.toLowerCase()));
}

/**
 * 手动解锁成就（用于测试或特殊情况）
 */
export function unlockAchievementManually(achievementId: AchievementId) {
    const store = useAchievementStore.getState();
    store.unlockAchievement(achievementId);
}

/**
 * 获取成就完成进度
 */
export function getAchievementProgress(achievementId: AchievementId): {
    progress: number;
    maxProgress: number;
    percentage: number;
    unlocked: boolean;
} {
    const store = useAchievementStore.getState();
    const achievement = store.userAchievements[achievementId];

    // 从常量中获取最大进度
    const meta = ACHIEVEMENTS.find((a: Achievement) => a.id === achievementId);
    const maxProgress = meta?.maxProgress || 1;

    const progress = achievement?.progress || 0;
    const percentage = Math.min((progress / maxProgress) * 100, 100);

    return {
        progress,
        maxProgress,
        percentage,
        unlocked: achievement?.unlocked || false,
    };
}

/**
 * 计算活跃习惯数量（连续30天以上的习惯）
 * 用于 All-Rounder 成就
 */
export function calculateActiveHabitsCount(habits: Habit[]): number {
    return habits.filter(h => h.streak >= 30).length;
}

/**
 * 重置所有成就（谨慎使用！）
 */
export function resetAllAchievements() {
    const store = useAchievementStore.getState();
    if (__DEV__) {
        store.resetAll();
        console.log('🔄 所有成就已重置（仅在开发模式下可用）');
    } else {
        console.warn('⚠️ 重置成就仅在开发模式下可用');
    }
}

