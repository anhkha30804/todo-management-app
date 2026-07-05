import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/shared/providers'
import { Toaster } from '@/components/ui/sonner'

const nunito = Nunito({
   variable: '--font-sans',
   subsets: ['latin'],
   weight: ['400', '500', '600', '700', '800']
})

export const metadata: Metadata = {
   title: 'Todo App',
   description: 'Todo management application'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en" className={`${nunito.variable} h-full antialiased`}>
         <body className="min-h-full flex flex-col">
            <Providers>
               {children}
               <Toaster richColors position="top-right" />
            </Providers>
         </body>
      </html>
   )
}
