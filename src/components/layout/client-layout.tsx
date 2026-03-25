'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './bottom-nav';
import QuoteCartDrawer from '../ui/quote-cart-drawer';
import { WhatsappButton } from '../ui/whatsapp-button';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    return (
        <>
            {children}
            {!isAdmin && (
                <>
                    <QuoteCartDrawer />
                    <BottomNav />
                    <WhatsappButton />
                </>
            )}
        </>
    );
}
