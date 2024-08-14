import Groq from "groq-sdk";

const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY,
    dangerouslyAllowBrowser: true});

export async function getRecipeRecommendations(pantryItems) {
  const itemList = pantryItems.map(item => item.name).join(', ');
  console.log("Item List:", itemList);
  const prompt = `Generate 5 recipe recommendations based on the following ingredients: ${itemList}. Separate each recipe (with ingridients and steps) with three characters '%%%'. these characters should be placed before each recipe title`;

  try{
    const response = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-8b-8192",
  });

  console.log("Groq API Response:", response);
    return response;
  } catch (error) {
    console.error("Error generating recipe recommendations:", error);
    return null;
  }
}
