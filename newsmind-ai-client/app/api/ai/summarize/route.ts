import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const sentimentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sentiment: { 
      type: Type.STRING, 
      enum: ["positive", "neutral", "negative"],
      description: "Overall sentiment of the text." 
    },
    score: { 
      type: Type.NUMBER, 
      description: "Sentiment confidence score between 0 and 1." 
    },
    confidence: { 
      type: Type.NUMBER, 
      description: "AI analysis confidence between 0 and 1." 
    },
  },
  required: ["sentiment", "score", "confidence"],
};

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the sentiment of this text:\n\n${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: sentimentSchema,
      },
    });

    const data = JSON.parse(response.text || "{}");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Gemini Sentiment Error:", error);
    return NextResponse.json({ error: "Failed to analyze sentiment" }, { status: 500 });
  }
}