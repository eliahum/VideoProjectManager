import mongoose, { Document, CallbackError } from 'mongoose';

// Counter Schema - shared across all models

interface CounterDocument extends Document {
  seq: number;
}


// Customer Schema
const customerSchema = new mongoose.Schema(
    {
        // id removed, use default _id
        name: { type: String, required: true },
        email: { type: String},
        phone: { type: String, required: true },
        address: { type: String },
        leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
    },
    { timestamps: true }
);

export interface CustomerDocument extends Document {
    name: string;
    email: string;
    phone: string;
    address?: string;
    leadId?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const Customer = mongoose.model<CustomerDocument>('Customer', customerSchema);


export default Customer;