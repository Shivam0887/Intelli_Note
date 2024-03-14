import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);
export const modal = genAI.getGenerativeModel({ model: "gemini-pro" });

export const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});
