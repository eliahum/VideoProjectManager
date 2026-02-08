import mongoose, { Document } from 'mongoose';
import { Counter } from './counter.model';

// General Task Schema
const generalTaskSchema = new mongoose.Schema(
  {
    taskNumber: { type: Number, unique: true },
    name: { type: String, required: true }, // שם המשימה
    statusNumber: { type: Number, default: 1 }, // מספר הסטטוס
    date: { type: Date }, // תאריך
    notes: { type: String } // הערות גדולות
  },
  { timestamps: true }
);

// Pre-save middleware to auto-increment taskNumber
generalTaskSchema.pre('save', async function() {
  if (!this.taskNumber) {
    const counter = await Counter.findByIdAndUpdate(
      'generalTaskNumber',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    if (counter) {
      this.taskNumber = counter.seq;
    }
  }
});

export interface GeneralTaskDocument extends Document {
  taskNumber: number;
  name: string;
  statusNumber: number;
  date?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const GeneralTask = mongoose.model<GeneralTaskDocument>('GeneralTask', generalTaskSchema);

export default GeneralTask;
