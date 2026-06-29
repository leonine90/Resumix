import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { mdiSvgSet } from '~/utils/mdi-svg-set'
import { vuetifyAliases } from '~/utils/mdi-icons'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases: vuetifyAliases,
      sets: { mdi: mdiSvgSet },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            // MD3 primary — professional blue
            primary: '#1565C0',
            'primary-darken-1': '#0D47A1',
            'on-primary': '#FFFFFF',
            'primary-container': '#E3F2FD',
            'on-primary-container': '#001D36',

            // Secondary — AI purple
            secondary: '#673AB7',
            'secondary-darken-1': '#512DA8',
            'on-secondary': '#FFFFFF',
            'secondary-container': '#EDE7F6',
            'on-secondary-container': '#1A0048',

            // Error / destructive
            error: '#C62828',
            'error-darken-1': '#B71C1C',
            'on-error': '#FFFFFF',
            'error-container': '#FFEBEE',
            'on-error-container': '#410002',

            // Surfaces
            surface: '#FFFFFF',
            'on-surface': '#1C1B1F',
            'surface-variant': '#F5F7FA',
            'on-surface-variant': '#49454F',

            // Outline / borders
            outline: '#CAC4D0',
            'outline-variant': '#E7E0EC',

            background: '#FAFAFA',
            'on-background': '#1C1B1F',
          },
          variables: {
            // Spacing scale (4px base)
            'spacing-1': '4px',
            'spacing-2': '8px',
            'spacing-3': '12px',
            'spacing-4': '16px',
            'spacing-5': '20px',
            'spacing-6': '24px',
            'spacing-8': '32px',
            'spacing-12': '48px',
            'spacing-16': '64px',

            // Border radius
            'border-radius-xs': '4px',
            'border-radius-sm': '8px',
            'border-radius-md': '12px',
            'border-radius-lg': '16px',

            // Elevation shadows
            'shadow-1': '0 1px 3px rgba(0,0,0,0.12)',
            'shadow-2': '0 4px 12px rgba(0,0,0,0.12)',
            'shadow-3': '0 8px 24px rgba(0,0,0,0.16)',

            // Typography
            'font-family-base': "'Helvetica Neue', Arial, sans-serif",
            'font-size-root': '16px',
          },
        },
      },
    },
    defaults: {
      VBtn: {
        variant: 'tonal',
        rounded: 'lg',
        style: 'text-transform: none; letter-spacing: 0.01em;',
      },
      VCard: {
        rounded: 'md',
      },
      VDialog: {
        maxWidth: '560px',
        scrollable: true,
      },
      VTextField: {
        variant: 'outlined',
        density: 'comfortable',
      },
      VTextarea: {
        variant: 'outlined',
        density: 'comfortable',
      },
      VSnackbar: {
        timeout: 3000,
        location: 'bottom right',
        rounded: 'sm',
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
