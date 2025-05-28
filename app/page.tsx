import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, Users, Shield, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 bg-custom-gradient">
      <section className="flex flex-col items-center justify-center text-center py-8 md:py-16 lg:py-24">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
          Connect with friends through{" "}
          <span className="bg-gradient-to-r from-purple-600 to-teal-500 dark:from-purple-400 dark:to-teal-400 text-transparent bg-clip-text">
            ZeChat
          </span>
        </h1>
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mb-6 md:mb-8">
          A modern chat platform designed with African-inspired aesthetics. Connect, share, and build communities in a
          beautiful space.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </section>

      <section className="py-8 md:py-16 lg:py-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mask-container">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
              <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Instant messaging with friends and groups with real-time delivery and read receipts.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mask-container">
            <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900 mb-4">
              <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Groups</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create and join communities based on shared interests and connect with like-minded people.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mask-container">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
            <p className="text-gray-600 dark:text-gray-400">
              End-to-end encryption and robust privacy controls to keep your conversations secure.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mask-container">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900 mb-4">
              <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Built with modern technology for speed and reliability, even on slower connections.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16 lg:py-24 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Ready to get started?</h2>
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6 md:mb-8">
          Join thousands of users already connecting on ZeChat.
        </p>
        <Button asChild size="lg" className="rounded-full">
          <Link href="/signup">Create an Account</Link>
        </Button>
      </section>
    </div>
  )
}
