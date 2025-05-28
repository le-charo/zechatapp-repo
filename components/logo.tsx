"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  width?: number
  height?: number
  linkWrapper?: boolean
}

export function Logo({ width = 160, height = 50, linkWrapper = false }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const logoSrc = resolvedTheme === "dark" ? "/logo-dark.svg" : "/logo.svg"

  const logoImage = (
    <Image src={logoSrc || "/placeholder.svg"} alt="ZeChat Logo" width={width} height={height} priority />
  )

  if (linkWrapper) {
    return (
      <Link href="/" className="flex items-center">
        {logoImage}
      </Link>
    )
  }

  return <div className="flex items-center">{logoImage}</div>
}

export function LogoIcon({ width = 40, height = 40, linkWrapper = false }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const logoSrc = resolvedTheme === "dark" ? "/logo-icon-dark.svg" : "/logo-icon.svg"

  const logoImage = <Image src={logoSrc || "/placeholder.svg"} alt="ZeChat" width={width} height={height} priority />

  if (linkWrapper) {
    return (
      <Link href="/" className="flex items-center">
        {logoImage}
      </Link>
    )
  }

  return <div className="flex items-center">{logoImage}</div>
}
