import Groq from "groq-sdk";

const groq = new Groq({ 
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export default async function handler(req, res) {
  const { pantryItems } = req.body;
  const itemList = pantryItems.map(item => item.name).join(', ');
  const prompt = `Generate 5 recipe recommendations based on the following ingredients: ${itemList}. Separate each recipe (with ingredients and steps) with three characters '%%%'. These characters should be placed before each recipe title`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error generating recipe recommendations:", error);
    return res.status(500).json({ error: 'Failed to generate recipe recommendations' });
  }
}
