/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from 'next'
import './globals.css'
import FlowbiteClient from './_components/FlowbiteClient'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { Suspense } from 'react'


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
      <head>
        {/* <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.css" rel="stylesheet" /> */}
      </head>
      <body className="">
        <Suspense fallback={<p>Loading data...</p>}>
          {children}
        </Suspense>
        <FlowbiteClient />
      </body>

    </html>
  )
}

library.add(fab, fas, far)