import { useState, useRef, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useTranslation } from 'react-i18next';
import { useCategoriesStore } from '../store/useCategoriesStore';
import { useTasksStore } from '../store/useTasksStore';

type UseNewTaskFormParams = {
    isVisible: boolean;
    onClose: () => void;
};

export function useNewTaskForm({ isVisible, onClose }: UseNewTaskFormParams) {
    const { t } = useTranslation();
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

    async function requestPermissions() {
        const { status: existingStatus, granted: existingGranted } = await Notifications.getPermissionsAsync();
        if (existingGranted) return true;
        
        const { status, granted } = await Notifications.requestPermissionsAsync();
        
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#8b5cf6',
            });
        }
        
        return granted;
    }

    useEffect(() => {
        if (addToAlarm) {
            const checkPermission = async () => {
                const granted = await requestPermissions();
                if (!granted) {
                    setAddToAlarm(false);
                    Alert.alert(
                        t('settings.notifications.permissionDenied'),
                        t('settings.notifications.permissionDeniedDesc')
                    );
                }
            };
            checkPermission();
        }
    }, [addToAlarm]);

    async function handleCreateTask() {
        if (!taskTitle.trim()) return;

        const selectedCategoryObj = categories.find(c => c.id === selectedCategory);
        let finalTime = new Date(taskTime);

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

        const taskId = Date.now().toString();

        addTask({
            id: taskId,
            title: taskTitle.trim(),
            description: taskDescription.trim(),
            completed: false,
            category: selectedCategoryObj,
            time: finalTime,
            isAllDay: isAllDay,
        });

        if (addToAlarm && !isAllDay) {
            const hasPermission = await requestPermissions();
            if (hasPermission) {
                try {
                    const now = new Date();
                    // If the time is in the past or very soon (next 10 seconds), schedule it 10 seconds from now
                    if (finalTime.getTime() <= now.getTime() + 10000) {
                        finalTime = new Date(now.getTime() + 10000);
                    }
                    
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: taskTitle.trim(),
                            body: taskDescription.trim() || t('todo.taskDetails'),
                            sound: true,
                            data: { taskId },
                        },
                        trigger: {
                            type: Notifications.SchedulableTriggerInputTypes.DATE,
                            date: finalTime,
                            ...(Platform.OS === 'android' ? { channelId: 'default' } : {})
                        },
                    });
                } catch (err: any) {
                    console.error('Failed to schedule notification:', err);
                    Alert.alert('Error', `Could not schedule notification: ${err.message}`);
                }
            } else {
                Alert.alert(
                    t('settings.notifications.permissionDenied'),
                    t('settings.notifications.permissionDeniedDesc')
                );
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
