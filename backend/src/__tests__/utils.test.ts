import { describe, it, expect } from 'vitest'
import { replaceDateKeepTime, dateFormat, recalcDailyTaskStatus } from '../utils'
import { Status } from '../models/table-model'

describe('replaceDateKeepTime', () => {
  it('should replace date while keeping the time portion', () => {
    const result = replaceDateKeepTime(
      '2024-01-15T14:30:00.000Z',
      new Date('2024-06-20')
    )
    expect(result).toContain('T14:30:00.000Z')
    expect(result.startsWith('2024-06-20')).toBe(true)
  })

  it('should handle midnight time correctly', () => {
    const result = replaceDateKeepTime(
      '2024-03-10T00:00:00.000Z',
      new Date('2024-12-25')
    )
    expect(result).toBe('2024-12-25T00:00:00.000Z')
  })
})

describe('dateFormat', () => {
  it('should return formatted date with current date', () => {
    const today = new Date()
    const isoToday = today.toISOString().split('T')[0]
    const result = dateFormat(`2024-01-15T${today.toISOString().split('T')[1]}`)
    expect(result.formattedNameDate).toMatch(/\d{2}-\d{2}-\d{2}/) // dd-MM-yy format
    expect(result.joindDate.startsWith(isoToday)).toBe(true)
  })
})

describe('recalcDailyTaskStatus', () => {
  it('should return NEW if no tasks exist', () => {
    const parentTask: any = { tasks: [] }
    expect(recalcDailyTaskStatus(parentTask)).toBe(Status.NEW)
  })

  it('should return NEW if no tasks provided', () => {
    const parentTask: any = { tasks: undefined }
    expect(recalcDailyTaskStatus(parentTask)).toBe(Status.NEW)
  })

  it('should return COMPLETED if all tasks are completed', () => {
    const parentTask: any = {
      tasks: [
        { status: Status.COMPLETED },
        { status: Status.COMPLETED },
      ],
    }
    expect(recalcDailyTaskStatus(parentTask)).toBe(Status.COMPLETED)
  })

  it('should return IN_PROGRESS if some tasks are in progress or completed', () => {
    const parentTask: any = {
      tasks: [
        { status: Status.NEW },
        { status: Status.IN_PROGRESS },
      ],
    }
    expect(recalcDailyTaskStatus(parentTask)).toBe(Status.IN_PROGRESS)
  })

  it('should return NEW if all tasks are new', () => {
    const parentTask: any = {
      tasks: [
        { status: Status.NEW },
        { status: Status.NEW },
      ],
    }
    expect(recalcDailyTaskStatus(parentTask)).toBe(Status.NEW)
  })

  it('should return IN_PROGRESS if some tasks are completed', () => {
    const parentTask: any = {
      tasks: [
        { status: Status.NEW },
        { status: Status.COMPLETED },
      ],
    }
    expect(recalcDailyTaskStatus(parentTask)).toBe(Status.IN_PROGRESS)
  })
})