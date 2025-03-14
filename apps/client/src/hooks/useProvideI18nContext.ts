import React from "react"
import { useTranslation } from "react-i18next";

export const useProvideI18nContext = () => {
    const { i18n: { resolvedLanguage, changeLanguage }, t } = useTranslation();
    const [lang] = React.useState(resolvedLanguage);

    const setLang = React.useCallback((lang?: string) => {
        changeLanguage(lang)
        document.title = t("appTitle.normal");
    }, []);

    React.useEffect(() => {
        setLang(resolvedLanguage)
    }, [resolvedLanguage, setLang])

    return {
        lang,
        setLang,
    }
}