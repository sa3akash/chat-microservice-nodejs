import mongoose from 'mongoose';

export interface Conversation extends mongoose.Document {
  title: string | null;
  participantIds: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  lastMessageAt?: Date | string | null;
  lastMessagePreview?: string | null;
}

const conversationSchema = new mongoose.Schema<Conversation>(
  {
    title: { type: String, required: false },
    participantIds: { type: [String], required: true },
    lastMessageAt: { type: Date, required: false },
    lastMessagePreview: { type: String, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const conversationModel = mongoose.model<Conversation>('Conversation', conversationSchema);
