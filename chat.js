export default async function handler(req, res) {
    const { message, systemPrompt } = req.body;

    try {
        const apiRes = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        { role: "user", parts: [{ text: systemPrompt + "\n\nUsuário: " + message }] }
                    ]
                })
            }
        );

        const data = await apiRes.json();

        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } catch (err) {
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
}
