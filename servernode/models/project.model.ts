import mongoose, { Schema, Document } from 'mongoose';
import { Counter } from './counter.model';

export interface IMilestoneSupplier {
  supplierId: string;
  supplierName: string;
  amount: number;
}

export interface IMilestone {
  id: string;
  milestoneId: number;
  name: string;
  documentReference: string;
  date?: Date;
  statusNumber: number;
  suppliers: IMilestoneSupplier[];
}

export interface IStage {
  stageNumber: number;
  stageName: string;
  milestones: IMilestone[];
}

export interface IProject extends Document {
  id: string;
  projectNumber: number;
  customerId: string;
  customerName: string;
  projectType: string;
  currentStageNumber: number;
  stages: IStage[];
  currentMilestoneId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const milestoneSupplierSchema = new Schema<IMilestoneSupplier>({
  supplierId: {
    type: String,
    required: true
  },
  supplierName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
}, { _id: false });

const milestoneSchema = new Schema<IMilestone>({
  id: {
    type: String,
    required: true
  },
  milestoneId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  documentReference: {
    type: String,
    default: ''
  },
  date: {
    type: Date
  },
  statusNumber: {
    type: Number,
    required: true,
    default: 1
  },
  suppliers: {
    type: [milestoneSupplierSchema],
    default: []
  }
}, { _id: false });

const stageSchema = new Schema<IStage>({
  stageNumber: {
    type: Number,
    required: true
  },
  stageName: {
    type: String,
    required: true
  },
  milestones: {
    type: [milestoneSchema],
    default: []
  }
}, { _id: false });

const projectSchema = new Schema<IProject>({
  id: {
    type: String,
    unique: true
  },
  projectNumber: {
    type: Number,
    unique: true
  },
  customerId: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  projectType: {
    type: String,
    required: true
  },
  currentStageNumber: {
    type: Number,
    required: true,
    default: 1
  },
  stages: {
    type: [stageSchema],
    required: true,
    default: []
  },
  currentMilestoneId: {
    type: Number
  }
}, {
  timestamps: true
});

projectSchema.pre('save', async function () {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      'projectNumber',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    if (counter) {
      this.projectNumber = counter.seq;
      this.id = `PRJ${counter.seq.toString().padStart(5, '0')}`;
    }
  }
});

export const Project = mongoose.model<IProject>('Project', projectSchema);
