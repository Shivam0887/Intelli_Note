import { z } from "zod";
import { privateProcedure } from "@/app/_server/trpc";
import { TRPCError } from "@trpc/server";
import { DocType, Document, User, UserType } from "@/lib/models/dbModels";
import { Types } from "mongoose";
import { connectToDB } from "@/lib/dbConnection";

export const archieve = privateProcedure
  .input(z.object({ documentId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { documentId } = input;

    try {
      connectToDB();
      const user = await User.findOne<UserType | null | undefined>({ userId });
      if (user === null) throw new Error("user NOT_FOUND");

      const existingDocument = await Document.findById<DocType | null>(
        documentId
      );

      if (existingDocument === null) {
        throw new Error("document NOT_FOUND");
      }

      if (
        existingDocument &&
        existingDocument.authorId.toString() !== user?._id.toString()
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const recursiveArchive = async (documentId: string) => {
        const children = await Document.find<DocType>({
          authorId: user?._id,
          parentDocument: documentId,
        });

        for (const child of children) {
          await Document.findByIdAndUpdate(child._id, {
            $set: {
              isArchived: true,
            },
          });

          await recursiveArchive(child._id.toString());
        }
      };

      await Document.findByIdAndUpdate(documentId, {
        $set: {
          isArchived: true,
        },
      });

      await recursiveArchive(documentId);
    } catch (error: any) {
      console.log("Error while deleting documents:", error?.message);
      throw new Error(error?.message);
    }
  });

export const getSidebar = privateProcedure
  .input(
    z.object({
      parentDocument: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { parentDocument } = input;

    try {
      connectToDB();

      const user = await User.findOne<UserType | null>({ userId });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const documents = await Document.find<DocType>(
        {
          authorId: user?._id,
          parentDocument,
          isArchived: false,
        },
        {},
        { sort: { createdAt: "asc" } }
      );

      return documents;
    } catch (error: any) {
      console.log("Error while accessing documents:", error?.message);
      throw new Error(error?.message);
    }
  });

export const create = privateProcedure
  .input(
    z.object({
      title: z.string(),
      parentDocument: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { title, parentDocument } = input;

    try {
      connectToDB();

      const user = await User.findOne<UserType | null>({ userId });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const document: DocType | undefined = await Document.create({
        title,
        authorId: user._id!,
        parentDocument:
          parentDocument !== undefined
            ? new Types.ObjectId(parentDocument)
            : parentDocument,
        isArchived: false,
        isPublished: false,
      });

      await User.findByIdAndUpdate(user._id, {
        $push: {
          documents: document?._id,
        },
      });

      return document;
    } catch (error: any) {
      console.log("Error while creating document:", error?.message);
      throw new Error(error?.message);
    }
  });
