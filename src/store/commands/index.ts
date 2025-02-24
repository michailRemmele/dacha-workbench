import {
  SET,
  DELETE,
  ADD_VALUE,
  ADD_VALUES,
  DELETE_BY_PATHS,
} from '../../command-types'
import type { Store } from '../store'

import { Command } from './command'
import { SetCmd } from './set'
import { DeleteCmd } from './delete'
import { AddValueCmd } from './add-value'
import { AddValuesCmd } from './add-values'
import { DeleteByPathsCmd } from './delete-by-paths'

export const commands: Record<string, { new(store: Store): Command }> = {
  [SET]: SetCmd,
  [DELETE]: DeleteCmd,
  [ADD_VALUE]: AddValueCmd,
  [ADD_VALUES]: AddValuesCmd,
  [DELETE_BY_PATHS]: DeleteByPathsCmd,
}
