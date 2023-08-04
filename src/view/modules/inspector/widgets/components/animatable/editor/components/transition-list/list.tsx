import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Tree } from 'antd'
import type { Animation } from 'remiz'

import { getKey } from '../../utils'
import { TreeCSS } from '../../editor.style'
import { useConfig } from '../../../../../../../../hooks'
import { AnimationEditorContext } from '../../providers'
import type { SelectFn } from '../../../../../../../../../types/tree-node'

import { parseTransitions } from './utils'
import type { TransitionDataNode } from './utils'

export const List: FC = () => {
  const { t } = useTranslation()
  const {
    path,
    selectedState,
    selectedTransition,
    selectTransition,
  } = useContext(AnimationEditorContext)

  const statesPath = useMemo(() => path.concat('states'), [path])
  const statePath = selectedState as Array<string>
  const transitionsPath = useMemo(() => statePath.concat('transitions'), [statePath])

  const statesConfigs = useConfig(statesPath) as Array<Animation.StateConfig>
  const stateConfig = useConfig(statePath) as Animation.StateConfig
  const transitions = useConfig(transitionsPath) as Array<Animation.TransitionConfig>

  const statesNames = useMemo(() => statesConfigs.reduce((acc, item) => {
    acc[item.id] = item.name
    return acc
  }, {} as Record<string, string>), [statesConfigs])

  const treeData = useMemo(
    () => parseTransitions(
      transitions,
      statePath,
      stateConfig.name,
      statesNames,
      t('components.animatable.editor.transition.unknown.state.title'),
    ),
    [transitions, statePath, stateConfig, statesNames],
  )

  const handleSelect = useCallback<SelectFn<TransitionDataNode>>((keys, { node }) => {
    selectTransition(node.path)
  }, [])

  const selectedKey = getKey(selectedTransition)

  return (
    <Tree.DirectoryTree
      css={TreeCSS}
      selectedKeys={selectedKey ? [selectedKey] : []}
      onSelect={handleSelect}
      treeData={treeData}
      showIcon={false}
    />
  )
}
