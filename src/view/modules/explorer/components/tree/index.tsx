import {
  useContext,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  FC,
} from 'react'
import type { ReactNode } from 'react'
import { Tree as AntdTree } from 'antd'

import { ListWrapper } from '../list-wrapper'
import { EngineContext } from '../../../../providers'
import { useTreeKeys } from '../../../../hooks'
import type {
  ExplorerDataNode,
  ExpandFn,
  SelectFn,
  DropFn,
} from '../../../../../types/tree-node'
import { EventType } from '../../../../../events'
import { isScrolledIntoView } from '../../utils/is-scrolled-into-view'
import { getIdByPath } from '../../../../../utils/get-id-by-path'
import { filterNestedPaths } from '../../../../../utils/filter-nested-paths'
import { arraysEqual } from '../../../../../utils/arrays-equal'

import { useTreeData } from './hooks/use-tree-data'
import { TreeCSS } from './tree.style'

interface TreeNodeTitleProps extends ExplorerDataNode {
  selected: boolean
  getContainer: () => HTMLDivElement
}

interface TreeProps {
  className?: string
  treeData: ExplorerDataNode[]
  selectedPaths?: string[][]
  inspectedKey?: string
  persistentStorageKey: string
  draggable?: boolean
  onDrop?: (sourcePaths: string[][], destinationPath: string[]) => void
  childrenFieldMap?: Record<string, string | undefined>
}

export const TreeNodeTitle: FC<TreeNodeTitleProps> = ({
  title,
  selected,
  getContainer,
}) => {
  const nodeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!nodeRef.current) {
      return
    }

    if (selected && !isScrolledIntoView(nodeRef.current, getContainer())) {
      nodeRef.current.scrollIntoView({ block: 'center' })
    }
  }, [selected])

  return <span ref={nodeRef}>{title as string}</span>
}

export const Tree: FC<TreeProps> = ({
  className,
  treeData,
  inspectedKey,
  selectedPaths,
  persistentStorageKey,
  draggable,
  onDrop,
  childrenFieldMap,
}) => {
  const { scene } = useContext(EngineContext)

  const containerRef = useRef<HTMLDivElement>(null)

  const { expandedKeys, setExpandedKeys } = useTreeKeys(treeData, inspectedKey, `${persistentStorageKey}.expandedKeys`)
  const { treeData: parsedTreeData } = useTreeData(treeData)

  const selectedKeys = useMemo(() => selectedPaths?.map(getIdByPath), [selectedPaths])

  const handleExpand = useCallback<ExpandFn>((keys) => {
    setExpandedKeys(keys as Array<string>)
  }, [])

  const handleSelect = useCallback<SelectFn<ExplorerDataNode>>((keys, info) => {
    const { selectedNodes, node } = info

    scene.dispatchEvent(EventType.SelectEntities, {
      paths: selectedNodes.map((selectedNode) => selectedNode.path.slice(0)),
    })
    scene.dispatchEvent(EventType.InspectEntity, {
      path: selectedNodes.length ? node.path.slice(0) : undefined,
    })
  }, [scene])

  const handleDrop = useCallback<DropFn<ExplorerDataNode>>((info) => {
    if (!onDrop || !childrenFieldMap) {
      return
    }
    const { node, dragNode } = info

    const isWithinSelection = selectedPaths?.some((path) => getIdByPath(path) === dragNode.key)
    const paths = isWithinSelection ? selectedPaths as string[][] : [dragNode.path]

    const sourcePaths = filterNestedPaths(paths)
    const childrenField = childrenFieldMap[node.path.at(-2) as string]
    if (!childrenField) {
      return
    }
    const destinationPath = node.path.concat(childrenField)

    if (sourcePaths.some((path) => arraysEqual(path.slice(0, -1), destinationPath))) {
      return
    }

    onDrop(sourcePaths, destinationPath)
  }, [selectedPaths, onDrop, childrenFieldMap])

  const getContainer = useCallback(() => containerRef.current as HTMLDivElement, [])

  return (
    <ListWrapper ref={containerRef}>
      <AntdTree.DirectoryTree
        css={TreeCSS}
        className={className}
        expandedKeys={expandedKeys}
        selectedKeys={selectedKeys}
        onSelect={handleSelect}
        onExpand={handleExpand}
        onDrop={handleDrop}
        treeData={parsedTreeData}
        expandAction="doubleClick"
        draggable={draggable ? { icon: false } : undefined}
        multiple
        titleRender={(nodeData): ReactNode => (
          <TreeNodeTitle
            {...nodeData}
            selected={selectedKeys?.includes(String(nodeData.key)) ?? false}
            getContainer={getContainer}
          />
        )}
      />
    </ListWrapper>
  )
}
