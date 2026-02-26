import { FontAwesome6 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../providers/ThemeProvider';

export default function TabsLayout() {
  const { t } = useTranslation();
  const { isDark } = useThemeContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8b5cf6',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: isDark ? '#0f172a' : '#f8fafc',
        },
      }}
    >
      <Tabs.Screen
        name="habits"
        options={{
          title: t('tabs.habits'),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6
              name="calendar-check"
              size={size - 4}
              color={color}
              solid
            />
          ),
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: t('tabs.todo'),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6
              name="clipboard-list"
              size={size - 4}
              color={color}
              solid
            />
          ),
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: t('tabs.badges'),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6
              name="trophy"
              size={size - 4}
              color={color}
              solid
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6
              name="user"
              size={size - 4}
              color={color}
              solid
            />
          ),
        }}
      />
    </Tabs>
  );
}
