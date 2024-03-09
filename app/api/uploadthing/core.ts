import { connectToDB } from "@/lib/dbConnection";
import { Document, User } from "@/lib/models/dbModels";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  coverImageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await currentUser();

      if (!user) throw new UploadThingError("Unauthorized");

      const url = req.headers.get("referer");
      const documentId = url?.split("/")[4];

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id, documentId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      const { documentId, userId } = metadata;
      connectToDB();
      const user = await User.findOne({ userId });
      await Document.findOneAndUpdate(
        { _id: documentId, authorId: user?._id },
        {
          $set: {
            coverImage: file.url,
          },
        }
      );

      return { userId: metadata.userId, documentId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
