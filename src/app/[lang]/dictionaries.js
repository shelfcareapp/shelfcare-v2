'use server-only';

const dictionaries = {
  en: () =>
    import('../../../public/dictionaries/en.json').then(
      (module) => module.default
    ),
  fi: () =>
    import('../../../public/dictionaries/fi.json').then(
      (module) => module.default
    )
};

export const getDictionary = async (locale) => dictionaries[locale]();
