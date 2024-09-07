import { v4 as uuidv4 } from 'uuid'
import type { TemplateConfig, ActorConfig } from 'remiz'

export const buildActorConfig = (template: TemplateConfig): ActorConfig => ({
  id: uuidv4(),
  templateId: template.id,
  fromTemplate: true,
  name: template.name,
  components: [],
  children: template.children?.map((child) => buildActorConfig(child)),
})
