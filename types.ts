import { DocType } from "./lib/models/dbModels";

export type ModifiedDocType = Omit<
  DocType,
  "_id" | "parentDocument" | "authorId" | "createdAt" | "updatedAt"
> & {
  _id: string;
  authorId: string;
  parentDocument?: string | null | undefined;
  createdAt: string;
  updatedAt: string;
};
