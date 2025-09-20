import './globals.css'
import { Cairo } from 'next/font/google'

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  variable: '--font-cairo',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
      </head>
      <body className={`${cairo.variable} font-sans antialiased`}> 
        {children}
      </body>
    </html>
  )
}