// User type definition
export interface User {
  id: string
  username: string
  avatar: string
  lastSeen: string
  status: "online" | "offline" | "away"
  bio?: string
  customStatus?: string
  statusEmoji?: string
}

// Message type definition
export interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
  status: "sent" | "delivered" | "read"
  reactions?: MessageReaction[]
  replyTo?: {
    id: string
    text: string
    senderName: string
  }
  type?: "text" | "image" | "file" | "voice"
  fileUrl?: string
  fileName?: string
}

// Message reaction type
export interface MessageReaction {
  emoji: string
  users: string[]
  count: number
}

// Group chat type
export interface Group {
  id: string
  name: string
  avatar: string
  description: string
  members: User[]
  admins: string[]
  createdAt: string
  lastMessage?: Message
}
