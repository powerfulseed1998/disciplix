import { BASE_XP_PER_LEVEL, LEVEL_TITLES, LevelTitle } from '../constant/level-config';

/**
 * 计算当前等级升级所需的总经验值
 * 目前逻辑: Level * 1000
 */
export const getRequiredXPForLevel = (level: number): number => {
    // 基础经验值
    const baseXP = BASE_XP_PER_LEVEL;
    
    // 计算当前等级处于第几个“3级阶梯”
    // Level 1-3 -> group 0 (multiplier 1.5^0 = 1)
    // Level 4-6 -> group 1 (multiplier 1.5^1 = 1.5)
    // Level 7-9 -> group 2 (multiplier 1.5^2 = 2.25)
    const groupIndex = Math.floor((level - 1) / 3);
    
    // 增长因子 1.5
    const multiplier = Math.pow(1.5, groupIndex);
    
    return Math.floor(baseXP * multiplier);
};

/**
 * 根据等级获取当前头衔
 */
export const getTitleByLevel = (level: number): LevelTitle => {
    // 倒序查找，找到第一个满足 minLevel <= currentLevel 的配置
    const match = [...LEVEL_TITLES]
        .reverse()
        .find(config => level >= config.minLevel);
    
    return match || LEVEL_TITLES[0];
};

/**
 * 计算加经验后的新状态 (处理可能连升多级的情况，以及扣除经验导致的降级)
 */
export const calculateNewLevelState = (
    currentLevel: number,
    currentXP: number,
    xpToAdd: number
): { newLevel: number; newCurrentXP: number; leveledUp: boolean; leveledDown: boolean } => {
    let level = currentLevel;
    let xp = currentXP + xpToAdd;

    // 处理降级逻辑 (当 XP 变为负数)
    while (xp < 0) {
        if (level > 1) {
            level--;
            // 获取该新等级(降级后)升级所需的 XP，作为回退的基础
            const required = getRequiredXPForLevel(level);
            xp += required;
        } else {
            // 已经是 1 级，XP 不能为负
            xp = 0;
            break;
        }
    }

    // 处理升级逻辑 (当 XP 超过当前等级需求)
    while (true) {
        const required = getRequiredXPForLevel(level);
        if (xp >= required) {
            xp -= required;
            level++;
        } else {
            break;
        }
    }

    return {
        newLevel: level,
        newCurrentXP: xp,
        leveledUp: level > currentLevel,
        leveledDown: level < currentLevel
    };
};
