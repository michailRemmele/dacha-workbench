import type { WidgetSchema } from '../../../../types/widget-schema'

export const animatable: WidgetSchema = {
  title: 'components.animatable.title',
  getInitial: () => ({
    initialState: '',
    states: [],
  }),
}
