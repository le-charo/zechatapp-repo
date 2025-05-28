"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Message } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Check, CheckCheck, Reply, MoreHorizontal } from "lucide-react"
import { MessageReactions } from "@/components/message-reactions"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MessageBubbleProps {
  message: Message
  isCurrentUser: boolean
  onReply?: (message: Message) => void
  onAddReaction?: (messageId: string, emoji: string) => void
  onRemoveReaction?: (messageId: string, emoji: string) => void
  currentUserId: string
}

export default function MessageBubble({
  message,
  isCurrentUser,
  onReply,
  onAddReaction,
  onRemoveReaction,
  currentUserId,
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false)

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleAddReaction = (emoji: string) => {
    onAddReaction?.(message.id, emoji)
  }

  const handleRemoveReaction = (emoji: string) => {
    onRemoveReaction?.(message.id, emoji)
  }

  const handleReply = () => {
    onReply?.(message)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex group", isCurrentUser ? "justify-end" : "justify-start")}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={cn("relative max-w-[75%]", isCurrentUser ? "order-2" : "order-1")}>
        {/* Reply indicator */}
        {message.replyTo && (
          <div
            className={cn(
              "mb-1 px-3 py-1 rounded-lg text-xs opacity-70",
              isCurrentUser
                ? "bg-purple-500/20 text-purple-200"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
            )}
          >
            <div className="flex items-center gap-1">
              <Reply className="h-3 w-3" />
              <span className="font-medium">{message.replyTo.senderName}</span>
            </div>
            <div className="truncate">{message.replyTo.text}</div>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2 shadow-sm relative",
            isCurrentUser
              ? "bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-br-none"
              : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-600",
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>

          <div
            className={cn(
              "flex items-center mt-1 text-xs gap-2",
              isCurrentUser ? "text-purple-200 justify-end" : "text-gray-500 dark:text-gray-400",
            )}
          >
            <span>{formattedTime}</span>
            {isCurrentUser && (
              <span className="ml-1">{message.status === "read" ? <CheckCheck size={14} /> : <Check size={14} />}</span>
            )}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <MessageReactions
            reactions={message.reactions}
            onAddReaction={handleAddReaction}
            onRemoveReaction={handleRemoveReaction}
            currentUserId={currentUserId}
          />
        )}
      </div>

      {/* Message actions */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showActions ? 1 : 0, scale: showActions ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        className={cn("flex items-center gap-1 mx-2", isCurrentUser ? "order-1" : "order-2")}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
          onClick={handleReply}
        >
          <Reply className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-1" align="center">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="sm" className="justify-start">
                Copy
              </Button>
              <Button variant="ghost" size="sm" className="justify-start">
                Forward
              </Button>
              {isCurrentUser && (
                <Button variant="ghost" size="sm" className="justify-start text-red-600">
                  Delete
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </motion.div>
    </motion.div>
  )
}
