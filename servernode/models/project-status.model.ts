import mongoose, { Document } from 'mongoose';

// Project Status Schema
const projectStatusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // שם הסטטוס
    status: { type: String, required: true }, // סטטוס
    statusNumber: { type: Number, required: true, unique: true }, // מספר הסטטוס
    isFinal: { type: Boolean, default: false }, // האם סטטוס סופי
    isPause: { type: Boolean, default: false } // האם סטטוס השהיה
  },
  { timestamps: true }
);

export interface ProjectStatusDocument extends Document {
  name: string;
  status: string;
  statusNumber: number;
  isFinal: boolean;
  isPause: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectStatus = mongoose.model<ProjectStatusDocument>('ProjectStatus', projectStatusSchema);

export default ProjectStatus;
