import reducer, {
  DEFAULT_SECTIONS,
  deleteAllCompleted,
  LATEST_SCHEMA_VERSION,
  openAllCompleted,
  taskAdded,
  taskDeleted,
  taskModified,
  tasksGroupAdded,
  tasksGroupCollapsed,
  tasksGroupDeleted,
  tasksGroupDraft,
  tasksGroupLastActive,
  tasksGroupMerged,
  tasksGroupRenamed,
  tasksGroupReordered,
  tasksLoaded,
  tasksReordered,
  TasksState,
  taskToggled,
} from './tasks-slice'

it('should return the initial state', () => {
  return expect(
    reducer(undefined, {
      type: undefined,
    }),
  ).toEqual<TasksState>({ schemaVersion: LATEST_SCHEMA_VERSION, groups: [], defaultSections: [] })
})

it('should handle a task being added to a non-existing group', () => {
  const previousState: TasksState = { schemaVersion: '1.0.0', groups: [], defaultSections: [] }

  expect(
    reducer(
      previousState,
      taskAdded({
        task: { id: 'some-id', description: 'A simple task' },
        groupName: 'Test',
      }),
    ),
  ).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [],
  })
})

it('should handle a task being added to the existing tasks store', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  }

  expect(
    reducer(
      previousState,
      taskAdded({
        task: { id: 'another-id', description: 'Another simple task' },
        groupName: 'Test',
      }),
    ),
  ).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it('should handle an existing task being modified', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
        sections: DEFAULT_SECTIONS,
      },
    ],
  }

  expect(
    reducer(
      previousState,
      taskModified({
        task: { id: 'some-id', description: 'Task description changed' },
        groupName: 'Test',
      }),
    ),
  ).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'Task description changed',
            completed: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
        sections: DEFAULT_SECTIONS,
      },
    ],
  })
})

it('should not modify tasks if an invalid id is provided', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  expect(
    reducer(
      previousState,
      taskModified({
        task: { id: 'some-invalid-id', description: 'New description' },
        groupName: 'Test',
      }),
    ),
  ).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it('should keep completed field as-is, if task is modified', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  expect(
    reducer(
      previousState,
      taskModified({
        task: {
          id: 'some-id',
          description: 'New description',
        },
        groupName: 'Test',
      }),
    ),
  ).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'New description',
            completed: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it('should handle an existing task being toggled', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  expect(reducer(previousState, taskToggled({ id: 'some-id', groupName: 'Test' }))).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            completedAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

test('toggled tasks should be on top of the list', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'another-id',
            description: 'A simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'extra-id',
            description: 'A simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  expect(reducer(previousState, taskToggled({ id: 'another-id', groupName: 'Test' }))).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'A simple task',
            completed: true,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            completedAt: expect.any(String),
          },
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
            createdAt: expect.any(String),
          },
          {
            id: 'extra-id',
            description: 'A simple task',
            completed: false,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it('should handle an existing completed task being toggled', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  expect(reducer(previousState, taskToggled({ id: 'some-id', groupName: 'Test' }))).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it('should handle an existing task being deleted', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  expect(reducer(previousState, taskDeleted({ id: 'some-id', groupName: 'Test' }))).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it('should handle opening all tasks that are marked as completed', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  expect(reducer(previousState, openAllCompleted({ groupName: 'Test' }))).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: false,
            createdAt: expect.any(String),
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it('should handle clear all completed tasks', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  expect(reducer(previousState, deleteAllCompleted({ groupName: 'Test' }))).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it('should handle loading tasks into the tasks store, if an invalid payload is provided', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  expect(reducer(previousState, tasksLoaded('null'))).toEqual<TasksState>({
    schemaVersion: LATEST_SCHEMA_VERSION,
    defaultSections: DEFAULT_SECTIONS,
    groups: [],
    initialized: true,
  })
  expect(reducer(previousState, tasksLoaded('undefined'))).toMatchObject<TasksState>({
    ...previousState,
    initialized: false,
    lastError: expect.stringContaining("An error has occurred while parsing the note's content"),
  })
})

it('should initialize the storage with an empty object', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  expect(reducer(previousState, tasksLoaded(''))).toEqual<TasksState>({
    schemaVersion: LATEST_SCHEMA_VERSION,
    defaultSections: DEFAULT_SECTIONS,
    groups: [],
    initialized: true,
  })
})

it('should handle loading tasks into the tasks store, with a valid payload', () => {
  const previousState: TasksState = {
    schemaVersion: LATEST_SCHEMA_VERSION,
    defaultSections: DEFAULT_SECTIONS,
    groups: [],
  }

  const tasksPayload: Partial<TasksState> = {
    schemaVersion: LATEST_SCHEMA_VERSION,
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  const serializedPayload = JSON.stringify(tasksPayload)
  expect(reducer(previousState, tasksLoaded(serializedPayload))).toEqual<TasksState>({
    schemaVersion: LATEST_SCHEMA_VERSION,
    defaultSections: DEFAULT_SECTIONS,
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: expect.any(String),
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
    initialized: true,
  })
})

it('should set defaultSections property if not provided', () => {
  const previousState: TasksState = {
    schemaVersion: LATEST_SCHEMA_VERSION,
    defaultSections: [],
    groups: [],
  }

  const tasksPayload: Partial<TasksState> = {
    schemaVersion: LATEST_SCHEMA_VERSION,
    groups: [
      {
        name: 'Test',
        tasks: [],
      },
    ],
  }

  const serializedPayload = JSON.stringify(tasksPayload)
  expect(reducer(previousState, tasksLoaded(serializedPayload))).toEqual<TasksState>({
    schemaVersion: LATEST_SCHEMA_VERSION,
    defaultSections: DEFAULT_SECTIONS,
    groups: [
      {
        name: 'Test',
        tasks: [],
      },
    ],
    initialized: true,
  })
})

it('should handle adding a new task group', () => {
  const previousState: TasksState = { schemaVersion: '1.0.0', groups: [], defaultSections: [] }

  expect(reducer(previousState, tasksGroupAdded({ groupName: 'New group' }))).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'New group',
        tasks: [],
      },
    ],
  })
})

it('should handle adding an existing task group', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Existing group',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  expect(reducer(previousState, tasksGroupAdded({ groupName: 'Existing group' }))).toEqual(previousState)
})

it('should handle reordering tasks from the same section', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  expect(
    reducer(
      previousState,
      tasksReordered({
        groupName: 'Test',
        swapTaskIndex: 0,
        withTaskIndex: 1,
        isSameSection: true,
      }),
    ),
  ).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: expect.any(String),
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it('should handle reordering tasks from different sections', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  expect(
    reducer(
      previousState,
      tasksReordered({
        groupName: 'Test',
        swapTaskIndex: 0,
        withTaskIndex: 1,
        isSameSection: false,
      }),
    ),
  ).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: expect.any(String),
          },
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it('should handle reordering task groups', () => {
  const defaultCreatedAt = new Date().toISOString()

  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: defaultCreatedAt,
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: defaultCreatedAt,
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: defaultCreatedAt,
          },
        ],
      },
    ],
  }

  const currentState = reducer(
    previousState,
    tasksGroupReordered({
      swapGroupIndex: 0,
      withGroupIndex: 1,
    }),
  )

  const expectedState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: defaultCreatedAt,
          },
        ],
      },
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: defaultCreatedAt,
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: defaultCreatedAt,
          },
        ],
      },
    ],
  }

  expect(JSON.stringify(currentState)).toEqual(JSON.stringify(expectedState))
})

it('should handle deleting groups', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  const currentState = reducer(previousState, tasksGroupDeleted({ groupName: 'Testing' }))

  const expectedState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  }

  expect(currentState).toEqual(expectedState)
})

it('should not merge the same group', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  const currentState = reducer(previousState, tasksGroupMerged({ groupName: 'Testing', mergeWith: 'Testing' }))

  expect(currentState).toEqual(previousState)
})

it('should handle merging groups', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test group #1',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: 'Test group #2',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: 'Test group #3',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  const currentState = reducer(
    previousState,
    tasksGroupMerged({ groupName: 'Test group #3', mergeWith: 'Test group #2' }),
  )

  expect(currentState).toMatchObject<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test group #1',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
      {
        name: 'Test group #2',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it('should handle renaming a group', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  const currentState = reducer(previousState, tasksGroupRenamed({ groupName: 'Testing', newName: 'Tested' }))

  expect(currentState).toEqual<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
      {
        name: 'Tested',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it("should rename a group and preserve it's current order", () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: '1st group',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: '2nd group',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: '3rd group',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  const currentState = reducer(previousState, tasksGroupRenamed({ groupName: '2nd group', newName: 'Middle group' }))

  expect(currentState).toMatchObject<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: '1st group',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
      {
        name: 'Middle group',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
        ],
      },
      {
        name: '3rd group',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it('should handle collapsing groups', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  const currentState = reducer(
    previousState,
    tasksGroupCollapsed({ groupName: 'Testing', type: 'group', collapsed: true }),
  )

  const expectedState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
      {
        name: 'Testing',
        collapsed: true,
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  }

  expect(currentState).toEqual(expectedState)
})

it('should handle saving task draft for groups', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: 'Tests',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  const currentState = reducer(previousState, tasksGroupDraft({ groupName: 'Tests', draft: 'Remember to ...' }))

  const expectedState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
        ],
      },
      {
        name: 'Tests',
        draft: 'Remember to ...',
        tasks: [
          {
            id: 'yet-another-id',
            description: 'Yet another simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  }

  expect(currentState).toEqual(expectedState)
})

it('should handle setting a group as last active', () => {
  const previousState: TasksState = {
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        name: 'Testing',
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
  }

  const currentState = reducer(previousState, tasksGroupLastActive({ groupName: 'Testing' }))

  expect(currentState).toMatchObject<TasksState>({
    schemaVersion: '1.0.0',
    defaultSections: [],
    groups: [
      {
        name: 'Test',
        tasks: [
          {
            id: 'some-id',
            description: 'A simple task',
            completed: true,
            createdAt: expect.any(String),
          },
        ],
      },
      {
        name: 'Testing',
        lastActive: expect.any(String),
        tasks: [
          {
            id: 'another-id',
            description: 'Another simple task',
            completed: false,
            createdAt: expect.any(String),
          },
        ],
      },
    ],
  })
})

it('should detect and load legacy content', () => {
  const payload = '- [ ] Foo bar'
  expect(reducer(undefined, tasksLoaded(payload))).toMatchObject<TasksState>({
    schemaVersion: LATEST_SCHEMA_VERSION,
    defaultSections: [],
    initialized: false,
    groups: [],
    legacyContent: {
      name: 'Checklist',
      tasks: [
        {
          id: expect.any(String),
          description: 'Foo bar',
          completed: false,
          createdAt: expect.any(String),
        },
      ],
    },
  })
})

describe('Backward Compatibility - JSON Serialization Handling', () => {
  it('should handle legacy notes that had Date objects (via JSON serialization)', () => {
    const previousState: TasksState = {
      schemaVersion: LATEST_SCHEMA_VERSION,
      defaultSections: DEFAULT_SECTIONS,
      groups: [],
    }

    // Simulate the actual scenario: old code created Date objects,
    // but when saved/loaded through JSON, they become strings
    const legacyDate = new Date('2023-01-15T10:30:00.000Z')
    
    // This is what the old code would have created in memory
    const legacyTasksInMemory = {
      schemaVersion: LATEST_SCHEMA_VERSION,
      groups: [
        {
          name: 'Legacy Tasks',
          tasks: [
            {
              id: 'legacy-task-1',
              description: 'Task created with old code',
              completed: false,
              createdAt: legacyDate, // Date object in old code
            },
            {
              id: 'legacy-task-2', 
              description: 'Another legacy task',
              completed: true,
              createdAt: legacyDate,
              updatedAt: legacyDate,
              completedAt: legacyDate,
            },
          ],
          lastActive: legacyDate,
        },
      ],
    }

    // But when saved and loaded, JSON.stringify/parse converts Date → string
    const serializedPayload = JSON.stringify(legacyTasksInMemory)
    const result = reducer(previousState, tasksLoaded(serializedPayload))

    // Verify that the system handles this correctly
    expect(result).toEqual<TasksState>({
      schemaVersion: LATEST_SCHEMA_VERSION,
      defaultSections: DEFAULT_SECTIONS,
      groups: [
        {
          name: 'Legacy Tasks',
          tasks: [
            {
              id: 'legacy-task-1',
              description: 'Task created with old code',
              completed: false,
              createdAt: legacyDate.toISOString(), // Now a string
            },
            {
              id: 'legacy-task-2',
              description: 'Another legacy task',
              completed: true,
              createdAt: legacyDate.toISOString(),
              updatedAt: legacyDate.toISOString(),
              completedAt: legacyDate.toISOString(),
            },
          ],
          lastActive: legacyDate.toISOString(),
        },
      ],
      initialized: true,
    })

    // Explicitly verify that dates are strings, not Date objects
    const loadedTask = result.groups[0].tasks[0]
    expect(typeof loadedTask.createdAt).toBe('string')
    expect(loadedTask.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    expect(new Date(loadedTask.createdAt).getTime()).toBe(legacyDate.getTime())
  })

  it('should demonstrate that JSON serialization automatically converts Date objects', () => {
    // This test documents the core mechanism that provides backward compatibility
    const dataWithDateObjects = {
      createdAt: new Date('2023-01-15T10:30:00.000Z'),
      updatedAt: new Date('2023-02-20T15:45:30.123Z'),
    }

    // Verify initial state
    expect(dataWithDateObjects.createdAt instanceof Date).toBe(true)
    expect(typeof dataWithDateObjects.createdAt).toBe('object')

    // Simulate the save/load cycle
    const serialized = JSON.stringify(dataWithDateObjects)
    const parsed = JSON.parse(serialized)

    // Verify automatic conversion
    expect(parsed.createdAt instanceof Date).toBe(false)
    expect(typeof parsed.createdAt).toBe('string')
    expect(parsed.createdAt).toBe('2023-01-15T10:30:00.000Z')
    expect(parsed.updatedAt).toBe('2023-02-20T15:45:30.123Z')

    // Verify that the strings are valid ISO dates
    expect(new Date(parsed.createdAt).getTime()).toBe(dataWithDateObjects.createdAt.getTime())
    expect(new Date(parsed.updatedAt).getTime()).toBe(dataWithDateObjects.updatedAt.getTime())
  })
})

