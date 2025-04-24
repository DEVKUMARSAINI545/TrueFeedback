
// import { GoogleGenAI } from "@google/genai";


// const ai = new GoogleGenAI({ apiKey: "AIzaSyCyiy-CVQbG5cJ4jfEDCv6ym5C9kU0A98g" });

// export async function GET(req:Request)
// {
//     try {
//              const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be seprated by '||' . These questions are for an anonymous social messaging platform, like Qooh.me and should be suitable for a diverse audience . Avoid personal or sensitive toics, focusing instead on universal themse that encourage friendly interaction. for example , your output should be structured like this: 'What's a hobby you've recently started ?|| If you could have dinner with any historical figure, Who would it be ? || What's simple thing that make you happy?. Ensure the questions are intriguing , foster curiosity and contribute to a positive and welcoming converstation enviroment."
//         const response = await ai.models.generateContentStream({
//             model:"gemini-2.0-flash",
//             contents:prompt,
//         })
//         const result:string[] =[];
//         for await (const chunk of response)
//         {
//             result.push(chunk.text as string)
//         }
//         return Response.json({content:result.join('')})
//     } catch (error) {
//         return Response.json({message:error})
//     }
// }


// app/api/suggest/route.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyCyiy-CVQbG5cJ4jfEDCv6ym5C9kU0A98g",
});

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const prompt = `Give me 3 casual and emotionally engaging questions that users can send anonymously to each other on a feedback or social Q&A platform.
These should be short, natural, and friendly—things like “What are you doing?”, “What do you like about me?”, or “What do you want from me?”.
Return them as a single string separated by '||'. Avoid anything too deep, personal, or inappropriate. Keep the tone light and conversational.`;

    

    const messages: string[] = [];

    // Call Gemini 4 times for different outputs
    for (let i = 0; i < 4; i++) {
      const response = await ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      let result = "";
      for await (const chunk of response) {
        result += chunk.text || "";
      }

      messages.push(result.trim());
    }

    return Response.json({ messages });
  } catch (error: any) {
    console.error("Error generating content:", error);
    return Response.json({ message: error?.message || "Something went wrong" }, { status: 500 });
  }
}
