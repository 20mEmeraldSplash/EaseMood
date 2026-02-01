import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EaseMood - 情绪记录',
  description: '极简情绪记录工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
