import type { TemplateConfig } from 'remiz'

import { omit } from '../utils'

import type { WatcherFn } from './types'

const TEMPLATES_PATH_LENGTH = 1
const TEMPLATE_PATH_LENGTH = 2

export const watchTemplates: WatcherFn = ({
  path,
  store,
  gameObjectObserver,
  gameObjectDestroyer,
  gameObjectCreator,
  gameObjectSpawner,
  templateCollection,
  level,
}): void => {
  const templatesIdsToDelete = new Set<string>()
  const templatesToAdd = new Map<string, TemplateConfig>()

  if (path.length === TEMPLATES_PATH_LENGTH) {
    const templatesConfigs = store.get(['templates']) as Array<TemplateConfig>
    const templatesConfigsMap = templatesConfigs.reduce(
      (acc, templateConfig) => acc.add(templateConfig.id),
      new Set<string>(),
    )

    const templates = templateCollection.getAll()
    const templatesMap = templates.reduce(
      (acc, template) => acc.add(template.id),
      new Set<string>(),
    )

    templates.forEach((template) => {
      if (!templatesConfigsMap.has(template.id)) {
        templatesIdsToDelete.add(template.id)
      }
    })
    templatesConfigs.forEach((templateConfig) => {
      if (!templatesMap.has(templateConfig.id)) {
        templatesToAdd.set(templateConfig.id, templateConfig)
      }
    })
  }

  if (path.length >= TEMPLATE_PATH_LENGTH) {
    const templatePath = path.slice(0, TEMPLATE_PATH_LENGTH)
    const template = store.get(templatePath) as TemplateConfig | undefined

    if (template === undefined) {
      templatesIdsToDelete.add(path[1].split(':')[1])
    } else {
      templatesIdsToDelete.add(template.id)
      templatesToAdd.set(template.id, template)
    }
  }

  templatesIdsToDelete.forEach((id) => {
    templateCollection.delete(id)
  })
  templatesToAdd.forEach((template) => {
    templateCollection.register(omit(template))
  })

  if (!level) {
    return
  }

  const { gameObjects } = level

  gameObjects.forEach((gameObjectConfig) => {
    const { id, templateId } = gameObjectConfig

    if (templateId === undefined) {
      return
    }
    if (!templatesToAdd.has(templateId) && !templatesIdsToDelete.has(templateId)) {
      return
    }

    const gameObject = gameObjectObserver.getById(id)

    if (gameObject === undefined) {
      return
    }

    if (templatesIdsToDelete.has(templateId)) {
      gameObjectDestroyer.destroy(gameObject)
    }
    if (templatesToAdd.has(templateId)) {
      gameObjectSpawner.spawn(gameObjectCreator.create(omit(gameObjectConfig)))
    }
  })
}
