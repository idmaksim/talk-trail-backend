import { I18nContext } from 'nestjs-i18n';

export const getCurrentLang = () => {
  return I18nContext.current().lang;
};
