import mongoose from 'mongoose';

export interface MessageType extends mongoose.Document {
  conversationId: mongoose.Schema.Types.ObjectId | string;
  senderId: string;
  body: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

const messageSchema = new mongoose.Schema<MessageType>(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Conversation',
    },
    senderId: {
      type: String,
      required: true,
      ref: 'User',
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const messageModel = mongoose.model<MessageType>('Message', messageSchema);
