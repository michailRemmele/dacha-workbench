import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'

import { LabelledSelect } from '../../../components/select'
import { LabelledTextInput } from '../../../components/text-input'
import { LabelledNumberInput } from '../../../components/number-input'
import { MultiField } from '../../../components/multi-field'
import { Field } from '../../../components/field'
import { DependencyField } from '../../../components/dependency-field'
import { Panel } from '../../../components/panel'
import { useCommander, useExtension } from '../../../../../hooks'
import { deleteValue } from '../../../../../commands'

import {
  PanelCSS,
  SectionHeaderStyled,
} from './mouse-control.style'

export interface InputBindProps {
  path: Array<string>
  value: string
  order: number
  options: Array<{ title: string, value: string }>
  selectedOptions: Array<string>
}

export const InputBind: FC<InputBindProps> = ({
  path,
  value,
  order,
  options,
  selectedOptions,
}) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const { globalReferences } = useExtension()

  const bindPath = useMemo(() => path.concat('inputEventBindings', `event:${value}`), [path, value])
  const eventPath = useMemo(() => bindPath.concat('event'), [bindPath])
  const buttonPath = useMemo(() => bindPath.concat('button'), [bindPath])
  const eventTypePath = useMemo(() => bindPath.concat('eventType'), [bindPath])
  const attrsPath = useMemo(() => bindPath.concat('attrs'), [bindPath])

  const controlEvents = globalReferences.controlEvents?.items

  const inputEvents = useMemo(
    () => options.filter(
      (option) => !selectedOptions.includes(option.value) || option.value === value,
    ),
    [value, options, selectedOptions],
  )

  const handleDeleteBind = useCallback(() => {
    dispatch(deleteValue(bindPath))
  }, [dispatch, bindPath])

  return (
    <Panel
      css={PanelCSS}
      title={t('components.mouseControl.bind.title', { index: order + 1 })}
      onDelete={handleDeleteBind}
    >
      <Field
        path={eventPath}
        component={LabelledSelect}
        label={t('components.mouseControl.bind.event.title')}
        options={inputEvents}
      />
      <DependencyField
        path={buttonPath}
        component={LabelledNumberInput}
        label={t('components.mouseControl.bind.button.title')}
        dependencyPath={eventPath}
        dependencyValue="mousedown|mouseup"
      />
      <Field
        path={eventTypePath}
        component={controlEvents ? LabelledSelect : LabelledTextInput}
        label={t('components.mouseControl.bind.eventType.title')}
        options={controlEvents}
      />
      <SectionHeaderStyled>
        {t('components.mouseControl.bind.attributes.title')}
      </SectionHeaderStyled>
      <MultiField
        path={attrsPath}
      />
    </Panel>
  )
}
