import OpenAI from "openai";
import "dotenv/config";
import { uploadBuffer } from "../config/cloudinary.js";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});


const aiSDK = {
    textGenerationSDK: async function (enhancedPrompt) {
        try {

            const response = await AI.chat.completions.create({
                model: "gemini-2.5-flash",
                messages: [
                    {
                        role: "user",
                        content: enhancedPrompt,
                    },
                ],
                temperature: 0.7,
            });

            return await response.choices[0].message.content;
        }
        catch (error) {
            console.log(error)
        }
    },

    imageGenerationSDK: async function (enhancedPrompt) {
        try {

            const form = new FormData();

            form.append("prompt", enhancedPrompt);

            const response = await fetch(
                "https://clipdrop-api.co/text-to-image/v1",
                {
                    method: "POST",
                    headers: {
                        "x-api-key": process.env.CLIPDROP_API,
                    },
                    body: form,
                }
            );
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await Buffer.from(arrayBuffer);
            return buffer;
        }
        catch (error) {
            console.log(error)
        }
    },

}

export { AI, aiSDK };