import { z } from "zod";
import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { UserType, User } from "@/lib/models/dbModels";

import { genAI, openAI } from "@/lib/ai";

const messageSchema = z.object({
  query: z.string(),
  type: z.enum(["summarize", "explain", "translate"]),
  lang: z.enum([
    "English",
    "Hindi",
    "French",
    "Chinese",
    "Korean",
    "Japanese",
    "Russian",
    "German",
  ]),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dbUser = await User.findOne<UserType | null>({ userId: user.id });

  if (!dbUser) return new NextResponse("user not found", { status: 404 });

  try {
    const { query, lang, type } = messageSchema.parse(body);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.0-pro",
    });

    let prompt = "";
    if (type === "explain") {
      prompt = `Explain the following in detail: \n ${query}`;
    } else if (type === "summarize") {
      prompt = `Summarize the following: \n ${query}`;
    } else {
      prompt = `Translate the language of the following query into ${lang} language: \n ${query}`;
    }

    const customPrompt = `Prompt: ${prompt} \n\n
        Generate the response using proper HTML tags and indentations that looks good even without CSS (don't include body or html tags in the response, include only required tags).
    `;

    // const result = (
    //   await openAI.chat.completions.create({
    //     model: "gpt-3.5-turbo-0125",
    //     temperature: 0,
    //     messages: [
    //       {
    //         role: "system",
    //         content: customPrompt,
    //       },
    //       {
    //         role: "user",
    //         content: customPrompt,
    //       },
    //     ],
    //   })
    // ).choices[0].message.content;

    const result = (await model.generateContent(customPrompt)).response.text();
    return new NextResponse(result, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return new NextResponse("Internal server error", { status: 501 });
  }
}
