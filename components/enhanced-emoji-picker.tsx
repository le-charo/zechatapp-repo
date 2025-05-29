"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Smile, Search, Clock, Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  recentEmojis?: string[]
}

const EMOJI_CATEGORIES = {
  Recent: {
    icon: <Clock className="h-4 w-4" />,
    emojis: [], // Will be populated with recent emojis
  },
  Smileys: {
    icon: <Smile className="h-4 w-4" />,
    emojis: [
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
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤨",
      "🧐",
      "🤓",
      "😎",
      "🤩",
      "🥳",
      "😏",
    ],
  },
  Hearts: {
    icon: <Heart className="h-4 w-4" />,
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "♥️",
      "💌",
      "💋",
      "💍",
      "💎",
    ],
  },
  People: {
    icon: "👋",
    emojis: [
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
      "👊",
      "✊",
      "🤛",
      "🤜",
      "👏",
      "🙌",
      "👐",
      "🤲",
      "🤝",
      "🙏",
      "✍️",
      "💅",
      "🤳",
      "💪",
    ],
  },
  Animals: {
    icon: "🐶",
    emojis: [
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
      "🐦",
      "🐤",
      "🐣",
      "🐥",
      "🦆",
      "🦅",
      "🦉",
      "🦇",
      "🐺",
      "🐗",
      "🐴",
      "🦄",
      "🐝",
      "🐛",
      "🦋",
    ],
  },
  Food: {
    icon: "🍎",
    emojis: [
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
      "🍆",
      "🥑",
      "🥦",
      "🥬",
      "🥒",
      "🌶️",
      "🫑",
      "🌽",
      "🥕",
      "🫒",
      "🧄",
      "🧅",
      "🥔",
      "🍠",
      "🥐",
    ],
  },
  Travel: {
    icon: "🚗",
    emojis: [
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
      "🚲",
      "🛴",
      "🛹",
      "🛼",
      "🚁",
      "🛸",
      "🚀",
      "✈️",
      "🛩️",
      "🛫",
      "🛬",
      "🪂",
      "⛵",
      "🚤",
      "🛥️",
    ],
  },
  Objects: {
    icon: "⌚",
    emojis: [
      "⌚",
      "📱",
      "💻",
      "⌨️",
      "🖥️",
      "🖨️",
      "🖱️",
      "🖲️",
      "🕹️",
      "🗜️",
      "💽",
      "💾",
      "💿",
      "📀",
      "📼",
      "📷",
      "📸",
      "📹",
      "🎥",
      "📽️",
      "🎞️",
      "📞",
      "☎️",
      "📟",
      "📠",
      "📺",
      "📻",
      "🎙️",
      "🎚️",
      "🎛️",
      "🧭",
      "⏱️",
    ],
  },
}

export function EnhancedEmojiPicker({ onEmojiSelect, recentEmojis = [] }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Update recent emojis in categories
  const categoriesWithRecent = { ...EMOJI_CATEGORIES }
  categoriesWithRecent.Recent.emojis = recentEmojis.slice(0, 24)

  // Filter emojis based on search
  const filteredCategories = searchQuery
    ? Object.entries(categoriesWithRecent).reduce(
        (acc, [category, data]) => {
          const filteredEmojis = data.emojis.filter((emoji) => emoji.includes(searchQuery))
          if (filteredEmojis.length > 0) {
            acc[category] = { ...data, emojis: filteredEmojis }
          }
          return acc
        },
        {} as typeof categoriesWithRecent,
      )
    : categoriesWithRecent

  // Handle click outside to close picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji)
    setIsOpen(false)
    setSearchQuery("")
  }

  const togglePicker = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const scrollToCategory = (category: string) => {
    setActiveCategory(category)
    if (categoryRefs.current[category]) {
      categoryRefs.current[category]?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="relative" ref={pickerRef}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 h-8 w-8"
        onClick={togglePicker}
      >
        <Smile size={20} />
        <span className="sr-only">Add emoji</span>
      </Button>

      {/* Emoji Picker Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-80 z-50"
          >
            <div className="flex flex-col h-96">
              {/* Header with close button */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium">Emoji Picker</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={16} />
                </Button>
              </div>

              {/* Search */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search emojis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-8"
                  />
                </div>
              </div>

              {/* Category tabs */}
              <div className="flex overflow-x-auto p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {Object.entries(filteredCategories).map(([category, data]) => (
                  <Button
                    key={category}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`px-3 py-2 text-xs whitespace-nowrap flex items-center gap-1 ${
                      activeCategory === category
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                        : ""
                    }`}
                    onClick={() => scrollToCategory(category)}
                  >
                    {typeof data.icon === "string" ? data.icon : data.icon}
                    <span className="hidden sm:inline">{category}</span>
                  </Button>
                ))}
              </div>

              {/* Emoji grid */}
              <ScrollArea className="flex-1 p-2">
                {Object.entries(filteredCategories).map(([category, data]) => (
                  <div key={category} ref={(el) => (categoryRefs.current[category] = el)} className="mb-4">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">{category}</h3>
                    <div className="grid grid-cols-8 gap-1">
                      {data.emojis.map((emoji, index) => (
                        <button
                          key={`${category}-${emoji}-${index}`}
                          type="button"
                          className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
                          onClick={() => handleEmojiClick(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
