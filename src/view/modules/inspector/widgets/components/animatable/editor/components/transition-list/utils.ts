import type { Animation } from 'remiz'
import type { DataNode } from 'antd/lib/tree'

export interface TransitionDataNode extends DataNode {
  path: Array<string>
}

export const parseTransitions = (
  transitions: Array<Animation.TransitionConfig>,
  path: Array<string>,
  stateName: string,
  statesNames: Record<string, string>,
  defaultName: string,
): Array<TransitionDataNode> => transitions.map((transition) => ({
  key: transition.id,
  title: `${stateName} -> ${statesNames[transition.state] ?? defaultName}`,
  isLeaf: true,
  path: path.concat('transitions', `id:${transition.id}`),
}))
