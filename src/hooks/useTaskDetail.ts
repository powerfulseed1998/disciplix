import { useState, useEffect, useRef } from 'react';
import { Platform, Keyboard } from 'react-native';
import { withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSharedValue } from 'react-native-reanimated';
import { Task, useTasksStore } from '../store/useTasksStore';

type UseTaskDetailParams = {
    task: Task;
    initialMode: 'view' | 'edit';
    onClose: () => void;
};

export function useTaskDetail({ task, initialMode, onClose }: UseTaskDetailParams) {
    const { updateTask, deleteTask } = useTasksStore();
    const [isEditing, setIsEditing] = useState(initialMode === 'edit');
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [time, setTime] = useState(task.time ? new Date(task.time) : new Date());
    const [category, setCategory] = useState(task.category);
    const [completed, setCompleted] = useState(task.completed);
    const [isAllDay, setIsAllDay] = useState(task.isAllDay || false);
    const [showPicker, setShowPicker] = useState(false);

    const pickerProgress = useSharedValue(0);
    const previousTimeRef = useRef<Date | null>(null);

    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description || '');
        setTime(task.time ? new Date(task.time) : new Date());
        setCategory(task.category);
        setCompleted(task.completed);
        setIsAllDay(task.isAllDay || false);
        setIsEditing(initialMode === 'edit');
    }, [task, initialMode]);

    function handleSaveChanges() {
        if (!title.trim()) return;
        updateTask({
            ...task,
            title: title.trim(),
            description: description.trim(),
            time,
            category,
            completed,
            isAllDay,
        });
        setIsEditing(false);
        Keyboard.dismiss();
    }

    function handleDelete() {
        deleteTask(task.id);
        onClose();
    }

    function openPicker() {
        previousTimeRef.current = time;
        setShowPicker(true);
        pickerProgress.value = withTiming(1, { duration: 300 });
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
        if (previousTimeRef.current) setTime(previousTimeRef.current);
        closePicker();
    }

    return {
        isEditing, setIsEditing,
        title, setTitle,
        description, setDescription,
        time, setTime,
        category, setCategory,
        completed, setCompleted,
        isAllDay, setIsAllDay,
        showPicker, setShowPicker,
        pickerProgress,
        handleSaveChanges, handleDelete,
        openPicker, closePicker, handleCancelPicker,
    };
}
