import React from 'react';
import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../providers/ThemeProvider';
import * as Application from 'expo-application';
import { FontAwesome6 } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

export default function AboutScreen() {
    const { isDark } = useThemeContext();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    const currentYear = new Date().getFullYear();

    return (
        <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            >
                <View className="items-center mt-10 mb-8">
                    <View className={`w-24 h-24 rounded-3xl items-center justify-center mb-4 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
                        <Image
                            source={require('../../../assets/images/icon.png')}
                            style={{ width: 64, height: 64, borderRadius: 16 }}
                        />
                    </View>
                    <Text className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {Application.applicationName}
                    </Text>
                    <Text className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t('about.version', { version: Application.nativeApplicationVersion })}
                    </Text>
                </View>

                <View className="px-5">
                    <View className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <Pressable
                            className={`p-4 flex-row items-center justify-between active:opacity-70`}
                            onPress={() => {
                                // Placeholder for check updates
                                Toast.show({
                                    type: 'info',
                                    text1: t('toast.latestVersion'),
                                });
                            }}
                        >
                            <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {t('about.checkUpdates')}
                            </Text>
                            <FontAwesome6 name="chevron-right" size={14} color={isDark ? '#64748b' : '#94a3b8'} />
                        </Pressable>

                        <View className={`h-[1px] ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`} />

                        {/* <Pressable
                            className={`p-4 flex-row items-center justify-between active:opacity-70`}
                        >
                            <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Terms of Service
                            </Text>
                            <FontAwesome6 name="chevron-right" size={14} color={isDark ? '#64748b' : '#94a3b8'} />
                        </Pressable>

                        <View className={`h-[1px] ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`} />

                        <Pressable
                            className={`p-4 flex-row items-center justify-between active:opacity-70`}
                        >
                            <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Privacy Policy
                            </Text>
                            <FontAwesome6 name="chevron-right" size={14} color={isDark ? '#64748b' : '#94a3b8'} />
                        </Pressable> */}
                    </View>

                    <Text className={`text-center text-xs mt-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        © {currentYear} {t('about.rightsReserved')}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
