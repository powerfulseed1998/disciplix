import { View, Text } from 'react-native';
import { getChartColors } from './chartTheme';

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  isDark: boolean;
};

export function StatCard({
  title,
  value,
  subtitle,
  color,
  isDark,
}: StatCardProps) {
  const colors = getChartColors(isDark);
  return (
    <View
      className="flex-1 rounded-3xl p-5 shadow-sm"
      style={{ backgroundColor: colors.cardBg }}
    >
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center mb-4"
        style={{ backgroundColor: `${color}15` }}
      >
        <View
          className="w-5 h-5 rounded-full"
          style={{ backgroundColor: color }}
        />
      </View>
      <Text
        className="text-2xl font-bold mb-1"
        style={{ color: colors.text }}
      >
        {value}
      </Text>
      <Text
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: colors.textSecondary }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          className="text-[10px] mt-1"
          style={{ color: colors.muted }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
