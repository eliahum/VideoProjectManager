export interface GeneralTask {
  _id?: string;
  taskNumber?: number;
  name: string;
  statusNumber: number;
  date?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
