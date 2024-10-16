import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Flight Tracker",
  description: "Track flights around the world with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}