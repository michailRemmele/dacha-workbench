import type { Config, GlobalOption, TemplateConfig } from 'remiz'

import { SHAPE_CANVAS_ROOT } from '../consts/root-nodes'
import {
  HAND_TOOL,
  POINTER_TOOL,
  ZOOM_TOOL,
  TEMPLATE_TOOL,
} from '../consts/tools'
import { EventType } from '../events'
import { persistentStorage } from '../persistent-storage'
import type { CommanderStore } from '../store'

interface EditorConfigOptions {
  globalOptions: Array<GlobalOption>
  store: CommanderStore
}

const getTemplateId = (store: CommanderStore): string | undefined => {
  const templateId = persistentStorage.get<string | undefined>('canvas.mainActor.tools.template.features.templateId')
  if (!templateId) {
    return undefined
  }
  return store.get(['templates', `id:${templateId}`])
    ? templateId
    : (store.get(['templates']) as TemplateConfig[])[0]?.id
}

export const getEditorConfig = ({
  globalOptions,
  store,
}: EditorConfigOptions): Config => ({
  scenes: [
    {
      id: '0481caa3-c28c-40cc-a1f8-0f2496f1c403',
      name: 'editor',
      levelId: 'cd42a993-f3c0-4921-b867-108c81028a26',
      systems: [
        {
          name: 'CameraSystem',
          options: {
            windowNodeId: 'canvas-root',
          },
        },
        {
          name: 'MouseInputSystem',
          options: {
            windowNodeId: 'canvas-root',
            useWindow: false,
          },
        },
        {
          name: 'MouseControlSystem',
          options: {},
        },
        {
          name: 'ProjectLoader',
          options: {},
        },
        {
          name: 'LevelViewer',
          options: {
            mainActorId: 'main-actor',
          },
        },
        {
          name: 'SettingsSystem',
          options: {},
        },
        {
          name: 'ToolManager',
          options: {},
        },
        {
          name: 'ZoomToolSystem',
          options: {},
        },
        {
          name: 'HandToolSystem',
          options: {},
        },
        {
          name: 'PointerToolSystem',
          options: {},
        },
        {
          name: 'TemplateToolSystem',
          options: {},
        },
        {
          name: 'UiBridge',
          options: {
            filterComponents: [],
          },
        },
        {
          name: 'SpriteRenderer',
          options: {
            windowNodeId: 'canvas-root',
            backgroundColor: '#ffffff',
            backgroundAlpha: 0,
          },
        },
        {
          name: 'ShapesRenderer',
          options: {
            windowNodeId: SHAPE_CANVAS_ROOT,
          },
        },
        {
          name: 'GridSystem',
          options: {},
        },
      ],
    },
  ],
  levels: [
    {
      id: 'cd42a993-f3c0-4921-b867-108c81028a26',
      name: 'level-viewer',
      actors: [
        {
          id: 'main-actor',
          name: 'mainCamera',
          children: [
            {
              id: HAND_TOOL,
              name: HAND_TOOL,
              children: [],
              components: [
                {
                  name: 'Tool',
                  config: {
                    name: 'hand',
                    features: {},
                    inputBindings: [
                      {
                        id: '0ea69440-f648-4774-b62e-c2e5b95d04ca',
                        event: 'mousedown',
                        button: 0,
                        eventType: EventType.CameraMoveStart,
                        attrs: [],
                      },
                      {
                        id: '2769eec3-aa64-4b71-a0cc-d81e7c8d686c',
                        event: 'mouseup',
                        button: 0,
                        eventType: EventType.CameraMoveEnd,
                        attrs: [],
                      },
                      {
                        id: '2a9351cd-2257-4c4d-a84e-3e8020ad14a3',
                        event: 'mousemove',
                        eventType: EventType.CameraMove,
                        attrs: [],
                      },
                      {
                        id: '4a5da295-9621-41d4-8b88-77d3d8a0316e',
                        event: 'mouseleave',
                        eventType: EventType.CameraMoveEnd,
                        attrs: [],
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: ZOOM_TOOL,
              name: ZOOM_TOOL,
              children: [],
              components: [
                {
                  name: 'Tool',
                  config: {
                    name: 'zoom',
                    features: {
                      direction: {
                        value: persistentStorage.get('canvas.mainActor.tools.zoom.features.direction', 'in'),
                        withClassName: true,
                      },
                    },
                    inputBindings: [
                      {
                        id: 'f908d5e8-448b-420f-a417-9e2f17b20d0c',
                        event: 'mousedown',
                        button: 0,
                        eventType: EventType.CameraZoom,
                        attrs: [],
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: POINTER_TOOL,
              name: POINTER_TOOL,
              children: [],
              components: [
                {
                  name: 'Tool',
                  config: {
                    name: 'pointer',
                    features: {
                      grid: {
                        value: persistentStorage.get('canvas.mainActor.tools.pointer.features.grid', false),
                        withClassName: false,
                      },
                    },
                    inputBindings: [
                      {
                        id: '2180969a-b549-47de-ab14-1677378112bf',
                        event: 'mousedown',
                        button: 0,
                        eventType: EventType.SelectionMoveStart,
                        attrs: [],
                      },
                      {
                        id: '3ef9cf69-240e-4b1a-823a-4b58fd34d80f',
                        event: 'mousemove',
                        eventType: EventType.SelectionMove,
                        attrs: [],
                      },
                      {
                        id: '99b59ce8-e433-4749-bcea-8a0d5d1d7605',
                        event: 'mouseup',
                        button: 0,
                        eventType: EventType.SelectionMoveEnd,
                        attrs: [],
                      },
                      {
                        id: '762e02df-24c5-4921-9d6c-5bea83a982cc',
                        event: 'mouseleave',
                        eventType: EventType.SelectionMoveEnd,
                        attrs: [],
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: TEMPLATE_TOOL,
              name: TEMPLATE_TOOL,
              children: [],
              components: [
                {
                  name: 'Tool',
                  config: {
                    name: 'template',
                    features: {
                      preview: {
                        value: persistentStorage.get('canvas.mainActor.tools.template.features.preview', true),
                        withClassName: false,
                      },
                      grid: {
                        value: persistentStorage.get('canvas.mainActor.tools.template.features.grid', false),
                        withClassName: false,
                      },
                      templateId: {
                        value: getTemplateId(store),
                        withClassName: false,
                      },
                    },
                    inputBindings: [
                      {
                        id: '2789da3d-7adf-4f63-9af3-513c75650066',
                        event: 'click',
                        eventType: EventType.AddFromTemplate,
                        attrs: [],
                      },
                    ],
                  },
                },
              ],
            },
          ],
          components: [
            {
              name: 'Transform',
              config: {
                offsetX: persistentStorage.get('canvas.mainActor.transform.offsetX', 0),
                offsetY: persistentStorage.get('canvas.mainActor.transform.offsetY', 0),
                offsetZ: 1,
                rotation: 0,
              },
            },
            {
              name: 'Camera',
              config: {
                zoom: persistentStorage.get('canvas.mainActor.camera.zoom', 1),
                current: true,
              },
            },
            {
              name: 'MouseControl',
              config: {
                inputEventBindings: [
                  {
                    id: 'cd331a89-e99f-4d70-a8bc-8c794632e9a1',
                    event: 'mousemove',
                    eventType: EventType.ToolCursorMove,
                    attrs: [],
                  },
                  {
                    id: '6abde95f-5b2b-4066-9ef3-7af0559e155a',
                    event: 'mouseleave',
                    eventType: EventType.ToolCursorLeave,
                    attrs: [],
                  },
                ],
              },
            },
            {
              name: 'ToolController',
              config: {
                activeTool: persistentStorage.get('canvas.mainActor.toolController.activeTool', HAND_TOOL),
              },
            },
            {
              name: 'Settings',
              config: {
                showGrid: persistentStorage.get('canvas.mainActor.settings.showGrid', false),
                gridStep: persistentStorage.get('canvas.mainActor.settings.gridStep', 16),
                gridColor: persistentStorage.get('canvas.mainActor.settings.gridColor', '#1890FF'),
              },
            },
          ],
        },
      ],
    },
  ],
  templates: [
    {
      id: 'frame',
      name: 'frame',
      children: [],
      components: [
        {
          name: 'Transform',
          config: {
            offsetX: 0,
            offsetY: 0,
            offsetZ: 0,
            rotation: 0,
          },
        },
        {
          name: 'Shape',
          config: {
            type: 'rectangle',
            properties: {
              width: 0,
              height: 0,
              color: 'rgba(0, 0, 0, 0)',
              strokeWidth: 2,
              strokeColor: '#fff',
            },
          },
        },
      ],
    },
  ],
  loaders: [],
  globalOptions: [
    ...globalOptions,
  ],
  startSceneId: '0481caa3-c28c-40cc-a1f8-0f2496f1c403',
  startLoaderId: null,
})
