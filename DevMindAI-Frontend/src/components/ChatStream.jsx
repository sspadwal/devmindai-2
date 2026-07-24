import React, { useState, useEffect, useRef } from "react"

function AssistantAvatar() {
  return (
    <div className="msg-avatar assistant-avatar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </div>
  )
}

function UserAvatar() {
  return (
    <div className="msg-avatar user-avatar">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  )
}

export default function ChatStream({ chatHistory }) {
  const streamEndRef = useRef(null)
  const [copiedIndex, setCopiedIndex] = useState(null)

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleDownload = (imageUrl, tab) => {
    if (!imageUrl) return
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `devmindai_${tab}_${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderAssistantContent = (msg, index) => {
    if (msg.isLoading) {
      return (
        <div className="thinking-indicator">
          <span className="thinking-dot" />
          <span className="thinking-dot" />
          <span className="thinking-dot" />
        </div>
      )
    }

    if (msg.isError) {
      return <div className="msg-error">{msg.text}</div>
    }

    switch (msg.type) {
      case "generate-image":
      case "remove-background":
      case "object-remover":
        return (
          <div className="msg-image-result">
            <img src={msg.result} alt="AI result" className="result-image" />
            <button className="result-action-btn" onClick={() => handleDownload(msg.result, msg.type)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download
            </button>
          </div>
        )

      case "generate-title": {
        const titles =
          typeof msg.result === "string"
            ? msg.result.split("\n").filter((t) => t.trim())
            : [msg.result]
        return (
          <div className="msg-titles">
            <div className="msg-result-header">
              <span>Suggested Titles</span>
              <button className="copy-btn" onClick={() => handleCopy(msg.result, index)}>
                {copiedIndex === index ? "Copied!" : "Copy all"}
              </button>
            </div>
            <ul className="titles-list">
              {titles.map((title, idx) => {
                const cleanedTitle = title.replace(/^\d+\.\s*/, "")
                return (
                  <li key={idx} className="title-item">
                    <span>{cleanedTitle}</span>
                    <button
                      className="copy-icon-btn"
                      onClick={() => handleCopy(cleanedTitle, `${index}-${idx}`)}
                      aria-label="Copy title"
                    >
                      {copiedIndex === `${index}-${idx}` ? "✓" : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      }

      case "generate-article":
        return (
          <div className="msg-article">
            <div className="msg-result-header">
              <span>Generated Article</span>
              <button className="copy-btn" onClick={() => handleCopy(msg.result, index)}>
                {copiedIndex === index ? "Copied!" : "Copy article"}
              </button>
            </div>
            <div className="article-body">
              {msg.result.split("\n").map((para, idx) => {
                if (para.startsWith("#")) {
                  const level = para.match(/^#+/)[0].length
                  const text = para.replace(/^#+\s*/, "")
                  if (level === 1) return <h1 key={idx}>{text}</h1>
                  if (level === 2) return <h2 key={idx}>{text}</h2>
                  return <h3 key={idx}>{text}</h3>
                }
                return para.trim() ? <p key={idx}>{para}</p> : <br key={idx} />
              })}
            </div>
          </div>
        )

      default:
        return <div className="msg-text">{msg.text}</div>
    }
  }

  return (
    <div className="messages-list">
      {chatHistory.map((msg, index) => (
        <div key={index} className={`message-row ${msg.sender}`}>
          {msg.sender === "assistant" && <AssistantAvatar />}

          <div className="message-content">
            {msg.sender === "user" ? (
              <div className="user-message-bubble">
                <p className="msg-text">{msg.text}</p>
                {msg.meta && (
                  <div className="msg-meta">
                    {msg.meta.tool && <span className="meta-tag">{msg.meta.tool}</span>}
                    {msg.meta.style && <span className="meta-tag">{msg.meta.style}</span>}
                    {msg.meta.fileName && <span className="meta-tag">{msg.meta.fileName}</span>}
                    {msg.meta.object && <span className="meta-tag">Remove: {msg.meta.object}</span>}
                  </div>
                )}
              </div>
            ) : (
              renderAssistantContent(msg, index)
            )}
          </div>

          {msg.sender === "user" && <UserAvatar />}
        </div>
      ))}
      <div ref={streamEndRef} />
    </div>
  )
}
