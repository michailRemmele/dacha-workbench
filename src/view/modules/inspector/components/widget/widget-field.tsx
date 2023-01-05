import React, { useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Field } from '../field'
import { useConfig } from '../../../../hooks'
import type { Field as FieldSchema, Reference } from '../../../../../types/widget-schema'

import { fieldTypes } from './field-types'
import { checkDependency } from './check-dependency'

interface WidgetFieldProps {
  field: FieldSchema
  path: Array<string>
  references?: Record<string, Reference | undefined>
}

export const WidgetField: FC<WidgetFieldProps> = ({ field, path, references }) => {
  const { t } = useTranslation()

  const dependencyPath = useMemo(
    () => (field.dependency ? path.concat(field.dependency.name.split('.')) : void 0),
    [path, field],
  )
  const fieldPath = useMemo(() => path.concat(field.name.split('.')), [path, field])

  const value = useConfig(dependencyPath)

  if (field.dependency && !checkDependency(value, field.dependency.value)) {
    return null
  }

  return (
    <Field
      path={fieldPath}
      label={t(field.title)}
      component={fieldTypes[field.type] ? fieldTypes[field.type] : fieldTypes.string}
      {...field.referenceId ? { reference: references?.[field.referenceId] } : {}}
    />
  )
}
