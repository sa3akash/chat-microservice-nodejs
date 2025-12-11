import mongoose from 'mongoose';

export interface UserDocument {
  _id: string;
  email: string;
  displayName: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    _id: {
      type: String, // use String type for the custom ID
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Users = mongoose.model<UserDocument>('Users', UserSchema, 'users');
