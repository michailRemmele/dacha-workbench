import type { TreeProps, DataNode } from 'antd/lib/tree'

export interface ExplorerDataNode extends DataNode {
  path: Array<string>
  parent?: ExplorerDataNode
}

export type ExpandFn = Required<TreeProps>['onExpand']
export type SelectFn<T extends DataNode = DataNode> = Required<TreeProps<T>>['onSelect']
