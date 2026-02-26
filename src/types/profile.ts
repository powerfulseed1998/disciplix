// 用户数据类型
export type UserProfile = {
    name: string;
    email: string;
    avatar?: string;
    joinDate: string;
    level: number;
    title: string;
};

// 统计数据类型
export type UserStats = {
    tasksCompleted: number;
    habitsStreak: number;
    achievements: number;
    checkIns: number;
};

// 菜单项ID枚举
export enum ProfileMenuId {
    EDIT_PROFILE = 'edit_profile',
    NOTIFICATIONS = 'notifications',
    DARK_MODE = 'dark_mode',
    LANGUAGE = 'language',
    SECURITY = 'security',
    HELP_SUPPORT = 'help_support',
    ABOUT = 'about',
}

// 菜单项类型
export type MenuItem = {
    id: ProfileMenuId;
    icon: string;
    label: string;
    value?: string;
    hasToggle?: boolean;
    toggleValue?: boolean;
    color?: string;
};

// 统计配置类型
export type StatConfig = {
    key: keyof UserStats;
    label: string;
    icon: string;
    color: string;
};
