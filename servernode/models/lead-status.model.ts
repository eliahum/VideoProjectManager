import mongoose, { Document } from 'mongoose';

// Lead Status Schema
const leadStatusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // שם הסטטוס
    statusNumber: { type: Number, required: true, unique: true }, // מספר הסטטוס
    isFinal: { type: Boolean, default: false }, // האם סטטוס סופי
    isEditable: { type: Boolean, default: false } // האם ניתן לעדכן
  },
  { timestamps: true }
);

export interface LeadStatusDocument extends Document {
  name: string;
  statusNumber: number;
  isFinal: boolean;
  isEditable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const LeadStatus = mongoose.model<LeadStatusDocument>('LeadStatus', leadStatusSchema);

export default LeadStatus;
