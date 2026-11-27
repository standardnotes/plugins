import '@reach/dialog/styles.css'

import { AlertDialog, AlertDialogDescription, AlertDialogLabel } from '@reach/alert-dialog'
import React, { KeyboardEvent, useRef, useState } from 'react'
import { c } from 'ttag'

import { useAppDispatch } from '../../app/hooks'
import { TextInput } from '../../common/components'
import { tasksGroupRenamed } from './tasks-slice'

type RenameTaskGroupsProps = {
  groupName: string
  handleClose: () => void
}

const RenameTaskGroups: React.FC<RenameTaskGroupsProps> = ({ groupName, handleClose }) => {
  const cancelRef = useRef<HTMLButtonElement>(null)

  const dispatch = useAppDispatch()

  const [renameTo, setRenameTo] = useState<string>(groupName)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newName = event.target.value
    setRenameTo(newName)
  }

  function handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      const rawString = (event.target as HTMLInputElement).value
      rawString.length > 0 && handleRenameGroup()
    }
  }

  function handleRenameGroup() {
    dispatch(tasksGroupRenamed({ groupName, newName: renameTo }))
    handleClose()
  }

  return (
    <AlertDialog data-testid="rename-task-group-dialog" leastDestructiveRef={cancelRef}>
      <div className="sk-modal-content">
        <div className="sn-component">
          <div className="sk-panel">
            <div className="sk-panel-content">
              <div className="sk-panel-section">
                <AlertDialogLabel className="sk-h3 sk-panel-section-title">
                  {c('Plugins.AdvancedChecklist.Title').t`Renaming group '${groupName}':`}
                </AlertDialogLabel>

                <AlertDialogDescription>
                  <TextInput
                    testId="new-group-name-input"
                    autoFocus
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder={c('Plugins.AdvancedChecklist.Placeholder').t`Enter new group name`}
                    value={renameTo}
                  />
                </AlertDialogDescription>

                <div className="flex my-1 mt-4">
                  <button className="sn-button small neutral" onClick={handleClose} ref={cancelRef}>
                    {renameTo.length === 0
                      ? c('Plugins.AdvancedChecklist.Action').t`Close`
                      : c('Plugins.AdvancedChecklist.Action').t`Cancel`}
                  </button>
                  <button
                    className="sn-button small ml-2 info"
                    disabled={renameTo.length === 0}
                    onClick={handleRenameGroup}
                  >
                    {c('Plugins.AdvancedChecklist.Action').t`Rename`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AlertDialog>
  )
}

export default RenameTaskGroups
