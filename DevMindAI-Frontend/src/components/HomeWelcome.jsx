import React from "react"

const TOOLS = [
  {
    id: "generate-article",
    icon: "✍️",
    label: "Articles",
    description: "Write SEO-ready blog posts from any topic",
    suggestions: [
      "Write a beginner's guide to machine learning",
      "Create an article on sustainable living tips",
    ],
  },
  {
    id: "generate-title",
    icon: "💡",
    label: "Titles",
    description: "Generate catchy headlines for your content",
    suggestions: [
      "Suggest titles for a tech startup blog",
      "Headlines about productivity and focus",
    ],
  },
  {
    id: "generate-image",
    icon: "🎨",
    label: "Images",
    description: "Turn text descriptions into artwork",
    suggestions: [
      "A mountain landscape at golden hour, photorealistic",
      "Minimalist logo for a coffee brand",
    ],
  },
  {
    id: "remove-background",
    icon: "✂️",
    label: "Remove BG",
    description: "Make any image background transparent",
    suggestions: [],
  },
  {
    id: "object-remover",
    icon: "🧹",
    label: "Remove Object",
    description: "Erase unwanted objects from photos",
    suggestions: [],
  },
]

export { TOOLS }

export default function HomeWelcome({ activeTab, onSelectTool, onSuggestionClick }) {
  const activeTool = TOOLS.find((t) => t.id === activeTab) || TOOLS[0]

  return (
    <div className="home-welcome">
      <div className="home-hero">
        <div className="home-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="home-title">What would you like to create?</h1>
        <p className="home-subtitle">
          Pick a tool, describe what you need, and DevMind AI will handle the rest.
        </p>
      </div>

      {(activeTab === "remove-background" || activeTab === "object-remover") && (
        <p className="home-hint">
          {activeTab === "remove-background"
            ? "Upload an image using the attach button below, then hit send."
            : "Upload an image and describe the object to remove, then hit send."}
        </p>
      )}
    </div>
  )
}
