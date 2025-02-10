import {useLocale, useTranslations} from 'next-intl';
import LocaleSwitcherSelect from '@/components/locale-switcher-select';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: 'en',
          label: t('en')
        },
        {
          value: 'de',
          label: t('de')
        },
        {
          value: 'es',
          label: t('es')
        },
        {
          value: 'fr',
          label: t('fr')
        },
        {
          value: 'pt',
          label: t('pt')
        }
      ]}
      label={t('label')}
    />
  );
}