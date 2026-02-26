import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    Dimensions,
    Platform,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    SharedValue,
    withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { useNewTaskForm } from '../../hooks/useNewTaskForm';
import { CategorySelector } from './new-task/CategorySelector';
import { DateTimePickerSection } from './new-task/DateTimePickerSection';
import { TaskInputFields } from './new-task/TaskInputFields';
import { IOSPickerModal } from './new-task/IOSPickerModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FAB_SIZE = 60;
const FAB_MARGIN_RIGHT = 24;
const FAB_MARGIN_BOTTOM = 24;
const CARD_MARGIN_X = 6;
const CARD_HEIGHT_PERCENT = 0.765;

type NewTaskModalProps = {
    isVisible: boolean;
    expandProgress: SharedValue<number>;
    bottomTabBarHeight: number;
    onClose: () => void;
    isDark: boolean;
};

export default function NewTaskModal({
    isVisible,
    expandProgress,
    bottomTabBarHeight,
    onClose,
    isDark,
}: NewTaskModalProps) {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const {
        taskTitle, setTaskTitle,
        taskDescription, setTaskDescription,
        taskTime, setTaskTime,
        selectedCategory, setSelectedCategory,
        isAllDay, setIsAllDay,
        addToAlarm, setAddToAlarm,
        isTimeModified,
        handleCreateTask,
    } = useNewTaskForm({ isVisible, onClose });

    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('time');
    const pickerProgress = useSharedValue(0);
    const previousTimeRef = useRef<Date | null>(null);

    const CARD_TOP_PERCENT = (SCREEN_HEIGHT - (bottomTabBarHeight || 0) - (SCREEN_HEIGHT * CARD_HEIGHT_PERCENT)) / SCREEN_HEIGHT / 2;
    const END_WIDTH = SCREEN_WIDTH - CARD_MARGIN_X * 2;
    const END_HEIGHT = SCREEN_HEIGHT * CARD_HEIGHT_PERCENT;
    const END_TOP = SCREEN_HEIGHT * CARD_TOP_PERCENT;
    const END_LEFT = CARD_MARGIN_X;
    const START_TOP = SCREEN_HEIGHT - insets.bottom - FAB_MARGIN_BOTTOM - FAB_SIZE;
    const START_LEFT = SCREEN_WIDTH - FAB_MARGIN_RIGHT - FAB_SIZE;

    const overlayAnimatedStyle = useAnimatedStyle(() => ({
        width: END_WIDTH,
        height: END_HEIGHT,
        top: END_TOP,
        left: END_LEFT,
        transform: [
            { translateX: interpolate(expandProgress.value, [0, 1], [START_LEFT - END_LEFT, 0]) },
            { translateY: interpolate(expandProgress.value, [0, 1], [START_TOP - END_TOP, 0]) },
            { scaleX: interpolate(expandProgress.value, [0, 1], [FAB_SIZE / END_WIDTH, 1]) },
            { scaleY: interpolate(expandProgress.value, [0, 1], [FAB_SIZE / END_HEIGHT, 1]) },
        ],
        borderRadius: interpolate(expandProgress.value, [0, 1], [100, 28]),
        opacity: interpolate(expandProgress.value, [0, 0.1], [0, 1]),
    }));

    const contentStyle = useAnimatedStyle(() => ({
        opacity: interpolate(expandProgress.value, [0.6, 1], [0, 1]),
        transform: [{ translateY: interpolate(expandProgress.value, [0, 1], [20, 0]) }],
    }));

    function openPicker(mode: 'date' | 'time') {
        if (Platform.OS === 'ios') {
            previousTimeRef.current = taskTime;
            setPickerMode(mode);
            setShowPicker(true);
            pickerProgress.value = withTiming(1, { duration: 300 });
        } else {
            setPickerMode(mode);
            setShowPicker(true);
        }
    }

    function closePicker() {
        if (Platform.OS === 'ios') {
            pickerProgress.value = withTiming(0, { duration: 300 }, finished => {
                if (finished) scheduleOnRN(setShowPicker, false);
            });
        } else {
            setShowPicker(false);
        }
    }

    function handleCancelPicker() {
        if (previousTimeRef.current) setTaskTime(previousTimeRef.current);
        closePicker();
    }

    function onTimeChange(event: DateTimePickerEvent, selectedDate?: Date) {
        if (Platform.OS === 'android') setShowPicker(false);
        if (selectedDate && event.type !== 'dismissed') {
            if (pickerMode === 'time') isTimeModified.current = true;
            setTaskTime(current => {
                const newDate = new Date(selectedDate);
                if (pickerMode === 'time') {
                    return new Date(current.getFullYear(), current.getMonth(), current.getDate(), newDate.getHours(), newDate.getMinutes());
                }
                return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), current.getHours(), current.getMinutes());
            });
        }
    }

    if (!isVisible) return null;

    const cardBg = isDark ? '#1e293b' : '#ffffff';
    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryColor = isDark ? '#94a3b8' : '#64748b';

    return (
        <Animated.View
            className="absolute overflow-hidden z-[100] shadow-black elevation-12"
            style={[{ backgroundColor: cardBg, shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.25, shadowRadius: 24 }, overlayAnimatedStyle]}
        >
            <Animated.View className="flex-1" style={contentStyle}>
                <View className="absolute top-6 right-6 z-10">
                    <Pressable
                        onPress={onClose}
                        className="w-9 h-9 rounded-xl items-center justify-center"
                        style={{ backgroundColor: isDark ? '#334155' : '#f1f5f9' }}
                    >
                        <FontAwesome6 name="xmark" size={16} color={secondaryColor} />
                    </Pressable>
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="mt-1 mb-6 pr-[60px]">
                        <Text className="text-2xl font-bold mb-1" style={{ color: textColor }}>{t('todo.newTask')}</Text>
                        <Text className="text-sm" style={{ color: secondaryColor }}>{t('todo.newTaskDesc')}</Text>
                    </View>

                    <TaskInputFields
                        taskTitle={taskTitle} setTaskTitle={setTaskTitle}
                        taskDescription={taskDescription} setTaskDescription={setTaskDescription}
                        isDark={isDark}
                    />

                    <View className="h-4" />

                    <CategorySelector
                        selectedCategoryId={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        isDark={isDark}
                    />

                    <View className="h-4" />

                    <DateTimePickerSection
                        taskTime={taskTime}
                        isAllDay={isAllDay} setIsAllDay={setIsAllDay}
                        addToAlarm={addToAlarm} setAddToAlarm={setAddToAlarm}
                        onOpenPicker={openPicker}
                        isDark={isDark}
                    />
                </ScrollView>

                <View className="px-6 pt-4 absolute bottom-0 left-0 right-0 items-center z-20" style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
                    <Pressable
                        onPress={handleCreateTask}
                        className="w-[80%] flex-row items-center justify-center py-[18px] rounded-2xl shadow-lg elevation-6"
                        style={{
                            backgroundColor: taskTitle.trim() ? '#8b5cf6' : (isDark ? '#334155' : '#e2e8f0'),
                            shadowColor: taskTitle.trim() ? '#8b5cf6' : 'transparent',
                        }}
                        disabled={!taskTitle.trim()}
                    >
                        <FontAwesome6 name="plus" size={16} color={taskTitle.trim() ? "#fff" : secondaryColor} className="mr-2" />
                        <Text className="text-base font-bold ml-2" style={{ color: taskTitle.trim() ? "#fff" : secondaryColor }}>{t('todo.createTask')}</Text>
                    </Pressable>
                </View>
            </Animated.View>

            <IOSPickerModal
                showPicker={showPicker && Platform.OS === 'ios'}
                pickerMode={pickerMode}
                taskTime={taskTime}
                pickerProgress={pickerProgress}
                onTimeChange={onTimeChange}
                onCancel={handleCancelPicker}
                onDone={closePicker}
                isDark={isDark}
            />

            {showPicker && Platform.OS === 'android' && (
                <DateTimePicker value={taskTime} mode={pickerMode} is24Hour={false} display="default" onChange={onTimeChange} />
            )}
        </Animated.View>
    );
}