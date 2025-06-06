import { v4 as uuidv4 } from 'uuid'
import type { SceneConfig, ActorConfig } from 'dacha'

import type { ExplorerEntity } from '../../../types/explorer-entity'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'
import { getUniqueName } from '../../../utils/get-unique-name'
import { addValues } from '..'
import { SCENE_PATH_LENGTH } from '../../../consts/paths'

const updateIds = (actor: ActorConfig): void => {
  actor.id = uuidv4()
  actor.children?.forEach(updateIds)
}

const getActorDuplicate = (actor: unknown, parent: unknown): ActorConfig => {
  const duplicate = structuredClone(actor as ActorConfig)
  duplicate.name = getUniqueName(duplicate.name, parent as ExplorerEntity[])
  updateIds(duplicate)

  return duplicate
}

const getSceneDuplicate = (scene: unknown, parent: unknown): SceneConfig => {
  const duplicate = structuredClone(scene as SceneConfig)
  duplicate.name = getUniqueName(duplicate.name, parent as ExplorerEntity[])
  duplicate.id = uuidv4()
  duplicate.actors.forEach(updateIds)

  return duplicate
}

const isPathCorrect = (path: string[], isActorDestination: boolean): boolean => {
  if (isActorDestination) {
    return path.length > SCENE_PATH_LENGTH
  }
  return path.length === SCENE_PATH_LENGTH
}

export const copyByPaths = (
  sourcePaths: string[][],
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const isActorDestination = destinationPath.at(-1) !== 'scenes'
  const destination = getState(destinationPath)
  if (!Array.isArray(destination)) {
    return
  }

  const { values } = sourcePaths.reduce((acc, path) => {
    if (!isPathCorrect(path, isActorDestination)) {
      return acc
    }
    const value = getState(path)
    if (value) {
      const duplicate = isActorDestination
        ? getActorDuplicate(value, acc.parent)
        : getSceneDuplicate(value, acc.parent)

      acc.values.push(duplicate)
      acc.parent.push(duplicate)
    }
    return acc
  }, { values: [] as unknown[], parent: destination.slice(0) })

  if (values.length) {
    dispatch(addValues(destinationPath, values))
  }
}
