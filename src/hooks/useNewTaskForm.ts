import { useState, useRef, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import { useCategoriesStore } from '../store/useCategoriesStore';
import { useTasksStore } from '../store/useTasksStore';

type UseNewTaskFormParams = {
    isVisible: boolean;
    onClose: () => void;
};

export function useNewTaskForm({ isVisible, onClose }: UseNewTaskFormParams) {
    const addTask = useTasksStore(state => state.addTask);
    const categories = useCategoriesStore(state => state.categories);
    const [taskTime, setTaskTime] = useState(new Date());
    const [selectedCategory, setSelectedCategory] = useState<string>(
        categories[1]?.id || '',
    );
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const isTimeModified = useRef(false);
    const [isAllDay, setIsAllDay] = useState(false);
    const [addToAlarm, setAddToAlarm] = useState(false);

    useEffect(() => {
        if (!isVisible) {
            isTimeModified.current = false;
            setIsAllDay(false);
            setAddToAlarm(false);
        } else {
            setTaskTime(new Date());
            setAddToAlarm(false);
        }
    }, [isVisible]);

    async function handleCreateTask() {
        if (!taskTitle.trim()) return;

        const selectedCategoryObj = categories.find(c => c.id === selectedCategory);
        let finalTime = taskTime;

        if (!isTimeModified.current) {
            const now = new Date();
            const isToday =
                taskTime.getDate() === now.getDate() &&
                taskTime.getMonth() === now.getMonth() &&
                taskTime.getFullYear() === now.getFullYear();

            if (isToday) {
                finalTime = now;
            }
        }

        addTask({
            id: Date.now().toString(),
            title: taskTitle.trim(),
            description: taskDescription.trim(),
            completed: false,
            category: selectedCategoryObj,
            time: finalTime,
            isAllDay: isAllDay,
        });

        if (Platform.OS === 'android' && addToAlarm && !isAllDay) {
            try {
                await IntentLauncher.startActivityAsync('android.intent.action.SET_ALARM', {
                    extra: {
                        'android.intent.extra.alarm.MESSAGE': taskTitle.trim(),
                        'android.intent.extra.alarm.HOUR': finalTime.getHours(),
                        'android.intent.extra.alarm.MINUTES': finalTime.getMinutes(),
                        'android.intent.extra.alarm.SKIP_UI': true,
                    },
                });
            } catch (err) {
                console.error('Failed to set alarm:', err);
                Alert.alert('Error', 'Could not set system alarm.');
            }
        }

        setTaskTitle('');
        setTaskDescription('');
        setTaskTime(new Date());
        setSelectedCategory(categories[1]?.id || '');
        onClose();
    }

    return {
        taskTitle,
        setTaskTitle,
        taskDescription,
        setTaskDescription,
        taskTime,
        setTaskTime,
        selectedCategory,
        setSelectedCategory,
        isAllDay,
        setIsAllDay,
        addToAlarm,
        setAddToAlarm,
        isTimeModified,
        handleCreateTask,
        categories,
    };
}
