export interface GeneralTaskStatus {
  id: string;
  name: string;
  statusNumber: number;
  isFinal: boolean;
  taskCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
