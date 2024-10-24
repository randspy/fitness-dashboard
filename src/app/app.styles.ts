import { definePreset } from 'primeng/themes';
import { Aura } from 'primeng/themes/aura';

const StylePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#202b50',
      100: '#1e284a',
      200: '#1c2544',
      300: '#19223f',
      400: '#18213c',
      500: '#171F39',
      600: '#151c33',
      700: '#12192e',
      800: '#101628',
      900: '#0e1322',
    },
  },
});

export const themeConfig = {
  preset: StylePreset,
  options: {
    cssLayer: {
      name: 'primeng',
      order: 'tailwind-base, primeng, tailwind-utilities',
    },
  },
};
