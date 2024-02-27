import {
  Transform,
  Sprite,
} from 'remiz'
import type {
  ActorConfig,
  TemplateConfig,
  LevelConfig,
  Scene,
  ComponentConfig,
} from 'remiz'
import { v4 as uuidv4 } from 'uuid'

import {
  getGridValue,
  getGridStep,
} from '../../../utils/grid'
import { getTool } from '../../../utils/get-tool'
import type { Store } from '../../../store'

import { TOOL_NAME } from './consts'
import type { Position } from './types'

const buildActor = (template: TemplateConfig, index?: number): ActorConfig => ({
  id: uuidv4(),
  templateId: template.id,
  fromTemplate: true,
  name: index ? `${template.name} ${index}` : template.name,
  components: [],
  children: (template.children ?? []).map((child) => buildActor(child)),
})

export const createFromTemplate = (
  template: TemplateConfig,
  level: LevelConfig,
  x: number,
  y: number,
): ActorConfig => {
  const templateCopy = structuredClone(template)

  const { actors } = level
  const sameTemplateObjects = actors
    .filter((actor) => actor.templateId === template.id)

  const actor = buildActor(templateCopy, sameTemplateObjects.length)

  const transform = templateCopy.components
    ?.find((component) => component.name === Transform.componentName)

  if (transform !== undefined) {
    transform.config.offsetX = x
    transform.config.offsetY = y

    actor.components?.push(transform)
  }

  return actor
}

const getSizeX = (transform: ComponentConfig, sprite?: ComponentConfig): number => {
  const scaleX = (transform.config.scaleX as number | undefined) || 1
  const width = (sprite?.config.width as number | undefined) || 0

  return scaleX * width
}
const getSizeY = (transform: ComponentConfig, sprite?: ComponentConfig): number => {
  const scaleY = (transform.config.scaleY as number | undefined) || 1
  const height = (sprite?.config.height as number | undefined) || 0

  return scaleY * height
}

export const updatePlacementPosition = (
  cursor: Position,
  placementPosition: Position,
  store: Store,
  scene: Scene,
): void => {
  if (cursor.x === null || cursor.y === null) {
    // eslint-disable-next-line no-param-reassign
    placementPosition.x = null
    // eslint-disable-next-line no-param-reassign
    placementPosition.y = null
    return
  }

  const tool = getTool(scene)
  const gridStep = getGridStep(scene)

  if (tool.name !== TOOL_NAME) {
    return
  }

  const templateId = tool.features.templateId.value as string | undefined
  const snapToGrid = tool.features.grid.value as boolean
  if (templateId === undefined) {
    return
  }

  if (!snapToGrid) {
    // eslint-disable-next-line no-param-reassign
    placementPosition.x = Math.round(cursor.x)
    // eslint-disable-next-line no-param-reassign
    placementPosition.y = Math.round(cursor.y)
    return
  }

  const template = store.get(['templates', `id:${templateId}`]) as TemplateConfig

  const transform = template.components
    ?.find((component) => component.name === Transform.componentName)
  const sprite = template.components
    ?.find((component) => component.name === Sprite.componentName)

  if (transform !== undefined) {
    // eslint-disable-next-line no-param-reassign
    placementPosition.x = getGridValue(cursor.x, getSizeX(transform, sprite), gridStep)
    // eslint-disable-next-line no-param-reassign
    placementPosition.y = getGridValue(cursor.y, getSizeY(transform, sprite), gridStep)
  }
}
