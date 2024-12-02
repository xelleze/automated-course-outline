import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const client = new HfInference(process.env.HUGGINGFACE_API_KEY || "");

export async function POST(req: Request) {
    try {
      const { section, keywords } = await req.json();
  
      if (!section || !keywords) {
        console.error("Missing parameters:", { section, keywords });
        return NextResponse.json(
          { success: false, error: "Section and keywords are required." },
          { status: 400 }
        );
      }
  
      const prompt = `Create detailed content course for the section "${section}" using these keywords ${keywords.join(
        ", "
      )}.`;
  
      console.log("Sending prompt to Hugging Face:", prompt);
  
      const chatCompletion = await client.chatCompletion({
        model: "Qwen/QwQ-32B-Preview",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
      });
  
      console.log("Hugging Face API response:", chatCompletion);
  
      const content = chatCompletion.choices[0]?.message?.content || "No content generated.";
  
      return NextResponse.json({ success: true, content });
    } catch (error) {
      console.error("Error in Hugging Face API call:", error);
      return NextResponse.json(
        { success: false, error: "Failed to generate content." },
        { status: 500 }
      );
    }
  }