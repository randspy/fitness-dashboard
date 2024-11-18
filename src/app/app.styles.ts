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
      500: '#101d41',
      600: '#12192e',
      700: '#0e1322',
      800: '#090c17',
      900: '#05060b',
    },
    orange: {
      50: '#fdf6f2',
      100: '#fbe7da',
      200: '#f9d2b8',
      300: '#f2b58c',
      400: '#f99552',
      500: '#f98c43',
      600: '#c77036',
      700: '#955428',
      800: '#64381b',
      900: '#321c0d',
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
