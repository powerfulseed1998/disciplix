import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { format, subDays, isToday } from 'date-fns';
import { useTasksStore } from '../store/useTasksStore';
import { useHabitsStore } from '../store/useHabitsStore';
import { getChartColors } from '../components/charts/chartTheme';

export function useChartData(isDark: boolean) {
  const colors = getChartColors(isDark);
  const tasks = useTasksStore((state) => state.tasks);
  const habits = useHabitsStore((state) => state.habits);

  // Task Statistics
  const taskStats = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    const pending = tasks.filter((t) => !t.completed).length;
    const total = tasks.length;

    const byPriority = {
      urgent: tasks.filter((t) => t.priority === 'urgent').length,
      high: tasks.filter((t) => t.priority === 'high').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      low: tasks.filter((t) => t.priority === 'low').length,
      none: tasks.filter((t) => !t.priority).length,
    };

    const categoryMap = new Map<
      string,
      { count: number; color: string; label: string }
    >();
    tasks.forEach((task) => {
      if (task.category) {
        const key = task.category.id;
        const existing = categoryMap.get(key);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(key, {
            count: 1,
            color: task.category.color,
            label: task.category.label,
          });
        }
      }
    });

    return {
      completed,
      pending,
      total,
      byPriority,
      byCategory: Array.from(categoryMap.values()),
    };
  }, [tasks]);

  // Habit Statistics
  const habitStats = useMemo(() => {
    const total = habits.length;
    const completedToday = habits.filter((h) => h.completedToday).length;
    const avgStreak =
      total > 0
        ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / total)
        : 0;
    const maxStreak =
      total > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;

    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayLabel = format(date, 'EEE');

      let completedCount = 0;
      habits.forEach((habit) => {
        if (habit.completedDates?.[dateKey]) {
          completedCount++;
        }
      });

      return {
        date: dateKey,
        label: dayLabel,
        value: completedCount,
        isToday: isToday(date),
      };
    });

    const streakRanking = [...habits]
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);

    return {
      total,
      completedToday,
      avgStreak,
      maxStreak,
      last7Days,
      streakRanking,
    };
  }, [habits]);

  const taskPieData = useMemo(() => {
    if (taskStats.total === 0) return [];
    return [
      {
        value: taskStats.completed,
        color: colors.success,
        text: `${Math.round((taskStats.completed / taskStats.total) * 100)}%`,
        focused: true,
      },
      {
        value: taskStats.pending,
        color: colors.muted,
        text: `${Math.round((taskStats.pending / taskStats.total) * 100)}%`,
      },
    ];
  }, [taskStats, colors]);

  const priorityBarData = useMemo(() => {
    return [
      {
        value: taskStats.byPriority.urgent,
        label: 'Urgent',
        frontColor: colors.danger,
        topLabelComponent: () => (
          <Text
            style={{
              color: colors.text,
              fontSize: 10,
              fontWeight: '600',
              marginBottom: 4,
            }}
          >
            {taskStats.byPriority.urgent}
          </Text>
        ),
      },
      {
        value: taskStats.byPriority.high,
        label: 'High',
        frontColor: colors.warning,
        topLabelComponent: () => (
          <Text
            style={{
              color: colors.text,
              fontSize: 10,
              fontWeight: '600',
              marginBottom: 4,
            }}
          >
            {taskStats.byPriority.high}
          </Text>
        ),
      },
      {
        value: taskStats.byPriority.medium,
        label: 'Med',
        frontColor: colors.info,
        topLabelComponent: () => (
          <Text
            style={{
              color: colors.text,
              fontSize: 10,
              fontWeight: '600',
              marginBottom: 4,
            }}
          >
            {taskStats.byPriority.medium}
          </Text>
        ),
      },
      {
        value: taskStats.byPriority.low,
        label: 'Low',
        frontColor: colors.success,
        topLabelComponent: () => (
          <Text
            style={{
              color: colors.text,
              fontSize: 10,
              fontWeight: '600',
              marginBottom: 4,
            }}
          >
            {taskStats.byPriority.low}
          </Text>
        ),
      },
    ];
  }, [taskStats, colors]);

  const habitLineData = useMemo(() => {
    return habitStats.last7Days.map((day) => ({
      value: day.value,
      label: day.label,
      dataPointColor: day.isToday ? colors.primary : colors.secondary,
      dataPointRadius: day.isToday ? 6 : 4,
    }));
  }, [habitStats, colors]);

  const streakBarData = useMemo(() => {
    return habitStats.streakRanking.map((habit) => ({
      value: habit.streak,
      label:
        habit.name.length > 4 ? habit.name.slice(0, 4) + '..' : habit.name,
      frontColor: habit.color || colors.primary,
      topLabelComponent: () => (
        <Text
          style={{
            color: colors.text,
            fontSize: 10,
            fontWeight: '600',
            marginBottom: 4,
          }}
        >
          {habit.streak}d
        </Text>
      ),
    }));
  }, [habitStats, colors]);

  const categoryPieData = useMemo(() => {
    if (taskStats.byCategory.length === 0) return [];
    return taskStats.byCategory.map((cat) => ({
      value: cat.count,
      color: cat.color || colors.primary,
      text: cat.label,
    }));
  }, [taskStats, colors]);

  return {
    taskStats,
    habitStats,
    taskPieData,
    priorityBarData,
    habitLineData,
    streakBarData,
    categoryPieData,
    colors,
  };
}
