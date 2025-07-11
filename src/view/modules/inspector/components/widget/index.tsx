import type { FC } from 'react'

import type { WidgetProps } from '../../../../../types/widget-schema'

import { WidgetField } from './widget-field'
import { WidgetFieldProvider } from './widget-field-context'

export const Widget: FC<WidgetProps> = ({ path, fields, context }) => (
  <div>
    {fields?.map((field) => (
      <WidgetFieldProvider key={field.name} path={path} data={context}>
        <WidgetField
          field={field}
          path={path}
        />
      </WidgetFieldProvider>
    ))}
  </div>
)
