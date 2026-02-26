import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { findBestLanguageTag } from 'react-native-localize';
import en from './locales/en';
import zh from './locales/zh';

// 支持的语言列表
export const SUPPORTED_LANGUAGES = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'zh', label: 'Chinese (Simplified)', nativeLabel: '简体中文' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

// 获取设备推荐语言
export function getDeviceLanguage(): LanguageCode {
    const best = findBestLanguageTag(
        SUPPORTED_LANGUAGES.map(l => l.code),
    );
    return (best?.languageTag?.split('-')[0] as LanguageCode) ?? 'en';
}

// 获取语言的显示名称（原生名称）
export function getLanguageNativeLabel(code: string): string {
    return (
        SUPPORTED_LANGUAGES.find(l => l.code === code)?.nativeLabel ?? code
    );
}

const resources = {
    en: { translation: en },
    zh: { translation: zh },
};

i18n.use(initReactI18next).init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React Native 不需要转义
    },
    compatibilityJSON: 'v4',
});

export default i18n;
