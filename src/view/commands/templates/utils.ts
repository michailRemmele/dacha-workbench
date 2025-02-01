import type { TemplateConfig, ActorConfig, LevelConfig } from 'dacha'

import { buildActorConfig } from '../../../utils/build-actor-config'

const getUpdatedActors = (
  actors: ActorConfig[],
  parentId: string,
  templates: TemplateConfig[],
): ActorConfig[] => actors.map((actor) => {
  if (actor.templateId === parentId) {
    return {
      ...actor,
      children: [
        ...(actor.children ? getUpdatedActors(actor.children, parentId, templates) : []),
        ...templates.map((template) => buildActorConfig(template)),
      ],
    }
  }

  if (actor.children) {
    return {
      ...actor,
      children: getUpdatedActors(actor.children, parentId, templates),
    }
  }

  return actor
})

export const getUpdatedLevels = (
  levels: LevelConfig[],
  parentId: string,
  templates: TemplateConfig[],
): LevelConfig[] => levels.map((level) => ({
  ...level,
  actors: getUpdatedActors(level.actors, parentId, templates),
}))

const filterActors = (
  actors: ActorConfig[],
  templateIds: Set<string>,
): ActorConfig[] => actors.reduce((acc, actor) => {
  if (actor.templateId && templateIds.has(actor.templateId)) {
    return acc
  }

  acc.push({
    ...actor,
    children: actor.children && filterActors(actor.children, templateIds),
  })

  return acc
}, [] as ActorConfig[])

export const filterLevels = (
  levels: LevelConfig[],
  templateIds: Set<string>,
): LevelConfig[] => levels.map((level) => ({
  ...level,
  actors: filterActors(level.actors, templateIds),
}))
