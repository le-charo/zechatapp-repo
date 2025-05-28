"use client"

import { useState, useRef } from "react"
import { Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

const EMOJI_CATEGORIES = {
  "Smileys & Emotion": [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
  ],
  "People & Body": [
    "👋",
    "🤚",
    "✋",
    "🖖",
    "👌",
    "🤌",
    "🤏",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "👇",
    "👍",
    "👎",
  ],
  "Animals & Nature": [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🐔",
    "🐧",
  ],
  "Food & Drink": [
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
  ],
  "Travel & Places": [
    "🚗",
    "🚕",
    "🚙",
    "🚌",
    "🚎",
    "🏎️",
    "🚓",
    "🚑",
    "🚒",
    "🚐",
    "🛻",
    "🚚",
    "🚛",
    "🚜",
    "🛵",
    "🏍️",
    "🛺",
  ],
  Activities: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏"],
  Objects: ["⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", "💾", "💿", "📀", "📼", "📷", "📸"],
  Symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘"],
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>(Object.keys(EMOJI_CATEGORIES)[0])
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji)
  }

  const scrollToCategory = (category: string) => {
    setActiveCategory(category)
    if (categoryRefs.current[category]) {
      categoryRefs.current[category]?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 h-8 w-8"
        >
          <Smile size={20} />
          <span className="sr-only">Add emoji</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex flex-col h-80">
          <div className="flex overflow-x-auto p-2 border-b">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                className={`px-2 py-1 text-xs whitespace-nowrap ${
                  activeCategory === category ? "bg-purple-100 dark:bg-purple-900/30" : ""
                }`}
                onClick={() => scrollToCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
              <div key={category} ref={(el) => (categoryRefs.current[category] = el)} className="mb-4">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{category}</h3>
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      onClick={() => handleEmojiClick(emoji)}
                      type="button"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
