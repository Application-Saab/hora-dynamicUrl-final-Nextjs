export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, context } = req.body;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing query" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI API key is not configured" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a friendly product recommendation assistant for an event decoration website. " +
              "Offer short, helpful product suggestions and mention relevant decoration categories or event types.",
          },
          {
            role: "user",
            content: `User asked: "${query}". Context: ${context || "none"}.`,
          },
        ],
        max_tokens: 300,
        temperature: 0.75,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error", data);
      return res.status(response.status).json({ error: data.error?.message || "OpenAI request failed" });
    }

    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ text });
  } catch (error) {
    console.error("OpenAI request failed:", error);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
}