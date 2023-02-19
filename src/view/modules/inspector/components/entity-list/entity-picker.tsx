import React, {
  useCallback,
  useState,
  useMemo,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { SelectedEntityContext } from '../../../../providers'
import { useCommander } from '../../../../hooks'
import { addValue } from '../../../../commands'
import type { SchemasDataEntry } from '../../../../providers'
import type { WidgetSchema } from '../../../../../types/widget-schema'

import { CONFIG_KEY_MAP } from './consts'
import type { EntityType } from './types'

interface EntityPickerProps {
  entities: Array<SchemasDataEntry>
  addedEntities: Set<string>
  placeholder: string
  type: EntityType
}

export const EntityPicker: FC<EntityPickerProps> = ({
  entities,
  addedEntities,
  placeholder,
  type,
}): JSX.Element => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const { path = [] } = useContext(SelectedEntityContext)

  const rootPath = useMemo(() => path.concat(type), [path, type])

  const options = useMemo(() => entities
    .filter((entity) => !addedEntities.has(entity.name))
    .map((entity) => ({
      label: t(entity.schema.title, { ns: entity.namespace }),
      value: entity.name,
    })), [entities, addedEntities])
  const schemasMap = useMemo(() => entities.reduce((acc, entity) => {
    acc[entity.name] = entity.schema
    return acc
  }, {} as Record<string, WidgetSchema>), [entities])

  const [value, setValue] = useState<string>()

  const handleChange = useCallback((selectedValue: string) => {
    setValue(selectedValue)
  }, [])

  const handleAdd = useCallback(() => {
    if (!value) {
      return
    }

    dispatch(addValue(rootPath, {
      name: value,
      [CONFIG_KEY_MAP[type]]: schemasMap[value].getInitialState?.() ?? {},
    }))

    setValue(undefined)
  }, [value, schemasMap, rootPath, type])

  return (
    <div className="entity-picker">
      <Select
        className="entity-picker__select"
        options={options}
        onChange={handleChange}
        value={value}
        placeholder={placeholder}
        showSearch
      />
      <Button
        className="entity-picker__button"
        icon={<PlusOutlined />}
        onClick={handleAdd}
      />
    </div>
  )
}
