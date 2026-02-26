import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACHIEVEMENTS, AchievementId } from '../constant/achievements';
import { calculateNewLevelState, getTitleByLevel, getRequiredXPForLevel } from '../utils/level-utils';
import {
    UserAchievementState,
    checkFirstStepLogic,
    checkStreakAchievementsLogic,
    checkEarlyBirdLogic,
    checkAllRounderLogic,
    checkCompletionistLogic
} from './achievement-checks';

type AchievementStore = {
    level: number;
    currentXP: number;
    currentTitle: string;
    streak: number;
    lastActiveDate: string | null;
    xpToday: number;
    lastXPDate: string | null;
    totalHabitsCompleted: number;
    earlyBirdCount: number;
    userAchievements: Partial<Record<AchievementId, UserAchievementState>>;

    addXP: (amount: number) => void;
    updateProgress: (id: AchievementId, progressToAdd: number) => void;
    unlockAchievement: (id: AchievementId) => void;
    checkIn: () => void;
    checkDailyReset: () => void;

    checkFirstStep: () => void;
    checkStreakAchievements: () => void;
    checkEarlyBird: () => void;
    checkAllRounder: (activeHabitsCount: number) => void;
    checkCompletionist: () => void;

    getNextLevelXP: () => number;
    resetAll: () => void;
};

export const useAchievementStore = create<AchievementStore>()(
    persist(
        (set, get) => ({
            level: 1,
            currentXP: 0,
            currentTitle: getTitleByLevel(1).title,
            streak: 0,
            lastActiveDate: null,
            xpToday: 0,
            lastXPDate: null,
            totalHabitsCompleted: 0,
            earlyBirdCount: 0,
            userAchievements: {},

            addXP: (amount) => {
                const state = get();
                const today = new Date().toISOString().split('T')[0];
                let newXpToday = state.lastXPDate === today ? state.xpToday + amount : amount;
                if (newXpToday < 0) newXpToday = 0;

                const { newLevel, newCurrentXP, leveledUp, leveledDown } = calculateNewLevelState(state.level, state.currentXP, amount);
                const newState: Partial<AchievementStore> = { currentXP: newCurrentXP, xpToday: newXpToday, lastXPDate: today };

                if (leveledUp || leveledDown) {
                    newState.level = newLevel;
                    const { title } = getTitleByLevel(newLevel);
                    newState.currentTitle = title;
                    if (leveledUp) {
                        // Level-up notification removed (network feature)
                    }
                }
                set(newState);
            },

            getNextLevelXP: () => getRequiredXPForLevel(get().level),

            checkDailyReset: () => {
                const today = new Date().toISOString().split('T')[0];
                if (get().lastXPDate !== today) set({ xpToday: 0, lastXPDate: today });
            },

            checkIn: () => {
                const today = new Date().toISOString().split('T')[0];
                const lastDate = get().lastActiveDate;
                if (lastDate === today) return;

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                const newStreak = lastDate === yesterdayStr ? get().streak + 1 : 1;
                set({ streak: newStreak, lastActiveDate: today, totalHabitsCompleted: get().totalHabitsCompleted + 1 });

                setTimeout(() => {
                    get().checkFirstStep();
                    get().checkStreakAchievements();
                }, 100);
            },

            unlockAchievement: (id) => {
                const { userAchievements, addXP } = get();
                if (userAchievements[id]?.unlocked) return;
                const meta = ACHIEVEMENTS.find(a => a.id === id);
                if (!meta) return;

                set((state) => ({
                    userAchievements: {
                        ...state.userAchievements,
                        [id]: { id, unlocked: true, progress: meta.maxProgress || 1, unlockedAt: new Date().toISOString() },
                    },
                }));

                const rarityXP = { common: 100, rare: 250, epic: 500, legendary: 1000 };
                const xpReward = rarityXP[meta.rarity || 'common'];
                addXP(xpReward);
                setTimeout(() => get().checkCompletionist(), 100);
            },

            updateProgress: (id, amount) => {
                const { userAchievements, unlockAchievement } = get();
                const meta = ACHIEVEMENTS.find(a => a.id === id);
                if (!meta || userAchievements[id]?.unlocked) return;

                const current = userAchievements[id] || { id, unlocked: false, progress: 0 };
                const newProgress = current.progress + amount;
                if (newProgress >= (meta.maxProgress || 1)) unlockAchievement(id);
                else set(state => ({ userAchievements: { ...state.userAchievements, [id]: { ...current, progress: newProgress } } }));
            },

            checkFirstStep: () => {
                const id = checkFirstStepLogic(get().totalHabitsCompleted, get().userAchievements);
                if (id) get().unlockAchievement(id);
            },

            checkStreakAchievements: () => {
                const results = checkStreakAchievementsLogic(get().streak, get().userAchievements);
                results.forEach(res => {
                    if (res.unlocked) get().unlockAchievement(res.id);
                    else set(state => ({ userAchievements: { ...state.userAchievements, [res.id]: res } }));
                });
            },

            checkEarlyBird: () => {
                const res = checkEarlyBirdLogic(get().earlyBirdCount, get().userAchievements);
                if (!res) return;
                if (res.unlocked) get().unlockAchievement(res.id);
                else set(state => ({ userAchievements: { ...state.userAchievements, [res.id]: res } }));
            },

            checkAllRounder: (activeHabitsCount) => {
                const res = checkAllRounderLogic(activeHabitsCount, get().streak, get().userAchievements);
                if (!res) return;
                if (res.unlocked) get().unlockAchievement(res.id);
                else set(state => ({ userAchievements: { ...state.userAchievements, [res.id]: res } }));
            },

            checkCompletionist: () => {
                const res = checkCompletionistLogic(get().userAchievements);
                if (!res) return;
                if (res.unlocked) get().unlockAchievement(res.id);
                else set(state => ({ userAchievements: { ...state.userAchievements, [res.id]: res } }));
            },

            resetAll: () => set({
                level: 1, currentXP: 0, currentTitle: getTitleByLevel(1).title, streak: 0,
                lastActiveDate: null, xpToday: 0, lastXPDate: null, totalHabitsCompleted: 0,
                earlyBirdCount: 0, userAchievements: {}
            }),
        }),
        {
            name: 'achievement-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);