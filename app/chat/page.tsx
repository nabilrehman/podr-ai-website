'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
  isStreaming?: boolean
}

const WELCOME_MESSAGE: Message = {
  id: '0',
  content: "Hello! I'm Dr. Emma AI, your Social Situations Specialist. I'm here to help you overcome social anxiety and build lasting confidence. How are you feeling today?",
  role: 'assistant',
  timestamp: new Date()
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
      status: 'sending'
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isStreaming: true
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    setInputMessage('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      })

      if (!response.ok) throw new Error('Failed to get response')
      
      // Update user message status to sent
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
      ))

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No reader available')

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        
        // Update the assistant message with the new chunk
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, content: msg.content + chunk }
            : msg
        ))
      }

      // Mark streaming as complete
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessage.id
          ? { ...msg, isStreaming: false }
          : msg
      ))

    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessage.id))
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'error' as const } : msg
      ))
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const TypingCursor = () => (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
      className="inline-block w-0.5 h-4 bg-current ml-0.5 -mb-0.5"
    />
  );

  const MessageBubble = ({ message }: { message: Message }) => {
    const isUser = message.role === 'user'
    const showCursor = !isUser && message.isStreaming
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`message-container ${isUser ? 'justify-end' : 'justify-start'} w-full flex mb-4`}
      >
        {!isUser && (
          <div className="avatar-container mr-2">
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
              <span className="text-pink-500 text-sm font-semibold">Dr</span>
            </div>
          </div>
        )}
        
        <div className={`message-content max-w-[70%] ${isUser ? 'ml-auto' : ''}`}>
          <div
            className={`message ${
              isUser ? 'bg-pink-500 text-white rounded-tl-2xl' : 'bg-gray-100 text-gray-800 rounded-tr-2xl'
            } p-3 rounded-b-2xl shadow-sm`}
          >
            {message.content}
            {showCursor && <TypingCursor />}
          </div>
          <div className={`message-meta flex items-center gap-1 mt-1 text-xs text-gray-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span>{formatTimestamp(message.timestamp)}</span>
            {isUser && message.status && (
              <span className="ml-1">
                {message.status === 'sending' && '🕒'}
                {message.status === 'sent' && '✓'}
                {message.status === 'error' && '❌'}
              </span>
            )}
          </div>
        </div>

        {isUser && (
          <div className="avatar-container ml-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">You</span>
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center p-4 border-b bg-white shadow-sm fixed top-0 w-full z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
            <span className="text-pink-500 font-semibold">Dr</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Dr. Emma AI</h1>
            <p className="text-sm text-gray-500">Social Situations Specialist</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-20 pb-24 px-4">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="typing-indicator flex items-center gap-1 text-gray-400 ml-12"
          >
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.3s]" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.5s]" />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="fixed bottom-0 w-full bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 resize-none rounded-xl border border-gray-200 p-3 focus:outline-none focus:border-pink-500 max-h-32"
            rows={1}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            style={{
              minHeight: '44px',
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className={`p-3 rounded-xl ${
              isLoading || !inputMessage.trim()
                ? 'bg-gray-100 text-gray-400'
                : 'bg-pink-500 text-white hover:bg-pink-600'
            } transition-colors focus:outline-none`}
            title="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  )
}