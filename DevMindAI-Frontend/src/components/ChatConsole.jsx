import React, { useState, useEffect, useRef, useMemo } from "react"
import { useAuth, useClerk, useUser } from "@clerk/react"
import HomeWelcome, { TOOLS } from "./HomeWelcome"
import ToolParameters from "./ToolParameters"
import ChatStream from "./ChatStream"
import { aiService } from "../services/ai"
import { loadChat, saveChat, clearChat } from "../utils/chatStorage"

const PLACEHOLDERS = {
  "generate-article": "Describe the article topic or outline...",
  "generate-title": "What is your blog or content about?",
  "generate-image": "Describe the image you want to create...",
  "remove-background": "Optional: add notes about your image...",
  "object-remover": "Describe the object you want to remove...",
}

const LAST_USER_STORAGE_KEY = "devmind_last_signed_in_user"

export default function ChatConsole() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const effectiveUserId = user?.id || localStorage.getItem(LAST_USER_STORAGE_KEY) || "guest"
  const [activeTab, setActiveTab] = useState("generate-article")
  const [prompt, setPrompt] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imageStyle, setImageStyle] = useState("cartoon")
  const [loading, setLoading] = useState(false)
  const [authNotice, setAuthNotice] = useState(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)
  const skipNextSave = useRef(false)
  const signedInRef = useRef(isSignedIn)
  const lastKnownUserIdRef = useRef(user?.id || null)
  const [chatHistory, setChatHistory] = useState([])

  const hasConversation = chatHistory.some((m) => m.sender === "user")

  useEffect(() => {
    if (user?.id) {
      lastKnownUserIdRef.current = user.id
      localStorage.setItem(LAST_USER_STORAGE_KEY, user.id)
    }
  }, [user?.id])

  useEffect(() => {
    if (signedInRef.current && !isSignedIn && lastKnownUserIdRef.current) {
      clearChat(lastKnownUserIdRef.current)
      localStorage.removeItem(LAST_USER_STORAGE_KEY)
    }

    signedInRef.current = isSignedIn
  }, [isSignedIn])

  useEffect(() => {
    skipNextSave.current = true
    const saved = loadChat(effectiveUserId)
    if (saved) {
      setChatHistory(saved.chatHistory)
      setActiveTab(saved.activeTab)
      setImageStyle(saved.imageStyle)
    } else {
      setChatHistory([])
      setActiveTab("generate-article")
      setImageStyle("cartoon")
    }
    setIsHydrated(true)
  }, [effectiveUserId])

  useEffect(() => {
    if (!isHydrated) return
    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }
    saveChat(effectiveUserId, { chatHistory, activeTab, imageStyle })
  }, [chatHistory, activeTab, imageStyle, effectiveUserId, isHydrated])

  useEffect(() => {
    setPrompt("")
    setAuthNotice(null)
  }, [activeTab])

  useEffect(() => {
    if (isSignedIn) setAuthNotice(null)
  }, [isSignedIn])

  const previewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile]
  )

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const startNewChat = () => {
    setChatHistory([])
    setPrompt("")
    setImageFile(null)
    setAuthNotice(null)
    setLoading(false)
    clearChat(effectiveUserId)
  }

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }, [prompt])

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) setImageFile(selectedFile)
    e.target.value = ""
  }

  const handleSuggestionClick = (text) => {
    setPrompt(text)
    textareaRef.current?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    if (activeTab === "generate-article" || activeTab === "generate-title") {
      if (!prompt.trim()) return
    } else if (activeTab === "generate-image") {
      if (!prompt.trim()) return
    } else if (activeTab === "remove-background") {
      if (!imageFile) return
    } else if (activeTab === "object-remover") {
      if (!imageFile || !prompt.trim()) return
    }

    if (!isSignedIn) {
      setAuthNotice("Please login first to use this service.")
      openSignIn()
        return
    }

    setAuthNotice(null)
    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const userPromptText = prompt.trim() || `Uploaded ${imageFile?.name || "image"}`
    const activeTool = TOOLS.find((t) => t.id === activeTab)

    const userMessage = {
      sender: "user",
      text: userPromptText,
      time: timeString,
      meta: {
        tool: activeTool?.label,
        style: activeTab === "generate-image" ? imageStyle : null,
        fileName: imageFile ? imageFile.name : null,
        object: activeTab === "object-remover" ? prompt.trim() : null,
      },
    }

    const loadingMessage = { sender: "assistant", isLoading: true, time: timeString }

    setChatHistory((prev) => [...prev, userMessage, loadingMessage])
    setLoading(true)

    try {
      let apiResult = null

      if (activeTab === "generate-article") {
        apiResult = await aiService.generateArticle({ prompt })
      } else if (activeTab === "generate-title") {
        apiResult = await aiService.generateTitle({ prompt })
      } else if (activeTab === "generate-image") {
        apiResult = await aiService.generateImage({ prompt, style: imageStyle })
      } else if (activeTab === "remove-background") {
        apiResult = await aiService.removeBackground({ image: imageFile })
      } else if (activeTab === "object-remover") {
        apiResult = await aiService.objectRemover({ image: imageFile, prompt: prompt.trim() })
      }

      setChatHistory((prev) => {
        const next = [...prev]
        next[next.length - 1] = {
          sender: "assistant",
          type: activeTab,
          result: apiResult,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        return next
      })
    } catch (error) {
      console.error("API Error during submission:", error)

      const isAuthError = error?.response?.status === 401
      const statusText = isAuthError
        ? "authentication required"
        : error?.response?.status
        ? `status ${error.response.status}`
        : error?.message || "connection failed"

      setChatHistory((prev) => {
        const next = [...prev]
        next[next.length - 1] = {
          sender: "assistant",
          isError: true,
          text: isAuthError
            ? "Please login first to use this service."
            : `Something went wrong (${statusText}). Check that the backend is running.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        return next
      })
    } finally {
      setLoading(false)
      setPrompt("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const needsImage = activeTab === "remove-background" || activeTab === "object-remover"
  const canSubmit =
    !loading &&
    ((activeTab === "remove-background" && imageFile) ||
      (activeTab === "object-remover" && imageFile && prompt.trim()) ||
      (activeTab !== "remove-background" && activeTab !== "object-remover" && prompt.trim()))

  return (
    <main className="chat-layout">
      <div className="chat-main">
        {!hasConversation ? (
          <HomeWelcome
            activeTab={activeTab}
            onSelectTool={setActiveTab}
            onSuggestionClick={handleSuggestionClick}
          />
        ) : (
      <div className="chat-stream-viewport">
            <div className="chat-toolbar">
              <button type="button" className="new-chat-btn" onClick={startNewChat}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New chat
              </button>
            </div>
        <ChatStream chatHistory={chatHistory} />
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <div className="chat-input-container">
          <div className="tool-pills">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={`tool-pill ${activeTab === tool.id ? "active" : ""}`}
                onClick={() => setActiveTab(tool.id)}
              >
                <span className="tool-pill-icon">{tool.icon}</span>
                {tool.label}
              </button>
            ))}
          </div>

        {activeTab === "generate-image" && (
          <ToolParameters
            activeTab={activeTab}
            imageStyle={imageStyle}
            setImageStyle={setImageStyle}
          />
        )}

          {authNotice && (
            <div className="auth-notice-bar">
              <span>{authNotice}</span>
              <button type="button" onClick={() => setAuthNotice(null)} aria-label="Dismiss">
                ✕
            </button>
        </div>
          )}

          <form className="input-box" onSubmit={handleSubmit}>
            {imageFile && needsImage && (
              <div className="attached-image">
                <img src={previewUrl} alt="Attached" />
                <div className="attached-image-info">
                  <span>{imageFile.name}</span>
                  <button type="button" onClick={() => setImageFile(null)} aria-label="Remove">
                  ✕
                </button>
              </div>
            </div>
          )}

            <div className="input-row">
              {needsImage && (
                <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
                    hidden
              onChange={handleFileSelect}
            />
              <button
                type="button"
                    className="input-action-btn"
                    onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                    title="Upload image"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
                </>
              )}

              <textarea
                ref={textareaRef}
                className="chat-textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDERS[activeTab]}
                disabled={loading}
                rows={1}
              />

            <button
              type="submit"
                className={`send-btn ${canSubmit ? "ready" : ""}`}
                disabled={loading || !canSubmit}
                title="Send"
                aria-label="Send"
            >
              {loading ? (
                  <div className="btn-spinner" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              )}
            </button>
          </div>
        </form>

          <p className="input-disclaimer">DevMind AI can make mistakes. Verify important information.</p>
        </div>
      </div>
    </main>
  )
}
