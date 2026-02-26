import { View, Text } from 'react-native';
import { getChartColors } from './chartTheme';

type EmptyChartStateProps = {
  message: string;
  isDark: boolean;
};

export function EmptyChartState({ message, isDark }: EmptyChartStateProps) {
  const colors = getChartColors(isDark);
  return (
    <View className="items-center justify-center py-10">
      <Text className="font-medium" style={{ color: colors.textSecondary }}>
        {message}
      </Text>
    </View>
  );
}
