import React from "react"

const STYLES = [
  { value: "cartoon", label: "Cartoon" },
  { value: "realistic", label: "Realistic" },
  { value: "3d-render", label: "3D Render" },
  { value: "anime", label: "Anime" },
  { value: "cyberpunk", label: "Cyberpunk" },
]

export default function ToolParameters({ activeTab, imageStyle, setImageStyle }) {
  if (activeTab !== "generate-image") return null

  return (
    <div className="style-chips">
      <span className="style-chips-label">Style</span>
      <div className="style-chips-row">
        {STYLES.map((s) => (
          <button
            key={s.value}
            type="button"
            className={`style-chip ${imageStyle === s.value ? "active" : ""}`}
            onClick={() => setImageStyle(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
