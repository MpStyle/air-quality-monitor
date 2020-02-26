import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import backend from "i18next-xhr-backend";

i18n
    .use(backend)
    .use(detector)
    .init({
        debug: true,
        lng: "en",
        fallbackLng: "en", // use en if detected lng is not available

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        },

        // have a common namespace used around the full app
        ns: ["translations"],
        defaultNS: "translations"
    });

export default i18n;