const promptsObj = {

    articleGeneration: function (prompt) {
        return `
            Write a comprehensive, well-structured article about "${prompt}". 
                
                Requirements:
                - Target length: approximately 100 words
                - Include an engaging introduction
                - Use clear headings and subheadings
                - Provide detailed explanations and examples
                - Include a strong conclusion
                - Write in a professional, informative tone
                - Ensure the article is complete and not cut off
                
                Article topic: ${prompt}`
    },
    blogtitleGeneration: function (prompt) {
        return `You are an expert SEO content strategist and copywriter.

                Generate 10 blog post titles for the topic: "${prompt}"

                Requirements:
                - Titles must be SEO-friendly and include the primary keyword "${prompt}" naturally (or a close variation of it)
                - Keep each title between 50-60 characters where possible (ideal for SEO/search snippets)
                - Use a mix of formats: how-to, listicle, question-based, guide, and comparison
                - Titles should be clear, specific, and benefit-driven (avoid vague or clickbait-y phrasing)
                - Avoid unnecessary words, filler, or repetition
                - No special characters, emojis, or excessive punctuation
                - Each title should sound natural and human, not robotic
                - Output only the 10 titles as a numbered list, nothing else`
    },
    imageGeneration: function (prompt, type) {
        return `
                Create an exceptional ${type} image of ${prompt}.

                Faithfully represent the subject while enriching it with visually compelling details that naturally enhance the scene without altering the original concept. Place the subject within a realistic, contextually appropriate environment featuring rich textures, balanced composition, and immersive depth. Use a professional cinematic perspective with a carefully chosen camera angle that best showcases the subject.

                Apply physically accurate lighting with realistic shadows, reflections, ambient occlusion, global illumination, volumetric lighting, atmospheric perspective, and natural environmental effects when appropriate. Ensure harmonious color grading, lifelike materials, intricate textures, smooth gradients, and realistic surface details.

                Construct a visually balanced composition with distinct foreground, middle ground, and background elements to create scale and depth. Add subtle environmental storytelling, realistic weather or atmospheric conditions where suitable, and fine details that elevate realism or artistic quality without introducing unrelated objects.

                Adapt every visual element to the requested {{STYLE}}, including lighting, colors, textures, rendering techniques, and artistic characteristics. Preserve anatomical accuracy, natural proportions, and coherent spatial relationships where applicable.

                Produce a clean, highly refined image with exceptional clarity, crisp focus, rich detail, dynamic range, and premium rendering quality. Avoid distortion, artifacts, pixelation, oversaturation, excessive blur, noise, duplicate objects, cropped subjects, unwanted text, logos, watermarks, borders, timestamps, signatures, UI elements, or any distracting visual imperfections unless explicitly requested.

                The final image should be visually striking, immersive, professionally composed, and faithfully represent {{PROMPT}} in the {{STYLE}} style with world-class artistic and technical quality.
`;
    }
}

export { promptsObj };