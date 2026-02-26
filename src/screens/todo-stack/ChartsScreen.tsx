import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeContext } from '../../providers/ThemeProvider';
import { BarChart, PieChart, LineChart } from 'react-native-gifted-charts';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useChartData } from '../../hooks/useChartData';
import { StatCard } from '../../components/charts/StatCard';
import { ChartCard } from '../../components/charts/ChartCard';
import { EmptyChartState } from '../../components/charts/EmptyChartState';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64;

export default function ChartsScreen() {
    const { isDark } = useThemeContext();
    const router = useRouter();

    const {
        taskStats,
        habitStats,
        taskPieData,
        priorityBarData,
        habitLineData,
        streakBarData,
        categoryPieData,
        colors,
    } = useChartData(isDark);

    return (
        <View className="flex-1" style={{ backgroundColor: colors.background }}>
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Custom Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: colors.cardBg }}
                    >
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold" style={{ color: colors.text }}>
                        Analytics
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Text */}
                    <View className="mb-8">
                        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
                            Performance Overview
                        </Text>
                        <Text className="text-sm mt-1 font-medium" style={{ color: colors.textSecondary }}>
                            Detailed breakdown of your productivity
                        </Text>
                    </View>

                    {/* Task Completion Rate Pie Chart */}
                    <ChartCard
                        title="Completion Rate"
                        subtitle={taskStats.total > 0 ? `Based on ${taskStats.total} total tasks` : undefined}
                        isDark={isDark}
                    >
                        {taskStats.total > 0 ? (
                            <View className="items-center">
                                <PieChart
                                    data={taskPieData}
                                    donut
                                    radius={90}
                                    innerRadius={65}
                                    centerLabelComponent={() => (
                                        <View className="items-center">
                                            <Text
                                                className="text-3xl font-bold"
                                                style={{ color: 'black' }}
                                            >
                                                {Math.round((taskStats.completed / taskStats.total) * 100)}%
                                            </Text>
                                            <Text
                                                className="text-[10px] font-bold uppercase tracking-tighter"
                                                style={{ color: colors.textSecondary }}
                                            >
                                                Success
                                            </Text>
                                        </View>
                                    )}
                                />
                                <View className="flex-row gap-8 mt-6">
                                    <View className="flex-row items-center">
                                        <View
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{ backgroundColor: colors.success }}
                                        />
                                        <Text className="text-xs font-semibold" style={{ color: colors.textSecondary }}>
                                            Done ({taskStats.completed})
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <View
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{ backgroundColor: colors.muted }}
                                        />
                                        <Text className="text-xs font-semibold" style={{ color: colors.textSecondary }}>
                                            Todo ({taskStats.pending})
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <EmptyChartState message="No tasks to analyze" isDark={isDark} />
                        )}
                    </ChartCard>

                    {/* Habit 7-Day Trend */}
                    <ChartCard
                        title="Habit Activity"
                        subtitle="Last 7 days performance"
                        isDark={isDark}
                    >
                        {habitStats.total > 0 ? (
                            <LineChart
                                data={habitLineData}
                                width={CHART_WIDTH - 20}
                                height={180}
                                spacing={40}
                                initialSpacing={20}
                                color={colors.primary}
                                thickness={4}
                                startFillColor={`${colors.primary}30`}
                                endFillColor={`${colors.primary}05`}
                                startOpacity={0.8}
                                endOpacity={0.1}
                                hideRules
                                hideYAxisText
                                xAxisColor="transparent"
                                yAxisColor="transparent"
                                xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10, fontWeight: '600' }}
                                dataPointsColor={colors.primary}
                                curved
                                areaChart
                                isAnimated
                                animationDuration={1000}
                                pointerConfig={{
                                    pointerStripColor: colors.primary,
                                    pointerStripWidth: 2,
                                    pointerColor: colors.primary,
                                    radius: 6,
                                    pointerLabelWidth: 80,
                                    pointerLabelHeight: 35,
                                    activatePointersOnLongPress: true,
                                    autoAdjustPointerLabelPosition: true,
                                    pointerLabelComponent: (items: any) => (
                                        <View
                                            className="px-3 py-1.5 rounded-xl shadow-lg"
                                            style={{ backgroundColor: colors.cardBg, borderWidth: 1, borderColor: colors.primary + '20' }}
                                        >
                                            <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 12 }}>
                                                {items[0].value} Habits
                                            </Text>
                                        </View>
                                    ),
                                }}
                            />
                        ) : (
                            <EmptyChartState message="No habit activity recorded" isDark={isDark} />
                        )}
                    </ChartCard>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
