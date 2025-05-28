"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, MoreVertical, Phone, Video, User, X, Users, Settings } from "lucide-react"
import { LogoIcon } from "@/components/logo"
import MessageBubble from "@/components/message-bubble"
import MessageInput from "@/components/message-input"
import { UserProfile } from "@/components/user-profile"
import type { Message, User as UserType } from "@/lib/types"

// Mock data for contacts
const contacts: UserType[] = [
  {
    id: "1",
    username: "Amara Okafor",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastSeen: "2m ago",
    bio: "Software developer passionate about creating amazing user experiences.",
    customStatus: "Building the future",
    statusEmoji: "🚀",
  },
  {
    id: "2",
    username: "Kwame Mensah",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastSeen: "1h ago",
    bio: "Designer and creative thinker.",
    customStatus: "In a meeting",
    statusEmoji: "💼",
  },
  {
    id: "3",
    username: "Zainab Ahmed",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastSeen: "3h ago",
    bio: "Product manager who loves solving complex problems.",
    customStatus: "Available",
    statusEmoji: "✨",
  },
  {
    id: "4",
    username: "Tendai Moyo",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastSeen: "Yesterday",
    bio: "Marketing specialist with a passion for storytelling.",
    customStatus: "Coffee time",
    statusEmoji: "☕",
  },
  {
    id: "5",
    username: "Chijioke Eze",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastSeen: "Yesterday",
    bio: "Data scientist exploring the world of AI.",
    customStatus: "Deep in code",
    statusEmoji: "🤖",
  },
]

// Mock data for messages with reactions
const initialMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    text: "Hey there! How are you doing today?",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: "read",
    reactions: [
      { emoji: "👍", users: ["me"], count: 1 },
      { emoji: "❤️", users: ["1", "me"], count: 2 },
    ],
  },
  {
    id: "2",
    senderId: "me",
    text: "I'm doing great, thanks for asking! How about you?",
    timestamp: new Date(Date.now() - 3300000).toISOString(),
    status: "read",
  },
  {
    id: "3",
    senderId: "1",
    text: "I'm good too! Just working on some new projects.",
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    status: "read",
    reactions: [{ emoji: "🚀", users: ["me"], count: 1 }],
  },
  {
    id: "4",
    senderId: "me",
    text: "That sounds interesting! What kind of projects?",
    timestamp: new Date(Date.now() - 2700000).toISOString(),
    status: "read",
    replyTo: {
      id: "3",
      text: "I'm good too! Just working on some new projects.",
      senderName: "Amara Okafor",
    },
  },
  {
    id: "5",
    senderId: "1",
    text: "I'm building a new chat application with real-time messaging capabilities. It's going to have some cool African-inspired design elements.",
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    status: "read",
    reactions: [
      { emoji: "🔥", users: ["me"], count: 1 },
      { emoji: "👏", users: ["me"], count: 1 },
    ],
  },
]

export default function ChatPage() {
  const [activeContact, setActiveContact] = useState(contacts[0])
  const [messages, setMessages] = useState(initialMessages)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [replyTo, setReplyTo] = useState<Message | undefined>()
  const [recentEmojis, setRecentEmojis] = useState<string[]>(["👍", "❤️", "😂", "🔥", "👏"])
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Close sidebar on mobile by default, open on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSendMessage = (text: string, replyToMessage?: Message) => {
    const message: Message = {
      id: (messages.length + 1).toString(),
      senderId: "me",
      text,
      timestamp: new Date().toISOString(),
      status: "sent",
      replyTo: replyToMessage
        ? {
            id: replyToMessage.id,
            text: replyToMessage.text,
            senderName: replyToMessage.senderId === "me" ? "You" : activeContact.username,
          }
        : undefined,
    }

    setMessages([...messages, message])
    setReplyTo(undefined)

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (messages.length + 2).toString(),
        senderId: activeContact.id,
        text: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toISOString(),
        status: "sent",
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || []
          const existingReaction = reactions.find((r) => r.emoji === emoji)

          if (existingReaction) {
            if (!existingReaction.users.includes("me")) {
              existingReaction.users.push("me")
              existingReaction.count++
            }
          } else {
            reactions.push({ emoji, users: ["me"], count: 1 })
          }

          return { ...msg, reactions }
        }
        return msg
      }),
    )

    // Add to recent emojis
    setRecentEmojis((prev) => {
      const filtered = prev.filter((e) => e !== emoji)
      return [emoji, ...filtered].slice(0, 8)
    })
  }

  const handleRemoveReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = (msg.reactions || [])
            .map((r) => {
              if (r.emoji === emoji && r.users.includes("me")) {
                return {
                  ...r,
                  users: r.users.filter((u) => u !== "me"),
                  count: r.count - 1,
                }
              }
              return r
            })
            .filter((r) => r.count > 0)

          return { ...msg, reactions }
        }
        return msg
      }),
    )
  }

  const handleReply = (message: Message) => {
    setReplyTo(message)
  }

  const handleEmojiUsed = (emoji: string) => {
    setRecentEmojis((prev) => {
      const filtered = prev.filter((e) => e !== emoji)
      return [emoji, ...filtered].slice(0, 8)
    })
  }

  // Filter contacts based on search
  const filteredContacts = contacts.filter((contact) =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (showProfile) {
    return (
      <div className="container mx-auto h-[calc(100vh-8rem)] my-4 md:my-8 bg-custom-gradient">
        <div className="h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Profile</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowProfile(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="h-[calc(100%-5rem)] overflow-y-auto">
            <UserProfile user={activeContact} isOwnProfile={false} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto h-[calc(100vh-8rem)] my-4 md:my-8 bg-custom-gradient">
      <div className="flex h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 768) && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`bg-white dark:bg-gray-900 w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed md:relative inset-0 z-40 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
              }`}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center">
                  <LogoIcon width={32} height={32} />
                  <h2 className="font-semibold text-lg ml-2">Messages</h2>
                </div>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search contacts..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <AnimatePresence>
                  {filteredContacts.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                        activeContact.id === contact.id ? "bg-gray-100 dark:bg-gray-800" : ""
                      }`}
                      onClick={() => {
                        setActiveContact(contact)
                        if (window.innerWidth < 768) {
                          setSidebarOpen(false)
                        }
                      }}
                    >
                      <div className="relative">
                        <img
                          src={contact.avatar || "/placeholder.svg"}
                          alt={contact.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                            contact.status === "online" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        ></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium truncate">{contact.username}</h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{contact.lastSeen}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {contact.statusEmoji && <span className="text-sm">{contact.statusEmoji}</span>}
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {contact.customStatus || "No status"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setShowProfile(true)}>
                  <User className="mr-2 h-5 w-5" />
                  <span>My Profile</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-5 w-5" />
                  <span>New Group</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-5 w-5" />
                  <span>Settings</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 w-full md:w-auto">
          {/* Chat header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900"
          >
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div className="relative cursor-pointer" onClick={() => setShowProfile(true)}>
                <img
                  src={activeContact.avatar || "/placeholder.svg"}
                  alt={activeContact.username}
                  className="w-10 h-10 rounded-full"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900 ${
                    activeContact.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
              </div>
              <div className="cursor-pointer" onClick={() => setShowProfile(true)}>
                <h3 className="font-medium">{activeContact.username}</h3>
                <div className="flex items-center space-x-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activeContact.status === "online" ? "Online" : "Offline"}
                  </p>
                  {activeContact.customStatus && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activeContact.statusEmoji} {activeContact.customStatus}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Phone className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Video className="h-5 w-5" />
                </Button>
              </motion.div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-purple-50/30 to-teal-50/30 dark:from-gray-900 dark:to-gray-800">
            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isCurrentUser={message.senderId === "me"}
                  onReply={handleReply}
                  onAddReaction={handleAddReaction}
                  onRemoveReaction={handleRemoveReaction}
                  currentUserId="me"
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <MessageInput
            onSendMessage={handleSendMessage}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(undefined)}
            recentEmojis={recentEmojis}
            onEmojiUsed={handleEmojiUsed}
          />
        </div>
      </div>
    </div>
  )
}
