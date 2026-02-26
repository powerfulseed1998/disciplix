import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, BackHandler } from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets'
import { useGlobalModalStore } from '../../store/useGlobalModalStore';
import { useThemeContext } from '../../providers/ThemeProvider';

export default function GlobalModal() {
    const { visible, content, props, hideModal, reset } = useGlobalModalStore();
    const { isDark } = useThemeContext();

    // 处理 Android 物理返回键
    useEffect(() => {
        const onBackPress = () => {
            if (visible) {
                hideModal();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => {
            if (backHandler?.remove) {
                backHandler.remove();
            }
        };
    }, [visible, hideModal]);

    // 动画结束后的清理回调
    const handleExitingCallback = (finished?: boolean) => {
        'worklet';
        if (finished) {
            scheduleOnRN(reset);
            if (props.onModalHide) {
                scheduleOnRN(props.onModalHide);
            }
        }
    };

    if (!visible) return null;

    return (
        <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="box-none">
            {/* 背景遮罩 - 独立动画 */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }
                ]}
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(300)}
            >
                <TouchableWithoutFeedback onPress={hideModal}>
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
            </Animated.View>

            {/* 内容容器 - 独立动画 */}
            <View pointerEvents="box-none" style={styles.contentContainer}>
                <Animated.View
                    entering={props.entering || FadeIn.duration(300)}
                    exiting={props.exiting ? props.exiting.withCallback(handleExitingCallback) : FadeOut.duration(300).withCallback(handleExitingCallback)}
                    style={[styles.modalWrapper, props.style]}
                >
                    {/* 阻止点击内容穿透到背景 */}
                    <TouchableWithoutFeedback>
                        <View>
                            {content}
                        </View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 9999, // 确保在最上层
        elevation: 9999,
    },
    contentContainer: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalWrapper: {
        // 默认样式，可以被 props.style 覆盖
        // 注意：这里不再硬编码背景色或圆角，由 content 自行决定，或者在这里提供默认值
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
