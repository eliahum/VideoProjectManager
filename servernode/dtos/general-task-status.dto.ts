export interface GeneralTaskStatusDto {
  _id?: string;
  name: string;
  statusNumber: number;
  isFinal: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
