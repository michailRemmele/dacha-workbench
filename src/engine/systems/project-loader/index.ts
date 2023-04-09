import type {
  Config,
  System,
  SystemOptions,
  SceneContext,
} from 'remiz'

import { Store } from '../../../store'
import type { Data } from '../../../store'
import type { EditorConfig, Extension } from '../../../types/global'

export class ProjectLoader implements System {
  private sceneContext: SceneContext
  private editorCofig: EditorConfig

  constructor(options: SystemOptions) {
    this.sceneContext = options.sceneContext
    this.editorCofig = window.electron.getEditorConfig()

    const projectConfig = window.electron.getProjectConfig()
    this.sceneContext.data.configStore = new Store(projectConfig as unknown as Data)
    this.sceneContext.data.editorConfig = this.editorCofig
  }

  private setUpData(extension: Extension = {}): void {
    const {
      components = {},
      systems = {},
      scripts = {},
      componentsSchema = {},
      systemsSchema = {},
      scriptsSchema = {},
      locales = {},
    } = extension

    this.sceneContext.data.extension = {
      components,
      systems,
      componentsSchema,
      systemsSchema,
      scriptsSchema,
      locales,
      scripts,
    }
  }

  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      const extension = window.electron.getExtension()

      if (!extension) {
        this.setUpData()

        resolve()
        return
      }

      const blob = new Blob([extension], {
        type: 'application/javascript',
      })
      const url = URL.createObjectURL(blob)

      const script = document.createElement('script')
      script.src = url

      script.onload = (): void => {
        this.setUpData(window.editorExtension)

        resolve()
      }
      script.onerror = (): void => {
        reject(new Error(`Error while loading extension script: ${url}`))
      }

      document.body.appendChild(script)
    })
  }

  mount(): void {
    window.electron.onSave(() => {
      const projectConfig = (this.sceneContext.data.configStore as Store).get([]) as Config
      window.electron.saveProjectConfig(projectConfig)
    })
  }

  update(): void {}
}
