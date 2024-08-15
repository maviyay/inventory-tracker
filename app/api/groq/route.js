import Groq from "groq-sdk";
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { pantryItems } = body;
    const itemList = pantryItems.map(item => item.name).join(', ');
    const prompt = `Generate 5 recipe recommendations based on the following ingredients: ${itemList}. Separate each recipe (with ingredients and steps) with three characters '%%%'. These characters should be placed before each recipe title`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating recipe recommendations:", error);
    return NextResponse.json({ error: 'Failed to generate recipe recommendations' }, { status: 500 });
  }
}
