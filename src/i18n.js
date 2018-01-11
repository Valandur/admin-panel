import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

import en from "./locales/en"
import de from "./locales/de"
import fr from "./locales/fr"
import ru from "./locales/ru"

i18n
	.use(LanguageDetector)
	.use(reactI18nextModule)
	.init({
		fallbackLng: "en",

		// have a common namespace used around the full app
		ns: ["translations"],
		defaultNS: "translations",

		debug: process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development",

		interpolation: {
			escapeValue: false, // not needed for react!!
		},

		react: {
			wait: true
		},

		resources: {
			en: en,
			de: de,
			fr: fr,
			ru: ru,
		},
	});

export default i18n;
