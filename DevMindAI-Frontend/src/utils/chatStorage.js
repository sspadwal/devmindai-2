const STORAGE_PREFIX = "devmind_chat_"

function getStorageKey(userId) {
  return `${STORAGE_PREFIX}${userId || "guest"}`
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return []
  return history.filter((msg) => !msg.isLoading)
}

export function loadChat(userId) {
  try {
    const raw = localStorage.getItem(getStorageKey(userId))
    if (!raw) return null

    const data = JSON.parse(raw)
    return {
      chatHistory: sanitizeHistory(data.chatHistory),
      activeTab: data.activeTab || "generate-article",
      imageStyle: data.imageStyle || "cartoon",
    }
  } catch (error) {
    console.error("Failed to load chat from localStorage:", error)
    return null
  }
}

export function saveChat(userId, { chatHistory, activeTab, imageStyle }) {
  try {
    const payload = {
      chatHistory: sanitizeHistory(chatHistory),
      activeTab,
      imageStyle,
      updatedAt: Date.now(),
    }
    localStorage.setItem(getStorageKey(userId), JSON.stringify(payload))
  } catch (error) {
    console.error("Failed to save chat to localStorage:", error)
  }
}

export function clearChat(userId) {
  try {
    localStorage.removeItem(getStorageKey(userId))
  } catch (error) {
    console.error("Failed to clear chat from localStorage:", error)
  }
}
