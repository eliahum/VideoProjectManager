import mongoose, { Document, CallbackError } from 'mongoose';
import { Counter } from './counter.model';

// Customer Schema
const customerSchema = new mongoose.Schema(
    {
        customerId: { type: Number, unique: true },
        name: { type: String },
        companyName: { type: String, required: true },
        email: { type: String},
        phone: { type: String, required: true },
        address: { type: String },
        leadId: { type: Number },
        howFoundUs: { type: String },
        notes: { type: String },
    },
    { timestamps: true }
);

// Pre-save middleware to auto-increment customerId
customerSchema.pre('save', async function() {
  if (!this.customerId) {
    const counter = await Counter.findByIdAndUpdate(
      'customerId',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    if (counter) {
      this.customerId = counter.seq;
    }
  }
});

export interface CustomerDocument extends Document {
    customerId: number;
    name?: string;
    companyName: string;
    email: string;
    phone: string;
    address?: string;
    leadId?: number;
    howFoundUs?: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const Customer = mongoose.model<CustomerDocument>('Customer', customerSchema);


export default Customer;