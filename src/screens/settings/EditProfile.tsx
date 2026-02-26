import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Pressable,
    TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'react-native-image-picker';

import { useThemeContext } from '../../providers/ThemeProvider';
import { useLocalProfileStore } from '../../store/useLocalProfileStore';

function renderInputField(
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    isDark: boolean,
    icon: string
) {
    return (
        <View className="mb-4">
            <Text
                className={`text-sm font-medium mb-2 ml-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
            >
                {label}
            </Text>
            <View
                className={`flex-row items-center p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            >
                <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }}
                >
                    <FontAwesome6
                        name={icon as 'user'}
                        size={16}
                        color={isDark ? '#64748b' : '#475569'}
                    />
                </View>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                    className={`flex-1 text-base ${isDark ? 'text-white' : 'text-slate-900'}`}
                />
            </View>
        </View>
    );
}

export default function EditProfileScreen() {
    const { isDark } = useThemeContext();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const displayName = useLocalProfileStore((state) => state.displayName);
    const avatarUri = useLocalProfileStore((state) => state.avatarUri);
    const setDisplayName = useLocalProfileStore((state) => state.setDisplayName);
    const setAvatarUri = useLocalProfileStore((state) => state.setAvatarUri);

    const [formData, setFormData] = useState({
        name: displayName || t('profile.localUser'),
    });

    function handleChangePhoto() {
        ImagePicker.launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.8,
                includeBase64: false,
            },
            (response) => {
                if (!response.didCancel && response.assets?.[0]?.uri) {
                    setAvatarUri(response.assets[0].uri);
                }
            }
        );
    }

    function handleSave() {
        setDisplayName(formData.name.trim() || t('profile.localUser'));
    }

    return (
        <View
            className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}
        >
            <ScrollView
                className="flex-1 px-5"
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="my-6">
                    <Text
                        className={`text-sm font-bold uppercase mb-3 ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                    >
                        {t('settings.editProfile.profilePicture')}
                    </Text>
                    <Pressable
                        onPress={handleChangePhoto}
                        className={`p-6 rounded-xl items-center ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                    >
                        <View className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 items-center justify-center mb-3 overflow-hidden">
                            {avatarUri ? (
                                <Image
                                    source={{ uri: avatarUri }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <FontAwesome6
                                    name="user"
                                    size={32}
                                    color="#64748b"
                                />
                            )}
                        </View>
                        <Text
                            className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                        >
                            {t('settings.editProfile.changePhoto')}
                        </Text>
                    </Pressable>
                </View>

                <View className="mb-6">
                    <Text
                        className={`text-sm font-bold uppercase mb-3 ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                    >
                        {t('settings.editProfile.personalInfo')}
                    </Text>

                    {renderInputField(
                        t('settings.editProfile.fullName'),
                        formData.name,
                        (text) =>
                            setFormData((prev) => ({ ...prev, name: text })),
                        t('settings.editProfile.fullNamePlaceholder'),
                        isDark,
                        'user'
                    )}
                </View>

                <Pressable
                    onPress={handleSave}
                    className="bg-purple-600 p-4 rounded-xl items-center mb-4"
                    style={{
                        shadowColor: '#8b5cf6',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                    }}
                >
                    <Text className="text-white text-base font-semibold">
                        {t('settings.editProfile.saveChanges')}
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}
