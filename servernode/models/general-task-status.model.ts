import mongoose, { Document } from 'mongoose';

// General Task Status Schema
const generalTaskStatusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // שם הסטטוס
    statusNumber: { type: Number, required: true, unique: true }, // מספר הסטטוס
    isFinal: { type: Boolean, default: false } // האם סטטוס סופי
  },
  { timestamps: true }
);

export interface GeneralTaskStatusDocument extends Document {
  name: string;
  statusNumber: number;
  isFinal: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const GeneralTaskStatus = mongoose.model<GeneralTaskStatusDocument>('GeneralTaskStatus', generalTaskStatusSchema);

export default GeneralTaskStatus;
