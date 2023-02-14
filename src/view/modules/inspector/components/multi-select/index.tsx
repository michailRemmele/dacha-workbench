import React, { useCallback, FC } from 'react'
import { Select as AntdSelect } from 'antd'

import { Labelled, LabelledProps } from '../labelled'
import type { MultiSelectProps } from '../../../../../types/inputs'

import './style.less'

export const MultiSelect: FC<MultiSelectProps> = ({
  options = [],
  onChange = (): void => void 0,
  onBlur = (): void => void 0,
  onAccept = (): void => void 0,
  defaultValue,
  onSelect,
  ...props
}) => {
  const handleChange = useCallback((values: Array<string>) => onChange(values), [onChange])

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    onAccept()
    onBlur(event)
  }, [onBlur, onAccept])

  return (
    <AntdSelect
      className="multi-select"
      size="small"
      mode="multiple"
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    >
      {options.map((option) => (
        <AntdSelect.Option key={option.value} value={option.value} disabled={option.disabled}>
          {option.title}
        </AntdSelect.Option>
      ))}
    </AntdSelect>
  )
}

export const LabelledMultiSelect: FC<MultiSelectProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <MultiSelect {...props} />
  </Labelled>
)
