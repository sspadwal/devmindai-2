import * as aiService from './ai.services.js'

const generateArticle = async (req, res) => {
    try {
        const { prompt } = req.body;
        const userId = req.auth?.userId || req.userId;
        const response = await aiService.generateArticle(prompt, userId);
        return res.status(200).json({ success: true, response: response })
    }
    catch (error) {
        console.log("MESSAGE:", error.message);
    }
}

const generateBlogtitle = async (req, res) => {
    try {

        const { prompt } = req.body;
        const userId = req.auth?.userId || req.userId;
        const response = await aiService.generateBlogtitle(prompt, userId);
        return res.status(200).json({ success: true, response: response })
    }
    catch (error) {
        console.log("MESSAGE:", error.message)
    }
}

const generateImage = async (req, res) => {
    try {
        const { prompt, type } = req.body;
        const userId = req.auth?.userId || req.userId;
        const response = await aiService.generateImage(prompt, type, userId);
        return res.status(200).json({ success: true, response: response })

    } catch (error) {
        console.log(error)
    }
}

const removeImageObject = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image received"
            });
        }

        const object = req.body.object;
        const originalImage = req.file.buffer;
        const userId = req.auth?.userId || req.userId;
        const response = await aiService.removeImageObject(object, originalImage, userId);
        res.status(200).json({
            success: true,
            image: response
        })
    }
    catch (error) {
        console.log(error)
    }

}

const removeBackground = async (req, res) => {
    try {

        const orignalImage = req.file.buffer;
        const userId = req.auth?.userId || req.userId;
        const response = await aiService.removeBackground(orignalImage, userId)
        res.status(200).json({ message: true, image: response });
    }
    catch (error) {
        console.log(error)
    }
}

export { generateArticle, generateBlogtitle, generateImage, removeImageObject, removeBackground }