export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Sadece POST isteği destekleniyor." });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "Sen ChatBLC adlı bir yapay zekasın. Türkçe konuş ve net cevap ver." },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: "API Hatası: " + data.error.message });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    return res.status(500).json({ reply: "Sunucu hatası: " + err.message });
  }
}
