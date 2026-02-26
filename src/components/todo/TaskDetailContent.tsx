import React from 'react';
import { View } from 'react-native';
import { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { useThemeContext } from '../../providers/ThemeProvider';
import { Task } from '../../store/useTasksStore';
import { useTaskDetail } from '../../hooks/useTaskDetail';
import { TaskDetailView } from './detail/TaskDetailView';
import { TaskDetailEdit } from './detail/TaskDetailEdit';

type TaskDetailContentProps = {
    task: Task;
    onClose: () => void;
    initialMode?: 'view' | 'edit';
    onEnterEditMode?: () => void;
};

export default function TaskDetailContent({
    task,
    onClose,
    initialMode = 'view',
    onEnterEditMode,
}: TaskDetailContentProps) {
    const { isDark } = useThemeContext();
    const {
        isEditing, setIsEditing,
        title, setTitle,
        description, setDescription,
        time, setTime,
        category, setCategory,
        completed, setCompleted,
        isAllDay, setIsAllDay,
        showPicker, pickerProgress,
        handleSaveChanges, handleDelete,
        openPicker, closePicker, handleCancelPicker,
    } = useTaskDetail({ task, initialMode, onClose });

    const pickerContainerStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: interpolate(pickerProgress.value, [0, 1], [350, 0]) }],
    }));

    return (
        <View
            className="flex-1 rounded-t-[32px] overflow-hidden"
            style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff' }}
        >
            {isEditing ? (
                <TaskDetailEdit
                    title={title} setTitle={setTitle}
                    description={description} setDescription={setDescription}
                    time={time} setTime={setTime}
                    category={category} setCategory={setCategory}
                    isAllDay={isAllDay} setIsAllDay={setIsAllDay}
                    onSave={handleSaveChanges}
                    onCancel={() => setIsEditing(false)}
                    onDelete={handleDelete}
                    openPicker={openPicker}
                    closePicker={closePicker}
                    handleCancelPicker={handleCancelPicker}
                    showPicker={showPicker}
                    pickerContainerStyle={pickerContainerStyle}
                    isDark={isDark}
                />
            ) : (
                <TaskDetailView
                    task={task}
                    title={title} description={description}
                    time={time} category={category}
                    completed={completed} setCompleted={setCompleted}
                    isAllDay={isAllDay}
                    onEdit={() => {
                        setIsEditing(true);
                        onEnterEditMode?.();
                    }}
                    onDelete={handleDelete}
                    isDark={isDark}
                />
            )}
        </View>
    );
}