import mongoose, { Schema, Document } from 'mongoose';
import { Counter } from './counter.model';

export interface IMilestoneTemplate {
  id: number;
  name: string;
}

export interface IStageTemplate extends Document {
  id: number;
  name: string;
  engName: string;
  hebName: string;
  stageNumber: number;
  milestones: IMilestoneTemplate[];
}

const milestoneTemplateSchema = new Schema<IMilestoneTemplate>({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}, { _id: false });

const stageTemplateSchema = new Schema<IStageTemplate>({
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
  stageNumber: {
    type: Number,
    required: true,
    unique: true
  },
  milestones: {
    type: [milestoneTemplateSchema],
    required: true,
    default: []
  }
}, {
  timestamps: true
});

stageTemplateSchema.pre('save', async function () {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      'stageTemplateId',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    if (counter) {
      this.id = counter.seq;
    }
  }
});

export const StageTemplate = mongoose.model<IStageTemplate>('StageTemplate', stageTemplateSchema);
