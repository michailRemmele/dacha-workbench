import { System, MouseControl } from 'dacha'
import type {
  Scene,
  SystemOptions,
  Actor,
  MouseControlConfig,
} from 'dacha'

import { EventType } from '../../../events'
import type { SelectToolEvent, SetToolFeatureValueEvent } from '../../../events'
import { CANVAS_ROOT } from '../../../consts/root-nodes'
import { Tool, ToolController } from '../../components'
import { persistentStorage } from '../../../persistent-storage'
import type { FeatureValue } from '../../components/tool'

const TOOL_CLASS_NAME_PREFIX = `${CANVAS_ROOT}_tool_`
const FEATURE_CLASS_NAME_PREFIX = `${CANVAS_ROOT}_feature-`

const getFeatureClassName = (
  name: string,
  value: FeatureValue,
): string => `${FEATURE_CLASS_NAME_PREFIX}${name}_${String(value)}`

export class ToolManager extends System {
  private scene: Scene
  private mainActor: Actor
  private rootNode: HTMLElement

  constructor(options: SystemOptions) {
    super()

    const { scene } = options

    this.scene = scene
    this.mainActor = this.scene.data.mainActor as Actor

    this.rootNode = document.getElementById(CANVAS_ROOT) as HTMLElement
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectTool, this.handleSelectTool)
    this.scene.addEventListener(EventType.SetToolFeatureValue, this.handleSetToolFeatureValue)

    const toolController = this.mainActor.getComponent(ToolController)
    this.selectTool(toolController.activeTool)
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectTool, this.handleSelectTool)
    this.scene.removeEventListener(EventType.SetToolFeatureValue, this.handleSetToolFeatureValue)
  }

  private selectTool(id: string): void {
    const toolController = this.mainActor.getComponent(ToolController)
    toolController.activeTool = id

    persistentStorage.set('canvas.mainActor.toolController.activeTool', id)

    const toolActor = this.mainActor.getEntityById(id)

    if (toolActor === undefined) {
      console.error(`Not found tool with same id: ${id}`)
      return
    }

    const { features, inputBindings } = toolActor.getComponent(Tool)

    const mouseControl = new MouseControl({
      inputEventBindings: inputBindings as MouseControlConfig['inputEventBindings'],
    })
    toolActor.setComponent(mouseControl)

    this.rootNode.classList.toggle(`${TOOL_CLASS_NAME_PREFIX}${id}`)

    Object.keys(features).forEach((key) => {
      const { value, withClassName } = features[key]
      if (withClassName) {
        this.rootNode.classList.toggle(getFeatureClassName(key, value))
      }
    })
  }

  private removeCurrentTool(): void {
    const toolController = this.mainActor.getComponent(ToolController)
    const toolActor = this.mainActor.getEntityById(toolController.activeTool)

    if (toolActor) {
      const { name, features } = toolActor.getComponent(Tool)

      toolActor.removeComponent(MouseControl)
      this.rootNode.classList.toggle(`${TOOL_CLASS_NAME_PREFIX}${name}`)

      Object.keys(features).forEach((key) => {
        const { value, withClassName } = features[key]
        if (withClassName) {
          this.rootNode.classList.toggle(getFeatureClassName(key, value))
        }
      })
    }
  }

  private setToolFeatureValue(name: string, value: FeatureValue): void {
    const { activeTool } = this.mainActor.getComponent(ToolController)
    const toolActor = this.mainActor.getEntityById(activeTool)

    if (toolActor) {
      const { features } = toolActor.getComponent(Tool)
      const feature = features[name]

      if (feature.withClassName) {
        this.rootNode.classList.toggle(getFeatureClassName(name, feature.value))
        this.rootNode.classList.toggle(getFeatureClassName(name, value))
      }

      feature.value = value

      persistentStorage.set(`canvas.mainActor.tools.${activeTool}.features.${name}`, value)
    }
  }

  private handleSelectTool = (event: SelectToolEvent): void => {
    const { name } = event

    this.removeCurrentTool()
    this.selectTool(name)
  }

  private handleSetToolFeatureValue = (event: SetToolFeatureValueEvent): void => {
    const { name, value } = event

    this.setToolFeatureValue(name, value)
  }
}

ToolManager.systemName = 'ToolManager'
