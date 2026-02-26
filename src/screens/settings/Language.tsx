import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../providers/ThemeProvider';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '../../i18n';

export default function LanguageScreen() {
    const { isDark } = useThemeContext();
    const { t } = useTranslation();
    const language = usePreferencesStore(state => state.language);
    const setLanguage = usePreferencesStore(state => state.setLanguage);

    const bgColor = isDark ? '#0f172a' : '#f8fafc';
    const cardBg = isDark ? '#1e293b' : '#ffffff';
    const textColor = isDark ? '#fff' : '#1e293b';
    const secondaryColor = isDark ? '#94a3b8' : '#64748b';

    function handleSelectLanguage(code: LanguageCode) {
        setLanguage(code);
    }

    return (
        <View className="flex-1 px-5 pt-4" style={{ backgroundColor: bgColor }}>
            <Text
                className="text-sm font-medium mb-4 px-1"
                style={{ color: secondaryColor }}
            >
                {t('language.selectLanguage')}
            </Text>

            <View className="gap-2.5">
                {SUPPORTED_LANGUAGES.map((lang, index) => {
                    const isSelected = language === lang.code;
                    return (
                        <Animated.View
                            key={lang.code}
                            entering={FadeInDown.delay(index * 60).springify()}
                        >
                            <Pressable
                                onPress={() => handleSelectLanguage(lang.code)}
                                className="flex-row items-center justify-between p-4 rounded-2xl shadow-sm"
                                style={{
                                    backgroundColor: cardBg,
                                    borderWidth: isSelected ? 2 : 0,
                                    borderColor: isSelected ? '#8b5cf6' : 'transparent',
                                }}
                            >
                                <View className="flex-row items-center gap-3.5">
                                    <View
                                        className="w-10 h-10 rounded-xl items-center justify-center"
                                        style={{
                                            backgroundColor: isSelected
                                                ? '#8b5cf620'
                                                : isDark ? '#334155' : '#f1f5f9',
                                        }}
                                    >
                                        <FontAwesome6
                                            name="language"
                                            size={16}
                                            color={isSelected ? '#8b5cf6' : secondaryColor}
                                        />
                                    </View>
                                    <View>
                                        <Text
                                            className="text-[15px] font-semibold"
                                            style={{ color: textColor }}
                                        >
                                            {lang.nativeLabel}
                                        </Text>
                                        <Text
                                            className="text-xs mt-0.5"
                                            style={{ color: secondaryColor }}
                                        >
                                            {lang.label}
                                        </Text>
                                    </View>
                                </View>

                                {isSelected && (
                                    <View className="flex-row items-center gap-2">
                                        <Text
                                            className="text-xs font-medium"
                                            style={{ color: '#8b5cf6' }}
                                        >
                                            {t('language.current')}
                                        </Text>
                                        <FontAwesome6
                                            name="circle-check"
                                            size={18}
                                            color="#8b5cf6"
                                            solid
                                        />
                                    </View>
                                )}
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </View>
        </View>
    );
}
