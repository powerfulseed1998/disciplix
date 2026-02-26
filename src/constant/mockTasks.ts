// 模拟数据：任务分类
export const CATEGORIES = [
    { id: 'all', label: 'All', icon: 'list-check', color: '#6366f1' },
    { id: 'work', label: 'Work', icon: 'briefcase', color: '#3b82f6' },
    { id: 'personal', label: 'Personal', icon: 'user', color: '#ec4899' },
    {
        id: 'shopping',
        label: 'Shopping',
        icon: 'cart-shopping',
        color: '#f59e0b',
    },
];

// 模拟数据：待办事项
export const INITIAL_TASKS = [
    {
        id: 1,
        title: 'Team Daily Standup',
        time: '10:00 AM',
        category: 'Work',
        completed: true,
    },
    {
        id: 2,
        title: 'Review PR #342',
        time: '11:30 AM',
        category: 'Work',
        completed: false,
    },
    {
        id: 3,
        title: 'Buy Milk & Eggs',
        time: '6:00 PM',
        category: 'Shopping',
        completed: false,
    },
    {
        id: 4,
        title: 'Gym Workout',
        time: '8:00 PM',
        category: 'Personal',
        completed: false,
    },
    {
        id: 5,
        title: 'Read React Native Docs',
        time: '9:30 PM',
        category: 'Personal',
        completed: false,
    },
];
