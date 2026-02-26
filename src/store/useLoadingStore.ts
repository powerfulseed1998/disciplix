import { create } from 'zustand';

interface LoadingState {
    // 是否显示全局加载指示器
    isLoading: boolean;

    // 加载文本
    loadingText: string;

    // 显示加载指示器
    showLoading: (text?: string) => void;

    // 隐藏加载指示器
    hideLoading: () => void;

    // 设置加载文本
    setLoadingText: (text: string) => void;
}

export const useLoadingStore = create<LoadingState>(set => ({
    isLoading: false,
    loadingText: '加载中...',

    showLoading: (text = '加载中...') =>
        set({ isLoading: true, loadingText: text }),

    hideLoading: () => set({ isLoading: false }),

    setLoadingText: text => set({ loadingText: text }),
}));
