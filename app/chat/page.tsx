'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // TODO: Implement API call to your Flask backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      // TODO: Implement error handling
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <main className="chat-main">
        <div className="chat-header">
          <div className="header-left">
            <div className="ai-avatar">
              <i className="fas fa-user" style={{ color: 'var(--accent-color)' }}></i>
            </div>
            <div className="ai-info">
              <h3>Dr. Emma AI</h3>
              <p>Social Situations Specialist</p>
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.role === 'user' ? 'user' : 'bot'}`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[--accent-color] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[--accent-color] rounded-full animate-bounce [animation-delay:-.3s]" />
                <div className="w-2 h-2 bg-[--accent-color] rounded-full animate-bounce [animation-delay:-.5s]" />
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <form onSubmit={handleSendMessage} className="input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="message-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="send-button"
              title="Send message"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}