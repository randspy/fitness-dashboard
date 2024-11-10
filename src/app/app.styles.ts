import { definePreset } from 'primeng/themes';
import { Aura } from 'primeng/themes/aura';

const StylePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f5f6fa',
      100: '#e3e7f2',
      200: '#cad1e7',
      300: '#a6b2d9',
      400: '#8092cc',
      500: '#171F39',
      600: '#12192e',
      700: '#0e1322',
      800: '#090c17',
      900: '#05060b',
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
