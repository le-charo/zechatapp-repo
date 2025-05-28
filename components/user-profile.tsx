"use client"

import { useState } from "react"
import { Camera, Edit3, Phone, Mail, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/types"

interface UserProfileProps {
  user: User
  isOwnProfile?: boolean
  onUpdateProfile?: (updates: Partial<User>) => void
}

export function UserProfile({ user, isOwnProfile = false, onUpdateProfile }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    username: user.username,
    bio: user.bio || "",
    customStatus: user.customStatus || "",
    statusEmoji: user.statusEmoji || "😊",
  })

  const handleSave = () => {
    onUpdateProfile?.(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      username: user.username,
      bio: user.bio || "",
      customStatus: user.customStatus || "",
      statusEmoji: user.statusEmoji || "😊",
    })
    setIsEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                <AvatarFallback className="text-2xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Name and Status */}
            <div className="text-center space-y-2">
              {isEditing ? (
                <Input
                  value={editData.username}
                  onChange={(e) => setEditData((prev) => ({ ...prev, username: e.target.value }))}
                  className="text-center text-xl font-bold"
                />
              ) : (
                <h1 className="text-2xl font-bold">{user.username}</h1>
              )}

              {/* Status */}
              <div className="flex items-center justify-center space-x-2">
                <Badge variant={user.status === "online" ? "default" : "secondary"}>{user.status}</Badge>
                {user.customStatus && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user.statusEmoji} {user.customStatus}
                  </span>
                )}
              </div>

              {/* Last seen */}
              <p className="text-sm text-gray-500 dark:text-gray-400">Last seen {user.lastSeen}</p>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2">
              {isOwnProfile ? (
                <>
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} size="sm">
                        Save Changes
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => setIsEditing(true)} size="sm">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Button size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={editData.bio}
              onChange={(e) => setEditData((prev) => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">{user.bio || "No bio available."}</p>
          )}
        </CardContent>
      </Card>

      {/* Custom Status */}
      {isOwnProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Message</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="flex space-x-2">
                <Input
                  value={editData.statusEmoji}
                  onChange={(e) => setEditData((prev) => ({ ...prev, statusEmoji: e.target.value }))}
                  className="w-16 text-center"
                  placeholder="😊"
                />
                <Input
                  value={editData.customStatus}
                  onChange={(e) => setEditData((prev) => ({ ...prev, customStatus: e.target.value }))}
                  placeholder="What's on your mind?"
                  className="flex-1"
                />
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                {user.statusEmoji} {user.customStatus || "No status message"}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Activity Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">142</p>
              <p className="text-sm text-gray-500">Messages</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-600">23</p>
              <p className="text-sm text-gray-500">Groups</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">89</p>
              <p className="text-sm text-gray-500">Friends</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">7</p>
              <p className="text-sm text-gray-500">Days Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
