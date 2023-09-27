export const metadata = {
  title: 'Study365',
  description: 'Generated by Next.js',
}
import { Provider } from 'react-redux'
import '@/styles/global.css'
import Header from '@/components/Header'
import { ReduxProvider } from '@/redux/provider'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body>
        <ReduxProvider>
          <Header />
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
