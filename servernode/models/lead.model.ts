
import mongoose, { Document } from 'mongoose';
import { Counter } from './counter.model';

// Lead Schema
const leadSchema = new mongoose.Schema(
  {
    leadId: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    statusNumber: { type: Number, default: 1 },
    source: { type: String }, // איך הגיע אלי
  freeText:{ type: String },
  companyName: { type: String },
  priceQuote: { type: String } // קישור להצעת מחיר ב-Google Drive
  
  },
  { timestamps: true }
);

// Pre-save middleware to auto-increment leadId
leadSchema.pre('save', async function() {
  if (!this.leadId) {
    const counter = await Counter.findByIdAndUpdate(
      'leadId',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    if (counter) {
      this.leadId = counter.seq;
    }
  }
});

export interface LeadDocument extends Document {
  leadId: number;
  name: string;
  email?: string;
  phone?: string;
  statusNumber: number;
  source: string; // איך הגיע אלי
  freeText: string;
  companyName: string;
  priceQuote?: string; // קישור להצעת מחיר ב-Google Drive
  createdAt?: Date;
  updatedAt?: Date;
}

const Lead = mongoose.model<LeadDocument>('Lead', leadSchema);

export default Lead;