import type {
  SceneContext,
  GameObject,
} from 'remiz'

import type { Tool, ToolController } from '../engine/components'

export const TOOL_COMPONENT_NAME = 'tool'
export const TOOL_CONTROLLER_COMPONENT_NAME = 'toolController'

export const getTool = (sceneContext: SceneContext): Tool => {
  const mainObject = sceneContext.data.mainObject as GameObject

  const toolController = mainObject.getComponent(TOOL_CONTROLLER_COMPONENT_NAME) as ToolController
  const toolObject = mainObject.getChildById(toolController.activeTool) as GameObject

  return toolObject.getComponent(TOOL_COMPONENT_NAME) as Tool
}
