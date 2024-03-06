import { model, Schema, InferSchemaType, Types, models } from "mongoose";

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  documents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.index({ userId: 1 }, { unique: true });

const docSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  parentDocument: {
    type: Schema.Types.ObjectId,
    ref: "Document",
  },
  content: String,
  isArchived: Boolean,
  coverImage: String,
  icon: String,
  isPublished: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

docSchema.index({ authorId: 1, parentDoc: 1 });

export type UserType = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};
export type DocType = InferSchemaType<typeof docSchema> & {
  _id: Types.ObjectId;
};

export const User = models.User || model("User", userSchema);
export const Document = models.Document || model("Document", docSchema);
