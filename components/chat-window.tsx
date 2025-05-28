"use client"

import { useEffect, useRef } from "react"
import type { Message } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import MessageBubble from "@/components/message-bubble"

interface ChatWindowProps {
  messages: Message[]
  currentUser: string
}

export default function ChatWindow({ messages, currentUser }: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {}

  messages.forEach((message) => {
    const date = new Date(message.timestamp).toLocaleDateString()
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="flex-1 p-4 bg-gradient-to-br from-purple-50 to-teal-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="space-y-6">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-3">
            <div className="flex justify-center">
              <span className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                {date === new Date().toLocaleDateString() ? "Today" : date}
              </span>
            </div>

            {dateMessages.map((message) => (
              <MessageBubble key={message.id} message={message} isCurrentUser={message.senderId === currentUser} />
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
