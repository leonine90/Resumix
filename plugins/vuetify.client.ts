import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#007bff',
            secondary: '#28a745',
            error: '#dc3545',
            surface: '#ffffff',
            'surface-variant': '#f8f9fa',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
}) 