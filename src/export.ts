import { EngineContext, SchemasContext } from './view/providers'
import {
  useExtension,
  useConfig,
  useCommander,
  useStore,
} from './view/hooks'
import { addValue, setValue, deleteValue } from './view/commands'
import { Field } from './view/modules/inspector/components/field'
import { Widget } from './view/modules/inspector/components/widget'
import { TextInput, LabelledTextInput } from './view/modules/inspector/components/text-input'
import { NumberInput, LabelledNumberInput } from './view/modules/inspector/components/number-input'
import { Select, LabelledSelect } from './view/modules/inspector/components/select'
import { Checkbox, LabelledCheckbox } from './view/modules/inspector/components/checkbox'
import { MultiTextInput, LabelledMultiTextInput } from './view/modules/inspector/components/multi-text-input'
import { MultiSelect, LabelledMultiSelect } from './view/modules/inspector/components/multi-select'
import { MultiField } from './view/modules/inspector/components/multi-field'
import { Panel } from './view/modules/inspector/components/panel'

const commands = {
  setValue,
  addValue,
  deleteValue,
}

window.RemizEditor = {
  EngineContext,
  SchemasContext,

  Field,
  Widget,
  TextInput,
  LabelledTextInput,
  NumberInput,
  LabelledNumberInput,
  Select,
  LabelledSelect,
  Checkbox,
  LabelledCheckbox,
  MultiTextInput,
  LabelledMultiTextInput,
  MultiSelect,
  LabelledMultiSelect,
  MultiField,
  Panel,

  useExtension,
  useConfig,
  useCommander,
  useStore,

  commands,
}
