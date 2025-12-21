declare module 'mongoose-sequence' {
  import { Mongoose, Schema } from 'mongoose';

  interface SequenceOptions {
    inc_field: string;
    id?: string;
    reference_fields?: string[];
    start_seq?: number;
  }

  type PluginFunction = (schema: Schema, options: SequenceOptions) => void;

  export default function (mongoose: Mongoose): {
    plugin: PluginFunction;
  };
}