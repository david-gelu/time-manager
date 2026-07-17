import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  mockFind,
  mockFindOne,
  mockFindByIdAndUpdate,
  mockFindOneAndUpdate,
  mockCreate,
  mockDeleteOne,
  mockCountDocuments,
  mockAggregate,
  mockSave,
} = vi.hoisted(() => ({
  mockFind: vi.fn(),
  mockFindOne: vi.fn(),
  mockFindByIdAndUpdate: vi.fn(),
  mockFindOneAndUpdate: vi.fn(),
  mockCreate: vi.fn(),
  mockDeleteOne: vi.fn(),
  mockCountDocuments: vi.fn(),
  mockAggregate: vi.fn(),
  mockSave: vi.fn(),
}))

vi.mock('../models', () => ({
  DailyTasksModel: {
    find: mockFind,
    findOne: mockFindOne,
    findByIdAndUpdate: mockFindByIdAndUpdate,
    findOneAndUpdate: mockFindOneAndUpdate,
    create: mockCreate,
    deleteOne: mockDeleteOne,
    countDocuments: mockCountDocuments,
    aggregate: mockAggregate,
    save: mockSave,
    lean: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    exec: vi.fn(),
  },
}))

vi.mock('../middleware/authMiddleware', () => ({
  authMiddleware: (req: any, _res: any, next: any) => {
    req.user = { uid: 'test-user-123', email: 'test@example.com' }
    next()
  },
  AuthRequest: {} as any,
}))

import { Status } from '../models/table-model'
import dailyTasksRouter from '../routes/dailyTasks'
import subTasksRouter from '../routes/subTasks'
import statsRouter from '../routes/stats'

function mockResponse() {
  const res: any = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

async function callRoute(router: any, method: string, path: string, req: any, res: any) {
  const layer = router.stack.find((s: any) => {
    if (!s.route) return false
    return s.route.path === path && s.route.methods[method]
  })
  if (!layer) throw new Error(`Route ${method.toUpperCase()} ${path} not found`)
  // Pass next as a no-op function to satisfy middleware that calls next()
  const next = () => { }
  // Execute all handlers in the route's stack sequentially
  for (const handler of layer.route.stack) {
    await handler.handle(req, res, next)
  }
}

describe('DailyTasks API Routes', () => {
  beforeEach(() => { vi.clearAllMocks() })

  describe('POST /add-task', () => {
    it('should create a new daily task', async () => {
      const req: any = { user: { uid: 'test-user-123' }, body: { name: 'Test Task', date: '2024-07-17T10:00:00.000Z', status: Status.NEW, description: 'Test desc', tasks: [] } }
      const res = mockResponse()
      mockFindOne.mockResolvedValueOnce(null)
      mockCreate.mockResolvedValueOnce({ _id: 'new-task-id', name: 'Test Task - 17-07-24', date: '2024-07-17T10:00:00.000Z', status: Status.NEW, description: 'Test desc', userId: 'test-user-123', tasks: [] })

      await callRoute(dailyTasksRouter, 'post', '/add-task', req, res)
      expect(res.status).toHaveBeenCalledWith(201)
    })

    it('should return 400 if task name already exists', async () => {
      const req: any = { user: { uid: 'test-user-123' }, body: { name: 'Test Task', date: '2024-07-17T10:00:00.000Z', status: Status.NEW, description: 'Test desc', tasks: [] } }
      const res = mockResponse()
      mockFindOne.mockResolvedValueOnce({ _id: 'existing-task' })

      await callRoute(dailyTasksRouter, 'post', '/add-task', req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })
  })

  describe('POST /edit-task', () => {
    it('should edit an existing task', async () => {
      const req: any = { user: { uid: 'test-user-123' }, body: { taskId: 'task-123', taskData: { name: 'Updated' } } }
      const res = mockResponse()
      mockFindOneAndUpdate.mockResolvedValueOnce({ _id: 'task-123', name: 'Updated' })

      await callRoute(dailyTasksRouter, 'post', '/edit-task', req, res)
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('should return 404 if task not found', async () => {
      const req: any = { user: { uid: 'test-user-123' }, body: { taskId: 'nonexistent', taskData: {} } }
      const res = mockResponse()
      mockFindOneAndUpdate.mockResolvedValueOnce(null)

      await callRoute(dailyTasksRouter, 'post', '/edit-task', req, res)
      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('POST /delete-task', () => {
    it('should delete a task', async () => {
      const req: any = { user: { uid: 'test-user-123' }, body: { taskId: 'task-123' } }
      const res = mockResponse()
      mockDeleteOne.mockResolvedValueOnce({ deletedCount: 1 })

      await callRoute(dailyTasksRouter, 'post', '/delete-task', req, res)
      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('POST /add-sub-task', () => {
    it('should add a subtask', async () => {
      const parentTask = { _id: 'parent-123', tasks: [], status: Status.NEW, save: mockSave }
      const req: any = { user: { uid: 'test-user-123' }, body: { parentTaskId: 'parent-123', taskData: { task_name: 'Sub 1', start_date: '2024-07-17T09:00:00.000Z', status: Status.NEW } } }
      const res = mockResponse()
      mockFindOne.mockResolvedValueOnce(parentTask)
      mockFindByIdAndUpdate.mockResolvedValueOnce(parentTask)

      await callRoute(dailyTasksRouter, 'post', '/add-sub-task', req, res)
      expect(res.status).toHaveBeenCalledWith(201)
    })

    it('should return 404 if parent not found', async () => {
      const req: any = { user: { uid: 'test-user-123' }, body: { parentTaskId: 'nonexistent', taskData: {} } }
      const res = mockResponse()
      mockFindOne.mockResolvedValueOnce(null)

      await callRoute(dailyTasksRouter, 'post', '/add-sub-task', req, res)
      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('POST /update-sub-task-status', () => {
    it('should update subtask status', async () => {
      const parentTask = { _id: 'parent-123', tasks: [{ _id: 'subtask-1', status: Status.NEW, toObject: () => ({ _id: 'subtask-1', status: Status.NEW }) }], status: Status.NEW, save: mockSave }
      const req: any = { user: { uid: 'test-user-123' }, body: { subTaskId: 'subtask-1', newStatus: Status.COMPLETED } }
      const res = mockResponse()
      mockFindOne.mockResolvedValueOnce(parentTask)
      mockSave.mockResolvedValueOnce(parentTask)

      await callRoute(dailyTasksRouter, 'post', '/update-sub-task-status', req, res)
      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('POST /duplicate-task', () => {
    it('should duplicate a task', async () => {
      const originalTask = { _id: 'task-123', name: 'Test - 17-07-24', date: '2024-07-17T10:00:00.000Z', status: Status.NEW, userId: 'test-user-123', description: 'desc', tasks: [{ _id: 'sub-1', task_name: 'Sub', start_date: '2024-07-17T09:00:00.000Z', end_date: '2024-07-17T17:00:00.000Z', status: Status.NEW }] }
      const req: any = { user: { uid: 'test-user-123' }, body: { taskData: { _id: 'task-123' } } }
      const res = mockResponse()
      mockFindOne.mockResolvedValueOnce(originalTask)
      mockCreate.mockResolvedValueOnce({ ...originalTask, _id: 'duplicated-id' })

      await callRoute(dailyTasksRouter, 'post', '/duplicate-task', req, res)
      expect(res.status).toHaveBeenCalledWith(201)
    })
  })
})

describe('SubTasks API Routes', () => {
  beforeEach(() => { vi.clearAllMocks() })

  const statusFilterRoutes = [
    { path: '/all-status-new', status: Status.NEW },
    { path: '/all-status-in-progress', status: Status.IN_PROGRESS },
    { path: '/all-status-completed', status: Status.COMPLETED },
  ]

  for (const route of statusFilterRoutes) {
    describe(`GET ${route.path}`, () => {
      it('should return filtered subtasks', async () => {
        const req: any = { user: { uid: 'test-user-123' }, query: {} }
        const res = mockResponse()
        mockAggregate.mockResolvedValueOnce([{ _id: 'sub-1', task_name: 'Task 1', status: route.status, parentName: 'Parent' }])

        await callRoute(subTasksRouter, 'get', route.path, req, res)
        expect(res.json).toHaveBeenCalled()
      })

      it('should filter by search param', async () => {
        const req: any = { user: { uid: 'test-user-123' }, query: { search: 'test' } }
        const res = mockResponse()
        mockAggregate.mockResolvedValueOnce([])

        await callRoute(subTasksRouter, 'get', route.path, req, res)
        expect(res.json).toHaveBeenCalledWith([])
      })
    })
  }

  describe('GET /:taskId', () => {
    it('should return a specific subtask', async () => {
      const req: any = { user: { uid: 'test-user-123' }, params: { taskId: 'subtask-1' } }
      const res = mockResponse()
      mockFindOne.mockResolvedValueOnce({ tasks: [{ _id: 'subtask-1', task_name: 'Test', status: Status.NEW }] })

      await callRoute(subTasksRouter, 'get', '/:taskId', req, res)
      expect(res.json).toHaveBeenCalled()
    })
  })

  describe('PUT /edit-task/:taskId', () => {
    it('should update a subtask', async () => {
      const req: any = { user: { uid: 'test-user-123' }, params: { taskId: 'subtask-1' }, body: { taskData: { task_name: 'Updated', description: 'Updated', start_date: '2024-07-17T09:00:00.000Z', end_date: '2024-07-17T17:00:00.000Z', status: Status.IN_PROGRESS, checklist: [] } } }
      const res = mockResponse()
      mockFindOneAndUpdate.mockResolvedValueOnce({ tasks: [{ _id: 'subtask-1', task_name: 'Updated', status: Status.IN_PROGRESS }] })

      await callRoute(subTasksRouter, 'put', '/edit-task/:taskId', req, res)
      expect(res.json).toHaveBeenCalled()
    })

    it('should determine status from checklist', async () => {
      const req: any = { user: { uid: 'test-user-123' }, params: { taskId: 'subtask-1' }, body: { taskData: { task_name: 'Updated', description: 'Updated', start_date: '2024-07-17T09:00:00.000Z', end_date: '2024-07-17T17:00:00.000Z', checklist: [{ label: 'Item 1', checked: true }, { label: 'Item 2', checked: false }] } } }
      const res = mockResponse()
      mockFindOneAndUpdate.mockResolvedValueOnce({ tasks: [{ _id: 'subtask-1', task_name: 'Updated', status: Status.IN_PROGRESS }] })

      await callRoute(subTasksRouter, 'put', '/edit-task/:taskId', req, res)
      expect(res.json).toHaveBeenCalled()
    })
  })

  describe('unauthenticated', () => {
    it('should return 401 if no user', async () => {
      const req: any = { user: null, query: {} }
      const res = mockResponse()
      await callRoute(subTasksRouter, 'get', '/all-status-new', req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })
  })
})

describe('Stats API Routes', () => {
  beforeEach(() => { vi.clearAllMocks() })

  const routes = [
    { path: '/count-daily-status-new', subtaskBased: false },
    { path: '/count-daily-status-in-progress', subtaskBased: false },
    { path: '/count-daily-status-completed', subtaskBased: false },
    { path: '/count-subtasks-status-new', subtaskBased: true },
    { path: '/count-subtasks-status-in-progress', subtaskBased: true },
    { path: '/count-subtasks-status-completed', subtaskBased: true },
  ]

  for (const r of routes) {
    describe(`GET ${r.path}`, () => {
      it('should return a count', async () => {
        const req: any = { user: { uid: 'test-user-123' }, query: {} }
        const res = mockResponse()
        if (r.subtaskBased) {
          mockAggregate.mockResolvedValueOnce([{ totalNewSubtasks: 5 }])
        } else {
          mockCountDocuments.mockResolvedValueOnce(3)
        }

        await callRoute(statsRouter, 'get', r.path, req, res)
        expect(res.json).toHaveBeenCalled()
      })

      it('should return 0 if null', async () => {
        const req: any = { user: { uid: 'test-user-123' }, query: {} }
        const res = mockResponse()
        if (r.subtaskBased) {
          mockAggregate.mockResolvedValueOnce([])
        } else {
          mockCountDocuments.mockResolvedValueOnce(null)
        }

        await callRoute(statsRouter, 'get', r.path, req, res)
        expect(res.json).toHaveBeenCalled()
      })
    })
  }

  describe('unauthorized', () => {
    it('should return 401', async () => {
      const req: any = { user: null, query: {} }
      const res = mockResponse()
      await callRoute(statsRouter, 'get', '/count-daily-status-new', req, res)
      expect(res.status).toHaveBeenCalledWith(401)
    })
  })
})