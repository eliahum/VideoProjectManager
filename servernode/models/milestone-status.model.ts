import mongoose, { Schema, Document } from 'mongoose';
import { Counter } from './counter.model';

export interface IMilestoneStatus extends Document {
  id: number;
  name: string;
  engName: string;
  hebName: string;
  milestoneStatusNumber: number;
  isFinal: boolean;
  isEditable: boolean;
}

const milestoneStatusSchema = new Schema<IMilestoneStatus>({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  engName: {
    type: String,
    required: true
  },
  hebName: {
    type: String,
    required: true
  },
  milestoneStatusNumber: {
    type: Number,
    required: true,
    unique: true
  },
  isFinal: {
    type: Boolean,
    required: true,
    default: false
  },
  isEditable: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: true
});

milestoneStatusSchema.pre('save', async function () {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      'milestoneStatusId',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    if (counter) {
      this.id = counter.seq;
    }
  }
});

export const MilestoneStatus = mongoose.model<IMilestoneStatus>('MilestoneStatus', milestoneStatusSchema);
