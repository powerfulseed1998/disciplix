import { useLoadingStore } from '../store/useLoadingStore';

/**
 * 全局加载状态管理 Hook
 *
 * 使用示例：
 *
 * ```tsx
 * const { showLoading, hideLoading, setLoadingText, isLoading } = useGlobalLoading();
 *
 * // 显示加载
 * showLoading();
 * showLoading('正在保存...');
 *
 * // 隐藏加载
 * hideLoading();
 *
 * // 只改变文本
 * setLoadingText('上传中...');
 *
 * // 检查状态
 * if (isLoading) {
 *   // 正在加载
 * }
 * ```
 */
export const useGlobalLoading = () => {
    const { isLoading, loadingText, showLoading, hideLoading, setLoadingText } =
        useLoadingStore();

    return {
        isLoading,
        loadingText,
        showLoading,
        hideLoading,
        setLoadingText,
    };
};
