import { create } from 'zustand';
import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';

// 自定义 Modal 属性，不再依赖 react-native-modal 的 Props
interface GlobalModalProps {
    style?: StyleProp<ViewStyle>;
    onModalHide?: () => void;
    entering?: any; // Reanimated layout animations (e.g., FadeIn, SlideInDown)
    exiting?: any;
    [key: string]: any; // 允许其他属性
}

interface GlobalModalState {
    visible: boolean;
    content: React.ReactNode | null;
    props: GlobalModalProps;
    showModal: (content: React.ReactNode, props?: GlobalModalProps) => void;
    hideModal: () => void;
    reset: () => void;
}

export const useGlobalModalStore = create<GlobalModalState>((set) => ({
    visible: false,
    content: null,
    props: {},
    showModal: (content, props = {}) =>
        set({
            visible: true,
            content,
            props,
        }),
    hideModal: () =>
        set({
            visible: false,
            // 不在这里清空 content 和 props，等待动画结束
        }),
    reset: () =>
        set({
            content: null,
            props: {},
        }),
}));
