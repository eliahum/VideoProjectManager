
import mongoose, { Document } from 'mongoose';

// Lead Schema
const leadSchema = new mongoose.Schema(
  {
    // id removed, use default _id
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    status: { type: String, default: 'חדש' },
    source: { type: String }, // איך הגיע אלי
  freeText:{ type: String },
  companyName: { type: String }
  
  },
  { timestamps: true }
);

// pre-save middleware removed, use default _id

export interface LeadDocument extends Document {
  name: string;
  email?: string;
  phone?: string;
  status: string;
  source: string; // איך הגיע אלי
  freeText: string;
  companyName: string;  
  createdAt?: Date;
  updatedAt?: Date;
}

const Lead = mongoose.model<LeadDocument>('Lead', leadSchema);

// Counter schema and model removed
export default Lead;