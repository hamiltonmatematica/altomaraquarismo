import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { QuoteCartProvider } from '@/contexts/quote-cart-context'
import Script from 'next/script'
import ClientLayout from '@/components/layout/client-layout'

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    variable: '--font-jakarta'
})

export const metadata: Metadata = {
    title: 'Alto Mar Aquarismo - Corais, Peixes & Equipamentos',
    description: 'Sua loja especializada em aquarismo marinho. Corais, peixes, invertebrados e equipamentos selecionados para seu reef.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-br" className="light">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" />
            </head>
            <body className={`${jakarta.variable} font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased pb-16 md:pb-0`}>
                <Script id="meta-pixel" strategy="afterInteractive">
                    {`
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '4247047615508969');
                    fbq('track', 'PageView');
                    `}
                </Script>
                <noscript>
                    <img 
                        height="1" 
                        width="1" 
                        style={{ display: 'none' }}
                        src="https://www.facebook.com/tr?id=4247047615508969&ev=PageView&noscript=1"
                        alt="" 
                    />
                </noscript>
                <QuoteCartProvider>
                    <ClientLayout>
                        {children}
                    </ClientLayout>
                </QuoteCartProvider>
            </body>
        </html>
    )
}
