import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';

export default function ContactUsContent({ isDark }: { isDark: boolean }) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await Clipboard.setStringAsync('powerfulseed1998@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <View className="p-4">
            <Text className="text-slate-500">{t('settings.help.officialEmail')}</Text>
            <View className="flex-row items-center mt-2">
                <Text className="text-blue-500" selectable>
                    powerfulseed1998@gmail.com
                </Text>
                <Pressable
                    className="ml-2 px-4 flex-row items-center gap-1"
                    onPress={handleCopy}
                >
                    <FontAwesome6
                        name={copied ? 'check' : 'copy'}
                        size={14}
                        color={copied ? '#10b981' : isDark ? '#64748b' : '#94a3b8'}
                    />
                    <Text
                        className={`${copied
                            ? 'text-emerald-500'
                            : isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                    >
                        {copied ? t('settings.help.copied') : t('settings.help.copy')}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
