import { api } from "./api"

export const aiService = {
  /**
   * Generates an image from a prompt and style preset.
   */
  generateImage: async ({ prompt, style }) => {
    try {
      const response = await api.post("/ai/generate-image", {
        prompt: prompt,
        style: style || "cartoon"
      })
      return response?.data?.response || response?.data?.image || null
    } catch (error) {
      console.error("aiService.generateImage failed:", error)
      throw error
    }
  },

  /**
   * Removes specific objects from an image based on a descriptive prompt.
   */
  objectRemover: async ({ image, prompt }) => {
    try {
      const formData = new FormData()
      formData.append("image", image)
      formData.append("object", prompt)

      const response = await api.post("/ai/remove-image-object", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response?.data?.image || response?.data?.response || null
    } catch (error) {
      console.error("aiService.objectRemover failed:", error)
      throw error
    }
  },

  /**
   * Generates a blog post title from a topic prompt.
   */
  generateTitle: async ({ prompt }) => {
    try {
      const response = await api.post("/ai/generate-blog-title", { prompt })
      return response?.data?.response || null
    } catch (error) {
      console.error("aiService.generateTitle failed:", error)
      throw error
    }
  },

  /**
   * Generates a full markdown-styled blog article from a prompt outline.
   */
  generateArticle: async ({ prompt }) => {
    try {
      const response = await api.post("/ai/generate-article", { prompt })
      return response?.data?.response || null
    } catch (error) {
      console.error("aiService.generateArticle failed:", error)
      throw error
    }
  },

  /**
   * Removes the background from an image.
   */
  removeBackground: async ({ image }) => {
    try {
      const formData = new FormData()
      formData.append("image", image)

      const response = await api.post("/ai/remove-background", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response?.data?.image || response?.data?.response || null
    } catch (error) {
      console.error("aiService.removeBackground failed:", error)
      throw error
    }
  }
}
