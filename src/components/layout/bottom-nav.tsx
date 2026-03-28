'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();
    const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '553898416163';

    const navItems = [
        { name: 'Home', href: '/', icon: 'home' },
        { name: 'Catálogo', href: '/catalogo', icon: 'grid_view' },
        { name: 'Favoritos', href: '/favoritos', icon: 'favorite' },
        { name: 'Contato', href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: 'chat_bubble' }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 flex justify-between items-center px-6 py-3 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
            {navItems.map((item) => {
                const isExternal = item.href.startsWith('http');
                const isActive = !isExternal && (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));

                const linkContent = (
                    <>
                        <span className={`material-symbols-outlined ${isActive ? 'material-symbols-outlined-fill' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-[10px] font-bold tracking-wide">{item.name}</span>
                    </>
                );

                const className = `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`;

                if (isExternal) {
                    return (
                        <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                            {linkContent}
                        </a>
                    );
                }

                return (
                    <Link key={item.name} href={item.href} className={className}>
                        {linkContent}
                    </Link>
                );
            })}
        </div>
    );
}
