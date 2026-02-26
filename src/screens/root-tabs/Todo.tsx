import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { useThemeContext } from '../../providers/ThemeProvider';
import NewTaskModal from '../../components/todo/NewTaskModal';
import PriorityModal from '../../components/todo/PriorityModal';
import TaskDetailContent from '../../components/todo/TaskDetailContent';
import TaskCard from '../../components/todo/TaskCard';
import FloatingActionButton from '../../components/todo/FloatingActionButton';
import Backdrop from '../../components/todo/Backdrop';
import SortMenu from '../../components/todo/SortMenu';
import { TasksHeader } from '../../components/todo/TasksHeader';
import { useTodoScreen, TodoListItem } from '../../hooks/useTodoScreen';
import { EmptySection, CategoriesSectionContainer } from '../../components/todo/sections/TodoSections';

export default function TodoScreen() {
    const { isDark } = useThemeContext();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const bottomTabBarHeight = useBottomTabBarHeight();
    const {
        state, actions, refs, animations, listData,
        onSwipeStart, handleTaskDetail, handleToggleSortMenu,
        handleSelectSort, handleOpenNewTask, handleCloseNewTask,
        handlePrioritySelect, tasks
    } = useTodoScreen();

    // Track the total fixed header height (title + categories) dynamically
    const [headerHeight, setHeaderHeight] = useState(0);

    const sortMenuAnimatedStyle = useAnimatedStyle(() => ({
        opacity: animations.sortMenuAnimation.value,
        transform: [
            { scale: interpolate(animations.sortMenuAnimation.value, [0, 1], [0.9, 1]) },
            { translateY: interpolate(animations.sortMenuAnimation.value, [0, 1], [-10, 0]) },
        ],
    }));

    const scaleAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: interpolate(animations.expandProgress.value, [0, 1], [1, 0]) },
            { rotate: `${interpolate(animations.expandProgress.value, [0, 1], [0, 45])}deg` },
        ],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(animations.expandProgress.value, [0, 1], [0, 0.6]),
        zIndex: animations.expandProgress.value === 0 ? -1 : 90,
    }));

    function renderItem({ item }: { item: TodoListItem }) {
        return (
            <TaskCard
                item={item.data}
                index={item.index}
                onToggleDetail={handleTaskDetail}
                onSetPriority={actions.openPriorityModal}
                onSwipeStart={onSwipeStart}
            />
        );
    }

    function renderBackdrop(props: BottomSheetBackdropProps) {
        return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />;
    }

    const bgColor = isDark ? '#0f172a' : '#f8fafc';
    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryTextColor = isDark ? '#94a3b8' : '#64748b';

    return (
        <View className="flex-1" style={{ backgroundColor: bgColor }}>
            {/* Fixed Header: Title + Sticky Categories */}
            <View
                className="absolute w-full z-10 overflow-hidden"
                style={{ paddingTop: insets.top }}
                onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
            >
                {Platform.OS === 'ios' ? (
                    <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} className="absolute inset-0" />
                ) : (
                    <View className="absolute inset-0" style={{ backgroundColor: bgColor }} />
                )}

                {/* Title row */}
                <View className="flex-row justify-between items-center px-6 pt-5">
                    <View>
                        <Text className="text-sm font-medium mb-1" style={{ color: secondaryTextColor }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </Text>
                        <Text className="text-3xl font-bold" style={{ color: textColor }}>{t('todo.myTasks')}</Text>
                    </View>
                    <View className="w-11 h-11 rounded-3xl items-center justify-center" style={{ backgroundColor: isDark ? '#334155' : '#f1f5f9' }}>
                        <FontAwesome6 name="list" size={18} color={isDark ? '#a78bfa' : '#8b5cf6'} solid />
                    </View>
                </View>

                {/* Sticky Categories filter bar */}
                <View className="px-5 pt-4 pb-3">
                    <CategoriesSectionContainer
                        activeCategory={state.activeCategory}
                        setActiveCategory={actions.setActiveCategory}
                        isDark={isDark}
                        compact
                    />
                </View>

                {/* Divider */}
                <View className="w-full h-[0.5px]" style={{ backgroundColor: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.5)' }} />
            </View>

            <FlashList
                data={listData}
                renderItem={renderItem}
                keyExtractor={item => item.key}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: headerHeight || (insets.top + 160),
                    paddingBottom: 120,
                }}
                ListHeaderComponent={
                    <TasksHeader
                        sortBy={state.sortBy}
                        handleToggleSortMenu={handleToggleSortMenu}
                        sortButtonRef={refs.sortButtonRef}
                    />
                }
                ListEmptyComponent={<EmptySection isDark={isDark} />}
            />

            <FloatingActionButton
                onPress={handleOpenNewTask}
                scaleAnimatedStyle={scaleAnimatedStyle}
                bottomInset={insets.bottom}
            />

            <Backdrop
                isVisible={state.isOverlayVisible}
                backdropStyle={backdropStyle}
                onPress={handleCloseNewTask}
            />

            <NewTaskModal
                isVisible={state.isOverlayVisible}
                expandProgress={animations.expandProgress}
                bottomTabBarHeight={bottomTabBarHeight}
                onClose={handleCloseNewTask}
                isDark={isDark}
            />

            <PriorityModal
                isVisible={state.priorityModalVisible}
                currentPriority={state.priorityTaskId ? tasks.find(t => t.id === state.priorityTaskId)?.priority : undefined}
                onSelectPriority={handlePrioritySelect}
                onClose={actions.closePriorityModal}
                isDark={isDark}
            />

            <SortMenu
                isVisible={state.isSortMenuVisible}
                animatedStyle={sortMenuAnimatedStyle}
                buttonPosition={state.sortButtonPosition}
                sortBy={state.sortBy}
                onSelectSort={handleSelectSort}
                onToggleMenu={handleToggleSortMenu}
                cardBg={isDark ? '#1e293b' : '#fff'}
                textColor={textColor}
                secondaryTextColor={secondaryTextColor}
            />

            <BottomSheetModal
                style={{ marginHorizontal: 4, backgroundColor: isDark ? '#1e293b' : '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
                handleIndicatorStyle={{ backgroundColor: isDark ? '#334155' : '#e2e8f0' }}
                backgroundStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff' }}
                ref={refs.bottomSheetModalRef}
                index={state.initialSheetMode === 'edit' ? 1 : 0}
                snapPoints={['82%']}
                enablePanDownToClose={true}
                backdropComponent={renderBackdrop}
                onDismiss={actions.closeTaskDetail}
            >
                <BottomSheetView className="flex-1" style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff' }}>
                    {state.selectedTask && (
                        <TaskDetailContent
                            task={state.selectedTask}
                            onClose={() => refs.bottomSheetModalRef.current?.dismiss()}
                            initialMode={state.initialSheetMode}
                            onEnterEditMode={() => refs.bottomSheetModalRef.current?.snapToIndex(1)}
                        />
                    )}
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
}
