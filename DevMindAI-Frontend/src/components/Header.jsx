import React from "react"
import { Show, SignInButton, UserButton } from "@clerk/react"

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="app-logo">
          <img src="/logo.png" alt="DevMind AI" className="logo-image" />
          <span className="logo-text"></span>
        </div>

        <div className="header-actions">
          <Show when="signed-in">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "user-button-avatar" } }} />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="auth-btn auth-btn-primary">Sign in</button>
            </SignInButton>
          </Show>
        </div>
      </div>
    </header>
  )
}
