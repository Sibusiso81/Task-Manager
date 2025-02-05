import type { Metadata } from "next"
import { Poppins, Inter } from "next/font/google"
import "./globals.css"
import type React from "react" // Import React
import StructuredData from "./StructuredData"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Aspire - Turn Your Goals into Daily Tasks",
  description:
    "Aspire helps you transform your broader goals into actionable daily tasks, boosting productivity and achieving your dreams.",
  keywords: ["task management", "goal setting", "productivity", "daily tasks", "personal development"],
  authors: [{ name: "Sibusiso Zulu", url: "https://task-manager-zeta-green.vercel.app/" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://task-manager-zeta-green.vercel.app/",
    siteName: "Aspire",
    title: "Aspire - Goal-Oriented Task Management",
    description:
      "Transform your goals into daily actionable tasks with Aspire. Boost productivity and achieve your dreams.",
    images: [
      {
        url: "https://i.ibb.co/20N2XNnC/og-image-1.jpg",
        width: 1200,
        height: 630,
        alt: "Aspire Task Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aspire - Turn Your Goals into Daily Tasks",
    description:
      "Transform your goals into daily actionable tasks with Aspire. Boost productivity and achieve your dreams.",
    images: ["https://i.ibb.co/20N2XNnC/og-image-1.jpg"],
    creator: "@YourTwitterHandle",
  },
  robots: "index, follow",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://i.ibb.co/20N2XNnC/og-image-1.jpg" />
      </head>
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        <StructuredData />
        {children}
      </body>
    </html>
  )
}

