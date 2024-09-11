import { useTranslation } from 'react-i18next';

const useLanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return { changeLanguage, currentLanguage: i18n.language };
};

export default useLanguageSwitcher;
