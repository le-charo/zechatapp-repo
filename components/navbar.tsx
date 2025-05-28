"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { Menu, X, Home, MessageSquare, LogIn, UserPlus } from "lucide-react"
import { useState, useEffect } from "react"
import { Logo, LogoIcon } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Navigation items with icons
  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/chat", label: "Chat", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  ]

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle window resize to close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    setMounted(true)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [mobileMenuOpen])

  if (!mounted) return null

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm" : "bg-white dark:bg-gray-900",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" aria-label="ZeChat Home">
              <div className="hidden sm:block">
                <Logo width={160} height={50} />
              </div>
              <div className="sm:hidden">
                <LogoIcon width={40} height={40} />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full px-2 py-1.5 flex items-center shadow-sm border border-gray-200 dark:border-gray-700">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 mx-1",
                    pathname === item.href
                      ? "text-white bg-gradient-to-r from-purple-600 to-teal-500 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="flex items-center ml-4 space-x-2">
              {pathname !== "/login" && pathname !== "/signup" ? (
                <>
                  <Button asChild variant="ghost" size="sm" className="text-sm font-medium">
                    <Link href="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white"
                  >
                    <Link href="/signup">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              ) : pathname === "/login" ? (
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white"
                >
                  <Link href="/signup">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="ghost" size="sm" className="text-sm font-medium">
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
              )}
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile menu button and theme toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
              className="relative"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? "close" : "menu"}
                  initial={{ opacity: 0, rotate: mobileMenuOpen ? -90 : 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: mobileMenuOpen ? 90 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-16 bottom-0 w-full max-w-xs bg-white dark:bg-gray-900 z-40 shadow-xl md:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 flex-1">
                  <div className="space-y-1 mb-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center py-3 px-4 rounded-lg text-base font-medium transition-colors",
                          pathname === item.href
                            ? "bg-gradient-to-r from-purple-600/10 to-teal-500/10 text-purple-600 dark:text-purple-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-3 px-4">
                      Account
                    </p>
                    {pathname !== "/login" && pathname !== "/signup" ? (
                      <div className="space-y-2">
                        <Link
                          href="/login"
                          className="flex items-center py-3 px-4 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <LogIn className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                          Login
                        </Link>
                        <Link
                          href="/signup"
                          className="flex items-center py-3 px-4 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <UserPlus className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                          Sign Up
                        </Link>
                      </div>
                    ) : pathname === "/login" ? (
                      <Link
                        href="/signup"
                        className="flex items-center py-3 px-4 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <UserPlus className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                        Sign Up
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className="flex items-center py-3 px-4 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LogIn className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                        Login
                      </Link>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} ZeChat</p>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => setMobileMenuOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
