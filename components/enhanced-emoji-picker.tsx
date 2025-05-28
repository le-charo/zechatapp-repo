"use client"

import { useState, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Smile, Search, Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Update recent emojis in categories
  const categoriesWithRecent = useMemo(() => {
    const updated = { ...EMOJI_CATEGORIES }
    updated.Recent.emojis = recentEmojis.slice(0, 24)
    return updated
  }, [recentEmojis])

  // Filter emojis based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categoriesWithRecent

    const filtered: typeof categoriesWithRecent = {}
    Object.entries(categoriesWithRecent).forEach(([category, data]) => {
      const filteredEmojis = data.emojis.filter((emoji) =>
        // Simple emoji search - in a real app you'd want emoji names/keywords
        emoji.includes(searchQuery),
      )
      if (filteredEmojis.length > 0) {
        filtered[category] = { ...data, emojis: filteredEmojis }
      }
    })
    return filtered
  }, [categoriesWithRecent, searchQuery])

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji)
    setIsOpen(false)
    setSearchQuery("") // Clear search when closing
  }

  const scrollToCategory = (category: string) => {
    setActiveCategory(category)
    if (categoryRefs.current[category]) {
      categoryRefs.current[category]?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 h-8 w-8"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <Smile size={20} />
          <span className="sr-only">Add emoji</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" side="top">
        <div className="flex flex-col h-96">
          {/* Search */}
          <div className="p-3 border-b">
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
          <div className="flex overflow-x-auto p-2 border-b bg-gray-50 dark:bg-gray-800">
            {Object.entries(filteredCategories).map(([category, data]) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                className={`px-3 py-2 text-xs whitespace-nowrap flex items-center gap-1 ${
                  activeCategory === category
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                    : ""
                }`}
                onClick={() => scrollToCategory(category)}
                type="button"
              >
                {typeof data.icon === "string" ? data.icon : data.icon}
                <span className="hidden sm:inline">{category}</span>
              </Button>
            ))}
          </div>

          {/* Emoji grid */}
          <ScrollArea className="flex-1 p-2">
            <AnimatePresence>
              {Object.entries(filteredCategories).map(([category, data]) => (
                <motion.div
                  key={category}
                  ref={(el) => (categoryRefs.current[category] = el)}
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">{category}</h3>
                  <div className="grid grid-cols-8 gap-1">
                    {data.emojis.map((emoji, index) => (
                      <motion.button
                        key={`${category}-${emoji}-${index}`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.01 }}
                        className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
                        onClick={() => handleEmojiClick(emoji)}
                        type="button"
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}
