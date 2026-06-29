import { h, defineComponent } from 'vue'
import type { IconSet } from 'vuetify'
import { mdiIconMap } from './mdi-icons'

// Mirrors Vuetify's VSvgIcon: renders props.tag as wrapper (receives size/class attrs),
// with the actual SVG inside using class="v-icon__svg" (sized to 1em via Vuetify CSS).
const SvgIcon = defineComponent({
  name: 'SvgIcon',
  inheritAttrs: false,
  props: {
    tag: { type: String, required: true },
    icon: { type: [String, Object], required: true },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    return () => {
      const icon = String(props.icon)
      const path = mdiIconMap[icon] ?? icon

      return h(props.tag, { ...attrs, style: null }, [
        h('svg', {
          class: 'v-icon__svg',
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          role: 'img',
          'aria-hidden': 'true',
        }, [h('path', { d: path, fill: 'currentColor' })])
      ])
    }
  },
})

export const mdiSvgSet: IconSet = {
  component: SvgIcon,
}
