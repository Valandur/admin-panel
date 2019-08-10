import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const de = require('../locale/de.json');
const en = require('../locale/en.json');
const fr = require('../locale/fr.json');
const ru = require('../locale/ru.json');

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'en',

		// have a common namespace used around the full app
		ns: ['translations'],
		defaultNS: 'translations',

		debug: process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development',

		interpolation: {
			escapeValue: false // not needed for react!!
		},

		react: {
			wait: true
		},

		resources: {
			en: en,
			de: de,
			fr: fr,
			ru: ru
		}
	});

export default i18n;
