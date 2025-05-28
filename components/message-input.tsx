"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Paperclip, X, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { EnhancedEmojiPicker } from "@/components/enhanced-emoji-picker"
import type { Message } from "@/lib/types"

interface MessageInputProps {
  onSendMessage: (message: string, replyTo?: Message) => void
  replyTo?: Message
  onCancelReply?: () => void
  recentEmojis?: string[]
  onEmojiUsed?: (emoji: string) => void
}

export default function MessageInput({
  onSendMessage,
  replyTo,
  onCancelReply,
  recentEmojis = [],
  onEmojiUsed,
}: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message, replyTo)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji)
    onEmojiUsed?.(emoji)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      // Handle file upload here
      console.log("Files dropped:", files)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Handle file upload here
      console.log("Files selected:", files)
    }
  }

  return (
    <div className="relative">
      {/* Drag overlay */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-purple-500/10 border-2 border-dashed border-purple-500 rounded-lg flex items-center justify-center z-10"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <File className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-purple-600 dark:text-purple-400 font-medium">Drop files to share</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reply indicator */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-3 bg-gray-100 dark:bg-gray-800 border-l-4 border-purple-500 mb-2 rounded-t-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  Replying to {replyTo.senderId === "me" ? "yourself" : "user"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{replyTo.text}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onCancelReply} className="h-6 w-6 p-0 ml-2">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            onClick={handleFileSelect}
          >
            <Paperclip size={20} />
            <span className="sr-only">Attach file</span>
          </Button>

          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="min-h-[2.5rem] max-h-32 py-2 pr-10 resize-none dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              rows={1}
            />
            <div className="absolute right-2 bottom-1">
              <EnhancedEmojiPicker onEmojiSelect={handleEmojiSelect} recentEmojis={recentEmojis} />
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              size="icon"
              className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white rounded-full h-10 w-10 flex-shrink-0"
              disabled={!message.trim()}
            >
              <Send size={18} />
              <span className="sr-only">Send message</span>
            </Button>
          </motion.div>
        </form>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        />
      </div>
    </div>
  )
}
