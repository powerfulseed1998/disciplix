import { AchievementId, ACHIEVEMENTS } from '../constant/achievements';

export type UserAchievementState = {
    id: AchievementId;
    unlocked: boolean;
    progress: number;
    unlockedAt?: string;
};

export function checkFirstStepLogic(
    totalHabitsCompleted: number,
    userAchievements: Partial<Record<AchievementId, UserAchievementState>>
): AchievementId | null {
    if (userAchievements[AchievementId.FIRST_STEP]?.unlocked) return null;
    if (totalHabitsCompleted >= 1) return AchievementId.FIRST_STEP;
    return null;
}

export function checkStreakAchievementsLogic(
    streak: number,
    userAchievements: Partial<Record<AchievementId, UserAchievementState>>
): { id: AchievementId; unlocked: boolean; progress: number }[] {
    const results: { id: AchievementId; unlocked: boolean; progress: number }[] = [];
    
    const streakGoals = [
        { id: AchievementId.PERSISTENT, goal: 7 },
        { id: AchievementId.HABIT_BUILDER, goal: 21 },
        { id: AchievementId.CENTURY_CLUB, goal: 100 },
        { id: AchievementId.LEGENDARY, goal: 365 },
    ];

    for (const { id, goal } of streakGoals) {
        if (!userAchievements[id]?.unlocked) {
            results.push({
                id,
                unlocked: streak >= goal,
                progress: streak,
            });
        }
    }
    return results;
}

export function checkEarlyBirdLogic(
    earlyBirdCount: number,
    userAchievements: Partial<Record<AchievementId, UserAchievementState>>
): { id: AchievementId; unlocked: boolean; progress: number } | null {
    if (userAchievements[AchievementId.EARLY_BIRD]?.unlocked) return null;
    return {
        id: AchievementId.EARLY_BIRD,
        unlocked: earlyBirdCount >= 30,
        progress: earlyBirdCount,
    };
}

export function checkAllRounderLogic(
    activeHabitsCount: number,
    streak: number,
    userAchievements: Partial<Record<AchievementId, UserAchievementState>>
): { id: AchievementId; unlocked: boolean; progress: number } | null {
    if (userAchievements[AchievementId.ALL_ROUNDER]?.unlocked) return null;
    
    if (activeHabitsCount >= 5 && streak >= 30) {
        return { id: AchievementId.ALL_ROUNDER, unlocked: true, progress: 30 };
    } else if (activeHabitsCount >= 5) {
        return { id: AchievementId.ALL_ROUNDER, unlocked: false, progress: Math.min(streak, 30) };
    }
    return null;
}

export function checkCompletionistLogic(
    userAchievements: Partial<Record<AchievementId, UserAchievementState>>
): { id: AchievementId; unlocked: boolean; progress: number } | null {
    if (userAchievements[AchievementId.COMPLETIONIST]?.unlocked) return null;

    const unlockedCount = Object.values(userAchievements).filter(
        a => a?.unlocked && a.id !== AchievementId.COMPLETIONIST
    ).length;

    const totalAchievements = ACHIEVEMENTS.length - 1;

    return {
        id: AchievementId.COMPLETIONIST,
        unlocked: unlockedCount >= totalAchievements,
        progress: unlockedCount,
    };
}
