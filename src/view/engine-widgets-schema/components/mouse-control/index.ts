import type { WidgetSchema } from '../../../../types/widget-schema'

import { MouseControlWidget } from './view'

export const mouseControl: WidgetSchema = {
  title: 'components.mouseControl.title',
  view: MouseControlWidget,
}
