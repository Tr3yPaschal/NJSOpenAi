import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_APIK_KEY
});

let sessionConversations = {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed pleae use POST" });
  }

  try {
    const prompt = req.body.prompt;
    const sessionId = req.body.sessionId;

    let messages = [
      {
        role: "system",
        content:
          "You are a platfrom engineer / technical product manager for Hilton. You manage work for a tem of developer working on the Hilton Honors native iOS and Android apps. Your writting should be clear concise and to the point. You should never make assumptions. You always use the information given and suggest more research or clarification if something is not clear. Always write on a level that is understandable by a layman",
      },
    ];

    if (sessionId && sessionConversations[sessionId]) {
      messages = [...sessionConversations[sessionId]];
    }

    messages.push({ role: "user", content: prompt });
    sessionConversations[sessionId] = messages;

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", content: prompt}],
    });
    console.log(gptResponse.choices[0].message);

  
    const botMessage = gptResponse.choices[0].message;
    sessionConversations[sessionId].push({
      role: "assistant",
      content: botMessage,
     
    })
    console.log("botMessage" , botMessage)

    return res.status(200).json({
      message: "Success",
      response: botMessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}