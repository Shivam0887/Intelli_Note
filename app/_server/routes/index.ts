import { currentUser } from "@clerk/nextjs";
import { publicProcedure } from "../trpc";
import { connectToDB } from "@/lib/dbConnection";
import { User, UserType } from "@/lib/models/dbModels";
import { TRPCError } from "@trpc/server";

export const authCallback = publicProcedure.query(async () => {
  const user = await currentUser();
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

  try {
    connectToDB();
    const dbUser = await User.findOne<UserType | null>({ userId: user.id });

    if (!dbUser) {
      await User.create({
        userId: user.id,
        name: user.firstName!,
        email: user.emailAddresses[0].emailAddress,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.log("Error user creation ", error?.message);
    return { success: false };
  }
});
