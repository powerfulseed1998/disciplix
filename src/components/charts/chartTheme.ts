export type ChartColors = {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  muted: string;
  text: string;
  textSecondary: string;
  background: string;
  cardBg: string;
};

export const getChartColors = (isDark: boolean): ChartColors => ({
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  muted: isDark ? '#475569' : '#94a3b8',
  text: isDark ? '#f1f5f9' : '#1e293b',
  textSecondary: isDark ? '#94a3b8' : '#64748b',
  background: isDark ? '#0f172a' : '#f8fafc',
  cardBg: isDark ? '#1e293b' : '#ffffff',
});
