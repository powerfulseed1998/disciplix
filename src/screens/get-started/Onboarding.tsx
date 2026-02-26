import React, { useRef, useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    FadeIn,
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { useThemeContext } from '../../providers/ThemeProvider';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Onboarding data
const ONBOARDING_DATA = [
    {
        id: 1,
        icon: 'calendar-check',
        iconBg: '#8b5cf6',
        title: 'Build Better Life',
        subtitle:
            'Track your plans and daily habits to build a routine that sticks. Small steps lead to big changes.',
        decorIcon1: 'star',
        decorIcon2: 'fire',
    },
    {
        id: 2,
        icon: 'chart-line',
        iconBg: '#10b981',
        title: 'Track Your Progress',
        subtitle:
            "Visualize your journey with beautiful charts. Stay motivated by seeing how far you've come.",
        decorIcon1: 'trophy',
        decorIcon2: 'bolt',
    },
    {
        id: 3,
        icon: 'medal',
        iconBg: '#f59e0b',
        title: 'Unlock Achievements',
        subtitle:
            'Earn badges and rewards as you reach milestones. Make habit building fun and rewarding.',
        decorIcon1: 'gem',
        decorIcon2: 'crown',
    },
];

// Single onboarding page component
const OnboardingPage = ({
    data,
    index,
    currentPage,
    isDark,
}: {
    data: (typeof ONBOARDING_DATA)[0];
    index: number;
    currentPage: number;
    isDark: boolean;
}) => {
    const isActive = index === currentPage;
    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryColor = isDark ? '#94a3b8' : '#64748b';

    return (
        <View style={styles.page}>
            {/* Background decorations */}
            <View
                style={[
                    styles.bgDecor1,
                    { backgroundColor: data.iconBg + '10' },
                ]}
            />
            <View
                style={[
                    styles.bgDecor2,
                    { backgroundColor: data.iconBg + '08' },
                ]}
            />
            <View
                style={[
                    styles.bgDecor3,
                    { backgroundColor: data.iconBg + '05' },
                ]}
            />

            {/* Main content */}
            <Animated.View
                entering={
                    isActive ? FadeInDown.delay(200).springify() : undefined
                }
                style={styles.contentContainer}
            >
                {/* Icon container with floating decorations */}
                <View style={styles.iconSection}>
                    {/* Floating decoration icons */}
                    <Animated.View
                        entering={FadeIn.delay(400)}
                        style={[styles.floatingIcon, styles.floatingIcon1]}
                    >
                        <View
                            style={[
                                styles.floatingIconBg,
                                {
                                    backgroundColor: isDark
                                        ? '#334155'
                                        : '#f1f5f9',
                                },
                            ]}
                        >
                            <FontAwesome6
                                name={data.decorIcon1}
                                size={16}
                                color={data.iconBg}
                                solid
                            />
                        </View>
                    </Animated.View>

                    <Animated.View
                        entering={FadeIn.delay(500)}
                        style={[styles.floatingIcon, styles.floatingIcon2]}
                    >
                        <View
                            style={[
                                styles.floatingIconBg,
                                {
                                    backgroundColor: isDark
                                        ? '#334155'
                                        : '#f1f5f9',
                                },
                            ]}
                        >
                            <FontAwesome6
                                name={data.decorIcon2}
                                size={16}
                                color={data.iconBg}
                                solid
                            />
                        </View>
                    </Animated.View>

                    {/* Main icon */}
                    <View
                        style={[
                            styles.mainIconContainer,
                            { backgroundColor: data.iconBg },
                        ]}
                    >
                        <View style={styles.mainIconInner}>
                            <FontAwesome6
                                name={data.icon}
                                size={56}
                                color="#fff"
                                solid
                            />
                        </View>
                        {/* Glow effect */}
                        <View
                            style={[
                                styles.iconGlow,
                                {
                                    backgroundColor: data.iconBg,
                                    shadowColor: data.iconBg,
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* Text content */}
                <View style={styles.textSection}>
                    <Animated.Text
                        entering={
                            isActive
                                ? FadeInUp.delay(300).springify()
                                : undefined
                        }
                        style={[styles.title, { color: textColor }]}
                    >
                        {data.title}
                    </Animated.Text>
                    <Animated.Text
                        entering={
                            isActive
                                ? FadeInUp.delay(400).springify()
                                : undefined
                        }
                        style={[styles.subtitle, { color: secondaryColor }]}
                    >
                        {data.subtitle}
                    </Animated.Text>
                </View>
            </Animated.View>
        </View>
    );
};

// Pagination dots
const PaginationDot = ({
    isActive,
    isDark,
}: {
    isActive: boolean;
    isDark: boolean;
}) => {
    const width = useSharedValue(isActive ? 24 : 8);
    const color = useSharedValue(
        isActive ? '#8b5cf6' : isDark ? '#334155' : '#e2e8f0',
    );

    React.useEffect(() => {
        width.value = withSpring(isActive ? 24 : 8, {
            mass: 1,
            damping: 15,
            stiffness: 120,
        });
        color.value = withTiming(
            isActive ? '#8b5cf6' : isDark ? '#334155' : '#e2e8f0',
            {
                duration: 300,
            },
        );
    }, [isActive, isDark]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: width.value,
            backgroundColor: color.value,
        };
    });

    return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const PaginationDots = ({
    total,
    currentPage,
    isDark,
}: {
    total: number;
    currentPage: number;
    isDark: boolean;
}) => {
    return (
        <View style={styles.pagination}>
            {Array.from({ length: total }).map((_, index) => (
                <PaginationDot
                    key={index}
                    isActive={index === currentPage}
                    isDark={isDark}
                />
            ))}
        </View>
    );
};

export default function Onboarding() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { isDark } = useThemeContext();
    const pagerRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const setHasCompletedOnboarding = usePreferencesStore(
        state => state.setHasCompletedOnboarding,
    );


    const handleNext = useCallback(() => {

        if (currentPage === ONBOARDING_DATA.length - 1) {
            setHasCompletedOnboarding(true);
            router.replace('/(tabs)/habits');
        } else {
            pagerRef.current?.setPage(currentPage + 1);
        }
    }, [currentPage, router, setHasCompletedOnboarding]);

    const handleSkip = useCallback(() => {
        setHasCompletedOnboarding(true);
        router.replace('/(tabs)/habits');
    }, [router, setHasCompletedOnboarding]);

    // Theme colors
    const bgColor = isDark ? '#0f172a' : '#f8fafc';
    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryColor = isDark ? '#94a3b8' : '#64748b';

    const isLastPage = currentPage === ONBOARDING_DATA.length - 1;

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <View style={styles.headerLeft}>
                    <View
                        style={[
                            styles.logoBadge,
                            { backgroundColor: isDark ? '#334155' : '#f1f5f9' },
                        ]}
                    >
                        <FontAwesome6
                            name="leaf"
                            size={18}
                            color="#8b5cf6"
                            solid
                        />
                    </View>
                    <Text style={[styles.logoText, { color: textColor }]}>
                        Powerful Plan
                    </Text>
                </View>
                {!isLastPage && (
                    <Pressable onPress={handleSkip} style={styles.skipButton}>
                        <Text
                            style={[styles.skipText, { color: secondaryColor }]}
                        >
                            Skip
                        </Text>
                    </Pressable>
                )}
            </View>

            {/* Pager */}
            <PagerView
                style={styles.pager}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={e => setCurrentPage(e.nativeEvent.position)}
            >
                {ONBOARDING_DATA.map((data, index) => (
                    <View key={data.id} style={styles.pageWrapper}>
                        <OnboardingPage
                            data={data}
                            index={index}
                            currentPage={currentPage}
                            isDark={isDark}
                        />
                    </View>
                ))}
            </PagerView>

            {/* Bottom section */}
            <View
                style={[
                    styles.bottomSection,
                    { paddingBottom: insets.bottom + 24 },
                ]}
            >
                <PaginationDots
                    total={ONBOARDING_DATA.length}
                    currentPage={currentPage}
                    isDark={isDark}
                />

                <AnimatedPressable
                    onPress={handleNext}
                    style={[styles.nextButton]}
                >
                    <Text style={styles.nextButtonText}>
                        {isLastPage ? 'Get Started' : 'Continue'}
                    </Text>
                    <View style={styles.nextButtonIcon}>
                        <FontAwesome6
                            name={isLastPage ? 'rocket' : 'arrow-right'}
                            size={16}
                            color="#fff"
                            solid
                        />
                    </View>
                </AnimatedPressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoBadge: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: '700',
    },
    skipButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '500',
    },
    pager: {
        flex: 1,
    },
    pageWrapper: {
        flex: 1,
    },
    page: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    bgDecor1: {
        position: 'absolute',
        top: '10%',
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    bgDecor2: {
        position: 'absolute',
        bottom: '20%',
        left: -80,
        width: 250,
        height: 250,
        borderRadius: 125,
    },
    bgDecor3: {
        position: 'absolute',
        top: '40%',
        left: '60%',
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    contentContainer: {
        alignItems: 'center',
    },
    iconSection: {
        marginBottom: 48,
        position: 'relative',
    },
    floatingIcon: {
        position: 'absolute',
        zIndex: 10,
    },
    floatingIcon1: {
        top: -10,
        right: -30,
    },
    floatingIcon2: {
        bottom: 10,
        left: -40,
    },
    floatingIconBg: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    mainIconContainer: {
        width: 140,
        height: 140,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 12,
    },
    mainIconInner: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconGlow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 40,
        opacity: 0.3,
        transform: [{ scale: 1.1 }],
        zIndex: -1,
    },
    textSection: {
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 17,
        lineHeight: 26,
        textAlign: 'center',
        maxWidth: 320,
    },
    bottomSection: {
        paddingHorizontal: 24,
        gap: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8b5cf6',
        paddingVertical: 18,
        borderRadius: 20,
        gap: 12,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    nextButtonIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
