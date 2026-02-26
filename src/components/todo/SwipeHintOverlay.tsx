import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    FadeIn,
    FadeOut,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';
import { useThemeContext } from '../../providers/ThemeProvider';
import { usePreferencesStore } from '../../store/usePreferencesStore';

export default function SwipeHintOverlay() {
    const { isDark } = useThemeContext();
    const markSwipeHintShown = usePreferencesStore(state => state.markSwipeHintShown);
    const handOffset = useSharedValue(0);

    useEffect(() => {
        // Animation loop
        handOffset.value = withRepeat(
            withSequence(
                withTiming(-40, { duration: 800 }), // Swipe left
                withTiming(0, { duration: 800 })    // Return
            ),
            -1, // Infinite repeat
            false
        );

        // Auto-hide after 3 seconds
        const timeout = setTimeout(() => {
            markSwipeHintShown();
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    const handStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: handOffset.value }],
    }));

    return (
        <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={styles.container}
            pointerEvents="none"
        >
            {/* Hint Content - Positioned Right with Transparent Background */}
            <View style={styles.rightContainer}>
                <Animated.View style={[styles.handContainer, handStyle]}>
                    <FontAwesome6
                        name="hand-pointer"
                        size={28}
                        color="#8b5cf6" // Use the theme's purple color for better visibility on transparent background
                        style={{
                            transform: [{ rotate: '-90deg' }],
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                        }}
                    />
                    <Text style={[styles.text, { color: isDark ? '#fff' : '#1e293b' }]}>
                        Swipe Left
                    </Text>
                </Animated.View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 50,
        borderRadius: 20,
    },
    rightContainer: {
        position: 'absolute',
        right: 16,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    handContainer: {
        alignItems: 'center',
        gap: 6,
        padding: 8,
    },
    text: {
        fontWeight: '700',
        fontSize: 12,
    },
});
