import { Task } from '../store/useTasksStore';

export interface HomeState {
    // 任务相关
    activeCategory: string;
    selectedTask: Task | null;
    initialSheetMode: 'view' | 'edit';

    // 模态框相关
    isOverlayVisible: boolean;
    priorityModalVisible: boolean;
    priorityTaskId: string | null;

    // 排序相关
    sortBy: 'priority' | 'time';
    isSortMenuVisible: boolean;
    sortButtonPosition: { x: number; y: number; width: number; height: number };
}

export type HomeAction =
    // 任务相关动作
    | { type: 'SET_ACTIVE_CATEGORY'; payload: string }
    | { type: 'SELECT_TASK'; payload: { task: Task; mode: 'view' | 'edit' } }
    | { type: 'CLOSE_TASK_DETAIL' }

    // 模态框相关动作
    | { type: 'OPEN_NEW_TASK_MODAL' }
    | { type: 'CLOSE_NEW_TASK_MODAL' }
    | { type: 'OPEN_PRIORITY_MODAL'; payload: string }
    | { type: 'CLOSE_PRIORITY_MODAL' }

    // 排序相关动作
    | { type: 'SET_SORT_BY'; payload: 'priority' | 'time' }
    | { type: 'TOGGLE_SORT_MENU' }
    | {
          type: 'SET_SORT_BUTTON_POSITION';
          payload: { x: number; y: number; width: number; height: number };
      };

export const initialHomeState: HomeState = {
    activeCategory: 'all',
    selectedTask: null,
    initialSheetMode: 'view',
    isOverlayVisible: false,
    priorityModalVisible: false,
    priorityTaskId: null,
    sortBy: 'time',
    isSortMenuVisible: false,
    sortButtonPosition: { x: 0, y: 0, width: 0, height: 0 },
};

export function homeReducer(state: HomeState, action: HomeAction): HomeState {
    switch (action.type) {
        case 'SET_ACTIVE_CATEGORY':
            return { ...state, activeCategory: action.payload };

        case 'SELECT_TASK':
            return {
                ...state,
                selectedTask: action.payload.task,
                initialSheetMode: action.payload.mode,
            };

        case 'CLOSE_TASK_DETAIL':
            return {
                ...state,
                selectedTask: null,
                initialSheetMode: 'view',
            };

        case 'OPEN_NEW_TASK_MODAL':
            return { ...state, isOverlayVisible: true };

        case 'CLOSE_NEW_TASK_MODAL':
            return { ...state, isOverlayVisible: false };

        case 'OPEN_PRIORITY_MODAL':
            return {
                ...state,
                priorityModalVisible: true,
                priorityTaskId: action.payload,
            };

        case 'CLOSE_PRIORITY_MODAL':
            return {
                ...state,
                priorityModalVisible: false,
                priorityTaskId: null,
            };

        case 'SET_SORT_BY':
            return {
                ...state,
                sortBy: action.payload,
                // 移除自动关闭菜单，让调用方处理动画后再关闭
            };

        case 'TOGGLE_SORT_MENU':
            return {
                ...state,
                isSortMenuVisible: !state.isSortMenuVisible,
            };

        case 'SET_SORT_BUTTON_POSITION':
            return {
                ...state,
                sortButtonPosition: action.payload,
            };

        default:
            return state;
    }
}
