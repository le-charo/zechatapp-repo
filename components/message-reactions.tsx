"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { MessageReaction } from "@/lib/types"

interface MessageReactionsProps {
  reactions: MessageReaction[]
  onAddReaction: (emoji: string) => void
  onRemoveReaction: (emoji: string) => void
  currentUserId: string
}

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"]

export function MessageReactions({ reactions, onAddReaction, onRemoveReaction, currentUserId }: MessageReactionsProps) {
  const [showPicker, setShowPicker] = useState(false)

  const handleReactionClick = (emoji: string) => {
    const reaction = reactions.find((r) => r.emoji === emoji)
    const userHasReacted = reaction?.users.includes(currentUserId)

    if (userHasReacted) {
      onRemoveReaction(emoji)
    } else {
      onAddReaction(emoji)
    }
  }

  const handleQuickReaction = (emoji: string) => {
    handleReactionClick(emoji)
  }

  return (
    <div className="flex items-center gap-1 mt-1">
      {/* Existing reactions */}
      <AnimatePresence>
        {reactions.map((reaction) => (
          <motion.button
            key={reaction.emoji}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            onClick={() => handleReactionClick(reaction.emoji)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
              reaction.users.includes(currentUserId)
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <span>{reaction.emoji}</span>
            <span className="font-medium">{reaction.count}</span>
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Add reaction button */}
      <Popover open={showPicker} onOpenChange={setShowPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-1">
            {QUICK_REACTIONS.map((emoji) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  handleQuickReaction(emoji)
                  setShowPicker(false)
                }}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-lg"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
