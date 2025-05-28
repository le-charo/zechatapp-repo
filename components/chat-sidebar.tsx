"use client"

import type { User } from "@/lib/types"
import { X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"

interface ChatSidebarProps {
  contacts: User[]
  activeContact: User
  setActiveContact: (contact: User) => void
  isOpen: boolean
  onClose: () => void
}

export default function ChatSidebar({ contacts, activeContact, setActiveContact, isOpen, onClose }: ChatSidebarProps) {
  return (
    <div
      className={cn(
        "w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Logo width={120} height={40} />
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden">
          <X size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="p-3">
        <input
          type="text"
          placeholder="Search contacts..."
          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
        />
      </div>

      <ScrollArea className="h-[calc(100vh-8.5rem)]">
        <div className="p-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={cn(
                "flex items-center p-3 rounded-lg cursor-pointer transition-colors",
                activeContact.id === contact.id
                  ? "bg-purple-100 dark:bg-purple-900/30"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700",
              )}
              onClick={() => setActiveContact(contact)}
            >
              <div className="relative">
                <img
                  src={contact.avatar || "/placeholder.svg"}
                  alt={contact.username}
                  className="w-10 h-10 rounded-full"
                />
                <span
                  className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800",
                    contact.status === "online"
                      ? "bg-green-500"
                      : contact.status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-400",
                  )}
                />
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="font-medium text-gray-900 dark:text-gray-200 truncate">{contact.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{contact.lastSeen}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
