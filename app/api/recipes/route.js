import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.PANTRY_PRO_GROQ_KEY, // NOT exposed to frontend
});

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const { inventory:pantryItems } = body;
    if (!pantryItems || !Array.isArray(pantryItems)) {
      return Response.json({ error: "Invalid pantryItems array" }, { status: 400 });
    }

    const itemList = pantryItems.map(item => item.name).join(', ');
    console.log("Items for Groq:", itemList);

    const prompt = `Generate 5 recipe recommendations based on the following ingredients: ${itemList}. Separate each recipe (with ingredients and steps) with three characters '%%%'. These characters should be placed before each recipe title.`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    console.log("Groq response:", response);

    const message = response.choices?.[0]?.message?.content || "No response.";
    return Response.json({ content: message });
  } catch (error) {
    console.error("Groq API Error:", error);
    return Response.json({ error: "Internal server error: " + error.message }, { status: 500 });
  }
}
