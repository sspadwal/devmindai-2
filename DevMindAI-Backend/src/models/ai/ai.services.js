import { AI, aiSDK } from "../../common/aiConf/ai_configuration.js";
import { db } from './../../common/db/db.js'
import { schema } from './../../common/db/schema.js'
import { uploadBuffer } from "../../common/config/cloudinary.js";
import upload from "../../common/config/multer.js";
import { imageTransform, backgroundRemover } from "../../common/config/cloudinary.js";
import { promptsObj } from './../../common/prompts/prompts.js'

const generateArticle = async (prompt, userId) => {
    try {
        const enhancedPrompt = promptsObj.articleGeneration(prompt)
        const output = await aiSDK.textGenerationSDK(enhancedPrompt);
        const insertedData = await db
            .insert(schema)
            .values({
                user_id: userId || "anonymous",
                prompt: enhancedPrompt,
                output: output,
                type: "article",
            })
            .returning();
        return output;
    } catch (error) {
        console.log(error)
    }
};

const generateBlogtitle = async (prompt, userId) => {
    try {
        const enhancedPrompt = await promptsObj.blogtitleGeneration(prompt);
        const output = await aiSDK.textGenerationSDK(enhancedPrompt);
        const insertedData = await db
            .insert(schema)
            .values({
                user_id: userId || "anonymous",
                prompt: enhancedPrompt,
                output: output,
                type: "blog-title",
            })
            .returning();
        return output;
    }
    catch (error) {
        console.log(error);
    }
}

const generateImage = async (prompt, type="gibali", userId) => {
    try {
        const enhancedPrompt = await promptsObj.imageGeneration(prompt, type);
        const buffer = await aiSDK.imageGenerationSDK(enhancedPrompt);
        const uploadedImage = await uploadBuffer(buffer);
        const insertedData = await db
            .insert(schema)
            .values({
                user_id: userId || "anonymous",
                prompt: enhancedPrompt,
                output: uploadedImage.secure_url,
                type: "image",
            })
            .returning();
        return uploadedImage.secure_url;
    } catch (error) {
        console.log(error)
    }
}

const removeImageObject = async (object, imageBuffer, userId) => {
    try {
        const response = await uploadBuffer(imageBuffer)
        const output = await imageTransform(object, response.public_id)
        const insertedData = await db
            .insert(schema)
            .values({
                user_id: userId || "anonymous",
                prompt: `remove ${object}`,
                output: output,
                type: "image",
            })
            .returning();
        return output;
    }
    catch (error) {
        console.log(error)
    }
}

const removeBackground = async (imageBuffer, userId) => {
    try {
        const output = await backgroundRemover(imageBuffer)
        const insertedData = await db
            .insert(schema)
            .values({
                user_id: userId || "anonymous",
                prompt: "remove background",
                output: output.secure_url,
                type: "image",
            })
            .returning();
        return output.secure_url;
    }
    catch (error) {
        console.log(error)
    }
}

export { generateArticle, generateBlogtitle, generateImage, removeImageObject, removeBackground };