import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import backend from "i18next-xhr-backend";

export const localizationSettings = (language: string) => {
    i18n
        .use(backend)
        .use(detector)
        .init({
            debug: false,
            lng: language,
            fallbackLng: language,

            keySeparator: false, // we do not use keys in form messages.welcome

            interpolation: {
                escapeValue: false // react already safes from xss
            },

            // have a common namespace used around the full app
            ns: ["translations"],
            defaultNS: "translations"
        });

    return i18n;
};