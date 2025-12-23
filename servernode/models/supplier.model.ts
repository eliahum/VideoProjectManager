import mongoose, { Document } from 'mongoose';
import { Counter } from './counter.model';

// Supplier Schema
const supplierSchema = new mongoose.Schema(
  {
    supplierNumber: { type: Number, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    supplierType: { type: mongoose.Schema.Types.ObjectId, ref: 'SupplierType' },
    accountDetails: { type: String },
    isPaid: { type: Boolean, default: false },
    notes: { type: String }
  },
  { timestamps: true }
);

// Pre-save middleware to auto-increment supplierNumber
supplierSchema.pre('save', async function() {
  if (!this.supplierNumber) {
    const counter = await Counter.findByIdAndUpdate(
      'supplierNumber',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    if (counter) {
      this.supplierNumber = counter.seq;
    }
  }
});

export interface SupplierDocument extends Document {
  supplierNumber: number;
  name: string;
  phone: string;
  email: string;
  supplierType?: mongoose.Types.ObjectId;
  accountDetails: string;
  isPaid: boolean;
  notes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Supplier = mongoose.model<SupplierDocument>('Supplier', supplierSchema);

export default Supplier;
