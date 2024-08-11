import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

export async function getRecipeRecommendations(pantryItems) {
  const itemList = pantryItems.map(item => item.name).join(', ');
  const prompt = `Generate at least 5 recipe recommendations based on the following ingredients: ${itemList}. Provide a list of recipes that use these ingredients.`;

  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-8b-8192",
  });
}
