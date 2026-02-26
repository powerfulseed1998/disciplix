import { useReducer, useRef, useMemo } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { SharedValue, useSharedValue } from 'react-native-reanimated';
import { View } from 'react-native';
import {
    homeReducer,
    initialHomeState,
    HomeState,
} from '../reducers/homeReducer';
import { Task } from '../store/useTasksStore';

export interface HomeRefs {
    sortButtonRef: React.RefObject<View | null>;
    bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

export interface HomeAnimations {
    progressPercent: SharedValue<number>;
    expandProgress: SharedValue<number>;
    sortMenuAnimation: SharedValue<number>;
}

export interface HomeActions {
    // 任务相关动作
    setActiveCategory: (category: string) => void;
    selectTask: (task: Task, mode: 'view' | 'edit') => void;
    closeTaskDetail: () => void;

    // 模态框相关动作
    openNewTaskModal: () => void;
    closeNewTaskModal: () => void;
    openPriorityModal: (taskId: string) => void;
    closePriorityModal: () => void;

    // 排序相关动作
    setSortBy: (sortBy: 'priority' | 'time') => void;
    toggleSortMenu: () => void;
    setSortButtonPosition: (position: {
        x: number;
        y: number;
        width: number;
        height: number;
    }) => void;
}

export interface UseHomeStateResult {
    state: HomeState;
    refs: HomeRefs;
    animations: HomeAnimations;
    actions: HomeActions;
}

export function useHomeState(): UseHomeStateResult {
    const [state, dispatch] = useReducer(homeReducer, initialHomeState);

    // 引用
    const sortButtonRef = useRef<View | null>(null);
    const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);

    // 动画值
    const progressPercent = useSharedValue(0);
    const expandProgress = useSharedValue(0);
    const sortMenuAnimation = useSharedValue(0);

    // 动作创建函数
    const actions: HomeActions = useMemo(
        () => ({
            setActiveCategory: (category: string) => {
                dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: category });
            },

            selectTask: (task: Task, mode: 'view' | 'edit') => {
                dispatch({ type: 'SELECT_TASK', payload: { task, mode } });
            },

            closeTaskDetail: () => {
                dispatch({ type: 'CLOSE_TASK_DETAIL' });
            },

            openNewTaskModal: () => {
                dispatch({ type: 'OPEN_NEW_TASK_MODAL' });
            },

            closeNewTaskModal: () => {
                dispatch({ type: 'CLOSE_NEW_TASK_MODAL' });
            },

            openPriorityModal: (taskId: string) => {
                dispatch({ type: 'OPEN_PRIORITY_MODAL', payload: taskId });
            },

            closePriorityModal: () => {
                dispatch({ type: 'CLOSE_PRIORITY_MODAL' });
            },

            setSortBy: (sortBy: 'priority' | 'time') => {
                dispatch({ type: 'SET_SORT_BY', payload: sortBy });
            },

            toggleSortMenu: () => {
                dispatch({ type: 'TOGGLE_SORT_MENU' });
            },

            setSortButtonPosition: (position: {
                x: number;
                y: number;
                width: number;
                height: number;
            }) => {
                dispatch({
                    type: 'SET_SORT_BUTTON_POSITION',
                    payload: position,
                });
            },
        }),
        [],
    );

    return {
        state,
        refs: {
            sortButtonRef,
            bottomSheetModalRef,
        },
        animations: {
            progressPercent,
            expandProgress,
            sortMenuAnimation,
        },
        actions,
    };
}
