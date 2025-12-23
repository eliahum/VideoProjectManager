import mongoose, { Document } from 'mongoose';
import { Counter } from './counter.model';

// SupplierType Schema
const supplierTypeSchema = new mongoose.Schema(
  {
    supplierTypeNumber: { type: Number, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Pre-save middleware to auto-increment supplierTypeNumber
supplierTypeSchema.pre('save', async function() {
  if (!this.supplierTypeNumber) {
    const counter = await Counter.findByIdAndUpdate(
      'supplierTypeNumber',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    if (counter) {
      this.supplierTypeNumber = counter.seq;
    }
  }
});

export interface SupplierTypeDocument extends Document {
  supplierTypeNumber: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SupplierType = mongoose.model<SupplierTypeDocument>('SupplierType', supplierTypeSchema);

export default SupplierType;
