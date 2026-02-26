import { View, Text } from 'react-native';
import { getChartColors } from './chartTheme';

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isDark: boolean;
};

export function ChartCard({
  title,
  subtitle,
  children,
  isDark,
}: ChartCardProps) {
  const colors = getChartColors(isDark);
  return (
    <View
      className="rounded-3xl p-6 mb-5 shadow-sm"
      style={{ backgroundColor: colors.cardBg }}
    >
      <View className="mb-6">
        <Text
          className="text-lg font-bold"
          style={{ color: colors.text }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            className="text-xs mt-1 font-medium"
            style={{ color: colors.textSecondary }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
}
