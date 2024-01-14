

import type { Metadata } from 'next'
import HeaderTeacher from '@/app/_components/Header/HeaderTeacher'


export const metadata: Metadata = {
  title: 'Study365',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className="layout-sticky-subnav layout-default">
        <HeaderTeacher />

        {children}
      </body>
    </html>
  )
}
