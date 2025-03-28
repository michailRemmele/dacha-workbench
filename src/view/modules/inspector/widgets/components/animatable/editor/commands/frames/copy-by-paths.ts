import { v4 as uuidv4 } from 'uuid'
import type { Animation } from 'dacha'

import type { DispatchFn, GetStateFn } from '../../../../../../../../hooks/use-commander'
import { addValues } from '../../../../../../../../commands'

export const getFrameDuplicate = (frame: Animation.FrameConfig): Animation.FrameConfig => {
  const duplicate = structuredClone(frame)
  duplicate.id = uuidv4()

  return duplicate
}

export const copyByPaths = (
  sourcePaths: string[][],
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const destination = getState(destinationPath)
  if (!Array.isArray(destination)) {
    return
  }

  const { values } = sourcePaths.reduce((acc, path) => {
    const value = getState(path)
    if (value) {
      const duplicate = getFrameDuplicate(value as Animation.FrameConfig)
      acc.values.push(duplicate)
    }
    return acc
  }, { values: [] as Animation.FrameConfig[] })

  if (values.length) {
    dispatch(addValues(destinationPath, values))
  }
}
