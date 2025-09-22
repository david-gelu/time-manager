import { model, Model, Schema, Types } from 'mongoose';

export enum Status {
  NEW = 'new',
  IN_PROGRESS = 'in progress',
  COMPLETED = 'completed',
}

export type SubTask = {
  _id: Types.ObjectId;
  task_name: string;
  status: Status;
  start_date: string;
  end_date: string;
  description: string;
};

export interface DailyTasks {
  _id: Types.ObjectId;
  name: string;
  date: string;
  status: Status;
  description: string;
  userId: string;
  tasks: SubTask[];
}

const SubTaskSchema = new Schema<SubTask>({
  task_name: { type: String, required: true },
  status: { type: String, enum: Object.values(Status), default: Status.NEW },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  description: { type: String, required: true },
});


const DailyTasksSchema = new Schema<DailyTasks, DailyTasksModel>({
  name: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: Object.values(Status), default: Status.NEW },
  description: { type: String, required: true, default: 'This are my tasks for today' },
  userId: { type: String, required: true },
  tasks: { type: [SubTaskSchema], default: [] },
});


DailyTasksSchema.index({ name: 1, date: 1 }, { unique: true });

interface DailyTasksModel extends Model<DailyTasks> { }

export const DailyTasksModel = model<DailyTasks, DailyTasksModel>('DailyTasks', DailyTasksSchema);