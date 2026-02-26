import { useState, useEffect, useCallback, useRef } from 'react';
import { useAchievementStore } from '../store/achievementStore';
import { useUIStore } from '../store/uiStore';
import { Achievement, ACHIEVEMENTS, RARITY_COLORS } from '../constant/achievements';

type UnlockedAchievementData = Achievement & {
    xpReward: number;
};

/**
 * 监听成就解锁事件的 Hook
 * 
 * 使用方法：
 * ```tsx
 * const { currentUnlock, clearUnlock } = useAchievementUnlockListener();
 * 
 * return (
 *   <AchievementUnlockAnimation
 *     visible={!!currentUnlock}
 *     achievement={currentUnlock}
 *     xpReward={currentUnlock?.xpReward}
 *     onClose={clearUnlock}
 *   />
 * );
 * ```
 */
export const useAchievementUnlockListener = () => {
    const [unlockQueue, setUnlockQueue] = useState<UnlockedAchievementData[]>([]);
    const [currentUnlock, setCurrentUnlock] = useState<UnlockedAchievementData | null>(null);
    const userAchievements = useAchievementStore(state => state.userAchievements);
    const processedIds = useRef<Set<string>>(new Set());

    // Sync animation state to UI store
    useEffect(() => {
        useUIStore.getState().setUnlockAnimationActive(!!currentUnlock);
    }, [currentUnlock]);

    // 监听成就状态变化
    useEffect(() => {
        // 检查最近解锁的成就
        const recentlyUnlocked = Object.values(userAchievements)
            .filter(ua => {
                if (!ua.unlocked || !ua.unlockedAt) return false;
                if (processedIds.current.has(ua.id)) return false;
                
                // 检查是否在最近 5 秒内解锁
                const unlockTime = new Date(ua.unlockedAt).getTime();
                const now = Date.now();
                return now - unlockTime < 5000;
            })
            .map(ua => {
                const meta = ACHIEVEMENTS.find(a => a.id === ua.id);
                if (!meta) return null;

                // 计算 XP 奖励
                const rarityXP = {
                    common: 100,
                    rare: 250,
                    epic: 500,
                    legendary: 1000,
                };
                const xpReward = rarityXP[meta.rarity];

                return {
                    ...meta,
                    unlocked: true,
                    unlockedAt: new Date(ua.unlockedAt!),
                    progress: ua.progress,
                    xpReward,
                } as UnlockedAchievementData;
            })
            .filter((a): a is UnlockedAchievementData => a !== null);

        if (recentlyUnlocked.length > 0) {
            // 如果有新解锁的成就，加入队列
            setUnlockQueue(prev => {
                const newQueue = [...prev];
                let hasUpdates = false;
                
                recentlyUnlocked.forEach(achievement => {
                    // 避免重复添加
                    if (!newQueue.find(a => a.id === achievement.id) && !processedIds.current.has(achievement.id)) {
                        newQueue.push(achievement);
                        processedIds.current.add(achievement.id);
                        hasUpdates = true;
                    }
                });
                
                return hasUpdates ? newQueue : prev;
            });
        }
    }, [userAchievements, currentUnlock]);

    // 处理队列
    useEffect(() => {
        if (unlockQueue.length > 0 && !currentUnlock) {
            // 从队列中取出第一个成就显示
            const [first, ...rest] = unlockQueue;
            setCurrentUnlock(first);
            setUnlockQueue(rest);
        }
    }, [unlockQueue, currentUnlock]);

    // 清除当前显示的成就
    const clearUnlock = useCallback(() => {
        setCurrentUnlock(null);
        // 清除后，useEffect 会自动处理队列中的下一个
    }, []);

    return {
        currentUnlock,
        clearUnlock,
        queueLength: unlockQueue.length,
    };
};
