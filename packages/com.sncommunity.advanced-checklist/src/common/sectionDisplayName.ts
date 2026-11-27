import { c } from 'ttag'

import { SectionModel } from '../features/tasks/tasks-slice'

export function getSectionDisplayName(section: SectionModel): string {
  if (section.id === 'open-tasks') {
    return c('Plugins.AdvancedChecklist.Label').t`Open`
  }
  if (section.id === 'completed-tasks') {
    return c('Plugins.AdvancedChecklist.Label').t`Completed`
  }
  return section.name
}
